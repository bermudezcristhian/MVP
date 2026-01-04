const express = require("express");
const router = express.Router();
const debtController = require("../controllers/debt.controller");

router.post("/", debtController.create);
router.get("/user/:userId", debtController.listByUser);
router.get("/user/:userId/summary", debtController.summary);
router.get("/user/:userId/export/csv", debtController.exportCSV);
router.patch("/:id/pay", debtController.pay);
router.delete("/:id", debtController.remove);

module.exports = router;
