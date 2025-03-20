const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const dailyReportRoutes = require("./routes/dailyReportRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const authRoute = require('./routes/authRoute'); 
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow credentials (e.g., cookies)
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/students", dailyReportRoutes(io)); // Pass `io` to dailyReportRoutes
app.use("/api/teachers", teacherRoutes);
app.use('/api/auth', authRoute);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

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