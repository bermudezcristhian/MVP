exports.validateCreateDebt = (req, res, next) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount || !description) {
    return res.status(400).json({
      message: "userId, amount y description son obligatorios"
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      message: "El valor de la deuda debe ser un número mayor a cero..."
    });
  }

  next();
};
