const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password requeridos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Usuario creado",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "El email ya existe" });
    }
    res.status(500).json({ message: "Error en registro", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
};
