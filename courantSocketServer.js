const socketIo = require("socket.io");
const chalk = require("chalk");
const createTwilio = require("twilio");

const logger = new Proxy(console.log, {
  get(target, prop) {
    return (...args) => console[prop](...args);
  },
});

function fmt(msg, room) {
  return `${chalk.blue(`${room}:`.padEnd(15, " "))} ${msg}`;
}

module.exports.logger = logger;

module.exports.initializeCourantSocketServer = function (
  { server },
  { accountSid, authToken }
) {
  const twilio = createTwilio(accountSid, authToken);

  function initializeStreams(io, logger = () => {}) {
    return (socket) => {
      socket.on("disconnecting", function () {
        Object.keys(this.rooms)
          .filter((a) => a !== this.id)
          .forEach((room) => {
            logger(`A client disconnected from a room`, room);
            socket.in(room).emit("courant:end", room);
            socket.leave(room);
          });
      });
      socket.on("courant:join", function (room) {
        const clients = io.sockets.adapter.rooms[room];
        if (clients && this.id in clients.sockets) {
          console.log("joining");
          socket.join(room);

          socket.broadcast.to(room).emit("courant:initiate", room);
          socket.in(room).emit("courant:ready", room);
          return;
        }
        //   console.log({ clients: io.sockets.clients(room) })
        // switch (clients?.length ?? 0) {
        switch ((clients && clients.length) || 0) {
          case 0:
            logger(`A client created a room`, room);
            socket.join(room);
            break;
          case 1:
            logger("A client joined a room", room);

            socket.join(room);
            socket.broadcast.to(room).emit("courant:initiate", room);
            socket.in(room).emit("courant:ready", room);
            break;
          default:
            logger("A client attempted to join a full room", room);
            // socket.emit("courant:full", room);
            socket.in(room).emit("courant:end", room);
            break;
        }
      });

      socket.on("courant:leave", function (room) {
        logger("User is leaving", room);
        socket.leave(room);
        socket.broadcast.to(room).emit("courant:end");
      });

      socket.on("courant:token", async function (room) {
        logger("create twilio token", room);
        const response = await twilio.tokens.create();
        socket.emit("courant:token", response).to(room);
      });

      ["courant:candidate", "courant:offer", "courant:answer"].forEach(
        (action) => {
          socket.on(action, function (data, room) {
            socket.broadcast.to(room).emit(action, data);
          });
        }
      );
    };
  }
  const io = socketIo(server, {
    path: "/courant",
    allowUpgrades: false,
  });

  io.on(
    "connection",
    initializeStreams(io, (msg, room) => logger(fmt(msg, room)))
  );
};

module.exports.CourantVitePlugin = (twilioOptions) => ({ server }) => {
  initializeCourantSocketServer({ server }, twilioOptions);
};
