const prisma = require("../config/prisma");
const redis = require("../config/redis");

/**
 * Crear deuda
 * ❌ No permite valores negativos ni cero
 */
exports.createDebt = async (data) => {
  const { userId, amount, description } = data;

  if (amount <= 0) {
    throw new Error("No se pueden registrar deudas con valores negativos o cero");
  }

  const debt = await prisma.debt.create({
    data: {
      userId,
      amount,
      description,
      paid: false,
    },
  });

  // Invalida cache
  await redis.del(`debts:user:${userId}`);
  await redis.del(`summary:user:${userId}`);

  return debt;
};

/**
 * Listar deudas por usuario (con cache)
 */
exports.getDebtsByUser = async (userId) => {
  const cacheKey = `debts:user:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached;
  }

  const debts = await prisma.debt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  await redis.setEx(cacheKey, 60, debts); // TTL 60s

  return debts;
};

/**
 * Pagar deuda
 * ❌ Una deuda pagada no puede modificarse
 */
exports.payDebt = async (id) => {
  const debt = await prisma.debt.findUnique({ where: { id } });

  if (!debt) {
    throw new Error("La deuda no existe");
  }

  if (debt.paid) {
    throw new Error("La deuda ya está pagada y no puede modificarse");
  }

  const updated = await prisma.debt.update({
    where: { id },
    data: { paid: true },
  });

  // Invalida cache
  await redis.del(`debts:user:${debt.userId}`);
  await redis.del(`summary:user:${debt.userId}`);

  return updated;
};

/**
 * Eliminar deuda
 * ❌ No permite eliminar deudas pagadas
 */
exports.deleteDebt = async (id) => {
  const debt = await prisma.debt.findUnique({ where: { id } });

  if (!debt) {
    throw new Error("La deuda no existe");
  }

  if (debt.paid) {
    throw new Error("La deuda ya está pagada y no puede modificarse");
  }

  await redis.del(`debts:user:${debt.userId}`);
  await redis.del(`summary:user:${debt.userId}`);

  return prisma.debt.delete({ where: { id } });
};

/**
 * (Extra) Resumen por usuario (con cache)
 */
exports.getSummaryByUser = async (userId) => {
  const cacheKey = `summary:user:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached;
  }

  const debts = await prisma.debt.findMany({
    where: { userId },
  });

  const totalPaid = debts
    .filter(d => d.paid)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPending = debts
    .filter(d => !d.paid)
    .reduce((sum, d) => sum + d.amount, 0);

  const summary = {
    totalPaid,
    totalPending,
    balance: totalPending,
  };

  await redis.setEx(cacheKey, 60, summary);

  return summary;
};

/**
 * (Extra) Exportar deudas
 */
exports.getDebtsForExport = async (userId) => {
  return prisma.debt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
