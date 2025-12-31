const bcrypt = require("bcryptjs");

const users = []; // luego será PostgreSQL

exports.register = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email y password son obligatorios");
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    throw new Error("Usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(user);

  return {
    id: user.id,
    email: user.email,
  };
};
