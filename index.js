const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/database");
const cors = require("cors");
const cloud = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
app.use(express.json());
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const httpServer = require("http").Server(app);
dotenv.config();
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
const io = require("socket.io")(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "https://mychat-vert.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected socket", socket.id);

  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log(user._id);
    socket.emit("connected");
  });

  socket.on("join room", (room) => {
    socket.join(room._id);
    console.log("user joined room" + room._id);
  });
  socket.on("type", (room) => {
    console.log(room.sender, "sender");
    socket.to(room.chat).emit("type", room.sender);
  });
  socket.on("stop type", (room) => {
    socket.to(room).emit("stop type");
  });

  socket.on("new message", (message) => {
    console.log(message);
    var chat = message.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == message.sender._id) return;

      socket.to(user._id).emit("message received", message);
    });
  });
});
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());
app.use("/api/v1", userRoute);
app.use("/api/v1", chatRoute);
app.use("/api/v1", messageRoute);
db();
cloud();
