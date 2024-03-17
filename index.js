const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

// io server side instance
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Sever is running");
});

io.on("connection", (socket) => {
  // pass message -me- when i join
  socket.emit("me", socket.id);

  // pass message when call ended
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  // when calling a person
  socket.on("callUser", ({ usertoCall, signalData, from, name }) => {
    io.to(usertoCall).emit("callUser", { signal: signalData, from, name });
  });

  // when answering a call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
