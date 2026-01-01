const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Basic middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use(authRoutes);
app.use(userRoutes);

module.exports = app;