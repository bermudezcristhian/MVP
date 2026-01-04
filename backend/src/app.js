const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require("./routes/auth.routes");
const debtRoutes = require("./routes/debt.routes");
const userRoutes = require("./routes/user.routes");

// Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/debts", debtRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando correctamente 🚀",
  });
});

module.exports = app;