let debts = [];

exports.createDebt = ({ userId, amount, description }) => {
  if (amount <= 0) {
    throw new Error("El valor de la deuda debe ser positivo");
  }

  const debt = {
    id: debts.length + 1,
    userId,
    amount,
    description,
    paid: false,
    createdAt: new Date(),
  };

  debts.push(debt);
  return debt;
};

exports.getDebtsByUser = (userId) => {
  return debts.filter((d) => d.userId === userId);
};

exports.payDebt = (id) => {
  const debt = debts.find((d) => d.id === id);

  if (!debt) {
    throw new Error("Deuda no encontrada");
  }

  debt.paid = true;
  return debt;
};
