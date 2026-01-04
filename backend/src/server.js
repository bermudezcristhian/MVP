const express = require("express");
const app = express();

const debtRoutes = require("./routes/debt.routes");

// ✅ Middleware para JSON
app.use(express.json());

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando correctamente 🚀",
  });
});

// ✅ Montar rutas
app.use("/api/debts", debtRoutes);

// ✅ Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
