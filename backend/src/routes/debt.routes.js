const express = require("express");
const router = express.Router();

const debtController = require("../controllers/debt.controller");
const auth = require("../middlewares/auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");


// Crear deuda
router.post("/", auth, debtController.create);

// Listar deudas por usuario
router.get("/", auth, debtController.listByUser);

// Marcar deuda como pagada
router.put("/:id/pay", auth, debtController.pay);

// Eliminar deuda
router.delete("/:id", auth, debtController.remove);

// Resumen de deudas
router.get("/summary", auth, debtController.summary);

// Exportar CSV
router.get("/export", auth, debtController.exportCSV);

// editar deuda
router.put("/:id", authMiddleware, debtController.updateDebt);

module.exports = router;
