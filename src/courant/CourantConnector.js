import { ref, computed } from "vue";

const logger = new Proxy(console.log, {
  get(target, prop) {
    return (...args) => console[prop](...args);
  },
});

/** @param {Symbol} courantSymbol provide/inject symbol */
export const courantSymbol = Symbol("courant");


// https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/resolution/js/main.js
const resolution720P = {
  video: {width: {exact: 1280}, height: {exact: 720}},
  audio: true
};

/**
 * Retrieves the users media stream
 *
 * @param {string} type camera|screen
 * @param {object} options getUserMedia/getDisplayMedia options
 *
 * @return {Promise}
 */
function getMediaStream(
  type = "camera",
  options = type === "camera"
    ? resolution720P
    : { audio: false, video: true }
) {
  const mediaRequest = type === "camera" ? "getUserMedia" : "getDisplayMedia";
  return navigator.mediaDevices[mediaRequest](options);
}

/**
 * React style useState hook
 *
 * @param {any} starting starting value
 * @param {function?} logger callback when value changes
 *
 * @return {array}
 */
function useState(starting, logger = null) {
  const toggle = ref(starting);
  const setToggle = (value) => {
    logger?.(value);
    toggle.value = value;
  };
  return [toggle, setToggle];
}

export function createCourant({
  room,
  socket,
  initialMode = "camera",
  username,
}) {
  let dataChannel = null;
  let peerConnection = null;
  let localICECandidates = new Set();

  const [localStream, setLocalStream] = useState(null, (stream) =>
    logger(stream ? "Setting Local Stream" : "Clearing Local Stream")
  );
  const [remoteStream, setRemoteStream] = useState(null, (stream) =>
    logger(stream ? "Setting Remote Stream" : "Clearing Remote Stream")
  );
  const [connected, setConnected] = useState(false, (connect) =>
    logger(connect ? `Connected` : "Disconnected")
  );
  const [initiate, setInitiate] = useState(false, (initiate) =>
    logger(initiate ? `Will Initiate` : "Will Not Initiate")
  );
  const [audioIsActive, setAudioIsActive] = useState(true, (active) =>
    logger(active ? "Enabling Microphone" : "Disabling Microphone")
  );
  const [videoIsActive, setVideoIsActive] = useState(true, (active) =>
    logger(active ? "Enabling Webcam" : "Disabling Webcam")
  );

  const mode = ref(initialMode);
  const toggleMode = () => {
    const modes = { screen: "camera", camera: "screen" };
    mode.value = modes[mode.value];
  };

  const messageMap = new Map();
  const messages = ref([]);
  let messageCallback = () => { }
  function setMessageCallback(callback) {
    messageCallback = callback
  }
  function appendMessage(msg) {
    messageCallback(msg)
    messageMap.set(msg.id, msg);
    messages.value = [...messageMap.values()];
  }

  function parseMessage(message) {
    const msg = JSON.parse(message);
    msg.timestamp = new Date(msg.timestamp).toUTCString();
    return msg;
  }

  function packageMessage(message) {
    const msg = {
      username,
      id: `${room}::${messageMap.size + 1}`,
      timestamp: new Date().toUTCString(),
      message,
    };
    return msg;
  }

  function sendMessage(message) {

    const msg = packageMessage(message);
    appendMessage(msg);
    if (!dataChannel) {
      return false
    }
    dataChannel.send(`courant-chat://${JSON.stringify(msg)}`);
  }

  async function connect(event) {
    logger("Connecting");
    try {
      if (!localStream.value) {
        const stream = await getMediaStream(mode.value);
        setLocalStream(stream);
      }
      socket.emit("courant:join", room);
    } catch (error) {
      logger.error(error);
      setTimeout(connect, 1000);
    }
  }

  function disconnect(emitted = false) {
    console.log({ emitted })
    logger("Disconnecting");

    // disable all tracks
    remoteStream.value?.getTracks().forEach((track) => track.stop());

    // clear handles
    setRemoteStream(null);

    // leave room
    if (emitted !== true) {
      setConnected(false);
      socket.emit("courant:leave", room);
    }
    socket.off("courant:token");

    setInitiate(false);

    peerConnection?.close();

    peerConnection = null;
    dataChannel = null;
    localICECandidates.clear();
  }

  /** Primary Socket Callbacks */
  socket.on("courant:initiate", onInitiate);
  socket.on("courant:ready", onReady);
  socket.on("courant:candidate", onCandidate);
  socket.on("courant:offer", onOffer);
  socket.on("courant:answer", onAnswer);
  socket.on("courant:full", onFull);
  socket.on("courant:end", onEnd);

  function onEnd() {
    console.log("Disconglkdfjgkldfjgljdflgkjdfklnecting")
    disconnect(true);
  }

  function onAnswer(answer) {
    const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    peerConnection.setRemoteDescription(rtcAnswer);
    localICECandidates.forEach((candidate) => {
      socket.emit("courant:candidate", JSON.stringify(candidate), room);
    });
    localICECandidates.clear();
  }

  function onCandidate(candidate) {
    const rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    peerConnection?.addIceCandidate(rtcCandidate);
  }

  function onFull() {
    logger.warn("Chat room is full");
  }

  function onOffer(offer) {
    socket.on("courant:token", (token) => createAnswer(token, offer));
    socket.emit("courant:token", room);
  }

  function onReady() {
    if (initiate.value) {
      socket.on("courant:token", createOffer);
      socket.emit("courant:token", room);
    }
  }

  function onInitiate() {
    setInitiate(true);
  }

  function createOffer(token) {
    logger("Initializing Peer Connection (createOffer)");
    peerConnection = initializePeerConnection(token, localStream.value, socket);

    logger("Initializing Data Connection (createOffer)");
    dataChannel = initializeDataChannel(peerConnection);

    logger("Creating Offer");
    peerConnection.createOffer(
      (offer) => {
        logger("Offer Created");
        peerConnection.setLocalDescription(offer);
        socket.emit("courant:offer", JSON.stringify(offer), room);
      },
      (err) => {
        logger.error("Failed to Create Offer");
        logger.error(err);
      }
    );
  }

  function createAnswer(token, offer) {
    logger("Initializing Peer Connection (createAnswer)");
    peerConnection = initializePeerConnection(token, localStream.value, socket);

    logger("Initializing Data Connection (createAnswer)");
    dataChannel = initializeDataChannel(peerConnection);

    logger("Creating Answer");
    const rtcOffer = new RTCSessionDescription(JSON.parse(offer));
    peerConnection.setRemoteDescription(rtcOffer);
    peerConnection.createAnswer(
      (answer) => {
        logger("Answer created");
        peerConnection.setLocalDescription(answer);
        socket.emit("courant:answer", JSON.stringify(answer), room);
      },
      (err) => {
        logger.error("Failed to create answer.");
        logger.error(err);
      }
    );
  }
  /** End Primary Socket Callbacks */

  /**
   * Initializes a Peer Connection
   *
   * @param {object} token
   * @param {object} localStream
   * @param {object} socket
   * @return {RTCPeerConnection}
   */
  function initializePeerConnection(token, localStream, socket) {
    const pc = new RTCPeerConnection({ iceServers: token.iceServers });
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      if (connected.value) {
        socket.emit("courant:candidate", JSON.stringify(event.candidate), room);
      } else {
        localICECandidates.add(event.candidate);
      }
    };

    pc.onaddstream = (event) => {
      setRemoteStream(event.stream);
      setConnected(true);
    };

    pc.oniceconnectionstatechange = (event) => {
      const state = pc.iceConnectionState.replace(/[a-z]/, ($1) =>
        $1.toUpperCase()
      );
      logger(`Ice Connection Updated: ${state}`);
    };

    return pc;
  }

  /**
   * Initialize Data Channel
   *
   * @param {RTCPeerConnection} pc
   * @return {RTCDataChannel}
   */
  function initializeDataChannel(pc) {
    const dc = pc.createDataChannel("chat", {
      negotiated: true,
      id: 0,
    });

    dc.onmessage = (event) => {
      const dataChannelRegex = /^courant-(?<proto>[a-z]{4,8}):\/\/(?<message>.*$)/g;
      const results = event.data.matchAll(dataChannelRegex);
      for (let result of results) {
        const { proto, message } = result.groups;
        switch (proto) {
          case "chat":
            const msg = parseMessage(message);
            appendMessage(msg);
            break;
        }
      }
    };

    return dc;
  }

  /**
   * Finds the local sender by track type
   *
   * @param {string} type
   * @return {RTCRtpSender}
   */
  function findSenderByType(type) {
    return peerConnection.getSenders().find((s) => s.track.kind === type);
  }

  /**
   * Toggles the tracks of the given type
   *
   * @param {string} type audio|video
   * @return {boolean}
   */
  function toggleTrackType(type) {
    const sender = findSenderByType(type);
    sender.track.enabled = !sender.track.enabled;
    return sender.track.enabled;
  }

  /**
   * Toggles Local Microphone
   */
  function toggleAudio() {
    const enabled = toggleTrackType("audio");
    setAudioIsActive(enabled);
  }

  /**
   * Toggles Local Video
   */
  function toggleVideo() {
    const enabled = toggleTrackType("video");
    setVideoIsActive(enabled);
  }

  /**
   * Toggle between Screen Share & Webcam
   */
  async function toggleScreenShare() {
    // If currently sharing screen, stop
    if (mode.value === "screen") {
      localStream.value.getTracks().forEach((track) => track.stop());
    }

    // Change display mode, screen => camera & camera => screen
    toggleMode();

    // Get Video/Audio Stream
    const stream = await getMediaStream(mode.value);
    setLocalStream(stream);

    // Get current video track
    const videoTrack = stream.getVideoTracks()[0];

    if (!connected.value) {
      connect();
      return;
    }

    findSenderByType(videoTrack.kind).replaceTrack(videoTrack);
    setLocalStream(stream);
  }

  return {
    // Connections
    isConnected: connected,
    connect,
    disconnect,

    // Streams
    streams: {
      local: localStream,
      remote: remoteStream,
    },

    // Messages
    messages: {
      all: messages,
      sendMessage: sendMessage,
      setMessageCallback: setMessageCallback
    },

    // Controls
    controls: {
      screenShare: {
        toggle: toggleScreenShare,
        isActive: computed(() => mode.value === "screen"),
      },
      audio: {
        toggle: toggleAudio,
        isActive: audioIsActive,
      },
      video: {
        toggle: toggleVideo,
        isActive: videoIsActive,
      },
    },
  };
}
