let debts = [];
let nextId = 1;

exports.createDebt = ({ userId, amount, description }) => {
  if (!userId || !amount || !description) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (amount <= 0) {
    throw new Error("El valor de la deuda no puede ser negativo o cero");
  }

  const debt = {
    id: nextId++,
    userId,
    amount,
    description,
    paid: false,
    createdAt: new Date()
  };

  debts.push(debt);
  return debt;
};

exports.getDebtsByUser = (userId) => {
  return debts.filter(d => d.userId === userId);
};

exports.payDebt = (id) => {
  const debt = debts.find(d => d.id === id);

  if (!debt) {
    throw new Error("Deuda no encontrada");
  }

  // 🔴 VALIDACIÓN CLAVE (la que te falta)
  if (debt.paid) {
    throw new Error("La deuda ya está pagada y no puede modificarse");
  }

  debt.paid = true;
  return debt;
};
