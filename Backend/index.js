import dotenv from "dotenv";
import connectDB from "./database/index.js";
import {createServer} from 'http'
import app from "./app.js";
import { Server } from "socket.io";
import { authenticate } from "./middleware/auth-socket.middleware.js";

dotenv.config({
  path: "./.env",
});


const server = createServer(app)

const io = new Server(server,{
  cors:{
    origin: 'http://localhost:5173',
    credentials: true
  }
})

  io.use(authenticate)

io.on('connection', (socket)=>{
  console.log("User connected :", socket.id)
  socket.on('message', (data)=>{
    io.to(data.id).emit('recieve',  {
      message: data.message,
      sender: socket.id, // Optional: Include the sender ID
    })
    socket.emit('recieve', {
      message: data.message,
      sender: 'You',
    });
  })
})


connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed :", err);
  });
