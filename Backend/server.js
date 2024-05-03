const express = require('express');
const app = express();
const { chats } = require('./Data/data');
const dotenv = require('dotenv');
const cors = require('cors');
const connectMomgoDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require("./Routes/messageRoutes")
const { notFound, errorHandler } = require('./Middlewares/errorMiddleware');
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
dotenv.config();
connectMomgoDB();
app.use(cors());
app.use(express.json()); //to accept json data
const PORT = process.env.PORT || 4000; // This will default to 4000 if PORT is not set in the environment variables
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"], // Allow GET and POST requests
        // allowedHeaders: ["my-custom-header"], // Allow the 'my-custom-header' header
        //credentials: true // Allow credentials (cookies, authorization headers, etc.)
    },
    pingTimeout: 60000 // Set the pingTimeout option to 60 seconds
});
io.on('connection', (socket) => {
    console.log(`A user connected with ${socket.id} `); // Log when a user connects

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`user join the room  : ${room}`);
    });


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));


    socket.on("new message", (newMessageReceived) => {
        //console.log("newMessagesReceived : ", newMessageReceived);
        var chat = newMessageReceived.chat;
        //console.log("chat : ", chat);
        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id)
                return;

            socket.in(user._id).emit("message recieved", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected'); // Log when a user disconnects
    });
});


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------


app.use(notFound)
app.use(errorHandler)

/*app.listen(PORT, () => {
    console.log(`Server is running on Port no ${PORT}`.yellow.bold);
});*/
server.listen(PORT, () => {
    console.log(`Server is running on Port no ${PORT}`.yellow.bold);
});