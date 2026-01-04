const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

exports.createUser = async (data) => {
  const { email, password } = data;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
};
