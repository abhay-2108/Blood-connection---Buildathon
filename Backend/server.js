const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const hospitalRoutes = require("./routes/hospitalRoutes.js");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const donorRoutes = require("./routes/donorRoutes");
const { verifyEmailService } = require('./utils/emailService');
const predictRoute = require('./routes/predict');
const contactRoutes = require("./routes/contactRoutes")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
verifyEmailService();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/donate", donorRoutes);
app.use("/api/donors", donorRoutes); 
app.use('/api/predict', predictRoute);
app.use("/api/contact", contactRoutes)

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process with failure
    });

const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is in use, trying another port...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
};

startServer(PORT);
