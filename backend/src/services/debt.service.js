const prisma = require("../config/prisma");

/**
 * Crear deuda
 * No permite valores negativos ni cero
 */
exports.createDebt = async (data) => {
  const { userId, amount, description } = data;

  if (amount <= 0) {
    throw new Error("No se pueden registrar deudas con valores negativos o cero");
  }

  return prisma.debt.create({
    data: {
      userId,
      amount,
      description,
      paid: false,
    },
  });
};

/**
 * Listar deudas por usuario
 */
exports.getDebtsByUser = async (userId) => {
  return prisma.debt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Pagar deuda
 * ❌ Una deuda pagada no puede modificarse
 */
exports.payDebt = async (id) => {
  const debt = await prisma.debt.findUnique({
    where: { id },
  });

  if (!debt) {
    throw new Error("La deuda no existe");
  }

  if (debt.paid) {
    throw new Error("La deuda ya está pagada y no puede modificarse");
  }

  return prisma.debt.update({
    where: { id },
    data: { paid: true },
  });
};

/**
 * Eliminar deuda
 * ❌ No permite eliminar deudas pagadas
 */
exports.deleteDebt = async (id) => {
  const debt = await prisma.debt.findUnique({
    where: { id },
  });

  if (!debt) {
    throw new Error("La deuda no existe");
  }

  if (debt.paid) {
    throw new Error("La deuda ya está pagada y no puede modificarse");
  }

  return prisma.debt.delete({
    where: { id },
  });
};

/**
 * (Extra) Obtener resumen por usuario
 */
exports.getSummaryByUser = async (userId) => {
  const totalPagado = await prisma.debt.aggregate({
    where: { userId, paid: true },
    _sum: { amount: true },
  });

  const saldoPendiente = await prisma.debt.aggregate({
    where: { userId, paid: false },
    _sum: { amount: true },
  });

  return {
    totalPagado: totalPagado._sum.amount || 0,
    saldoPendiente: saldoPendiente._sum.amount || 0,
  };
};

exports.getSummaryByUser = async (userId) => {
  const debts = await prisma.debt.findMany({
    where: { userId }
  });

  const totalPaid = debts
    .filter(d => d.paid)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPending = debts
    .filter(d => !d.paid)
    .reduce((sum, d) => sum + d.amount, 0);

  return {
    totalPaid,
    totalPending,
    balance: totalPending
  };
};

exports.getDebtsForExport = async (userId) => {
  return prisma.debt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};


