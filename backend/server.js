const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const dailyReportRoutes = require("./routes/dailyReportRoutes");
const teacherRoutes = require("./routes/teacherRoutes"); // Import teacher routes
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true // If you need to allow credentials
  }
}); // Initialize Socket.IO with the HTTP server

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // If you need to allow cookies or credentials
}));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/students", dailyReportRoutes); // Add daily report routes
app.use("/api/teachers", teacherRoutes); // Add teacher routes

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Student and Teacher Management API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});