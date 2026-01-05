const debtService = require("../services/debt.service");

exports.create = async (req, res) => {
  try {
    const userId = req.user.userId; // 🔐 DEL TOKEN
    const debt = await debtService.createDebt({
      ...req.body,
      userId,
    });
    res.status(201).json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const debts = await debtService.getDebtsByUser(userId);
    res.json(debts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.pay = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const debt = await debtService.payDebt(id);
    res.json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await debtService.deleteDebt(id);
    res.json({ message: "Deuda eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.summary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const summary = await debtService.getSummaryByUser(userId);
    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const { createObjectCsvStringifier } = require("csv-writer");

exports.exportCSV = async (req, res) => {
  try {
    const userId = req.user.userId;
    const debts = await debtService.getDebtsForExport(userId);

    if (!debts.length) {
      return res.status(404).json({ message: "No hay deudas para exportar" });
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "id", title: "ID" },
        { id: "amount", title: "MONTO" },
        { id: "description", title: "DESCRIPCIÓN" },
        { id: "paid", title: "PAGADA" },
        { id: "createdAt", title: "FECHA" },
      ],
    });

    const header = csvStringifier.getHeaderString();
    const records = csvStringifier.stringifyRecords(debts);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=deudas_usuario_${userId}.csv`
    );

    res.send(header + records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


