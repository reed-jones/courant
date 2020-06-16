import dotenv from "dotenv"
import createTwilio from 'twilio'
import express from 'express'
import chalk from 'chalk'
import http from 'http'
import socketIo from 'socket.io'

dotenv.config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, PORT = 3000 } = process.env
const app = express();
const twilio = createTwilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const server = http.createServer(app);
const io = socketIo(server);

const logger = new Proxy(console.log, {
  get(target, prop) {
    return (...args) => console[prop](...args);
  },
});

function fmt(msg, room) {
  return `${chalk.blue(`${room}:`.padEnd(15, ' '))} ${msg}`;
}

function initializeStreams(socket) {
  socket.on("courant:join", function (room) {
    const clients = io.sockets.adapter.rooms[room];
    // switch (clients?.length ?? 0) {
    switch (clients && clients.length || 0) {
      case 0:
        logger(fmt(`A client created a room`, room));
        socket.join(room);
        break;
      case 1:
        logger(fmt("A client joined a room", room));
        socket.join(room);
        socket.broadcast.to(room).emit("courant:initiate", room);
        socket.in(room).emit("courant:ready", room);
        break;
      default:
        logger(fmt("A client attempted to join a full room", room));
        socket.emit("courant:full", room);
        break;
    }
  });

  socket.on('courant:leave', function (room) {
    logger(fmt("User is leaving", room))
    socket.leave(room)
  })

  socket.on("courant:token", async function (room) {
    logger(fmt("create twilio token", room))
    const response = await twilio.tokens.create();
    socket.emit("courant:token", response).to(room);
  });

  ['courant:candidate', 'courant:offer', 'courant:answer'].forEach(action => {
    socket.on(action, function (data, room) {
      logger(fmt(`Received ${action}. Broadcasting...`, room));
      socket.broadcast.to(room).emit(action, data);
    });
  })
}

// SocketIO listeners
io.on("connection", initializeStreams);
server.listen(PORT, () => logger(`Now listening on ${chalk.yellow(`http://localhost:${PORT}`)}`));
