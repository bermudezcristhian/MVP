const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const debtRoutes = require("./routes/debt.routes"); // 👈 IMPORTANTE

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/debts", debtRoutes); // 👈 AQUÍ ESTABA EL ERROR

// Ruta base de prueba
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando correctamente 🚀",
  });
});

module.exports = app;
