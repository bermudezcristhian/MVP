const debtService = require("../services/debt.service");

exports.create = (req, res) => {
  try {
    const debt = debtService.createDebt(req.body);
    res.status(201).json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listByUser = (req, res) => {
  const userId = Number(req.params.userId);
  const debts = debtService.getDebtsByUser(userId);
  res.json(debts);
};

exports.pay = (req, res) => {
  try {
    const debt = debtService.payDebt(Number(req.params.id));
    res.json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }



};