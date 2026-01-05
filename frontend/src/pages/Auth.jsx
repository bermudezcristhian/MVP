import { useState } from "react";
import { apiFetch } from "../api/api";

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Registro
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        const res = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        localStorage.setItem("token", res.token);
        onAuth(); // notificamos al App
      } else {
        // REGISTRO
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        // luego de registrar, cambiamos a login
        setIsLogin(true);
        setError("Usuario creado, ahora ingresa");
      }
    } catch (err) {
      setError("Error en credenciales o registro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2 rounded-xl mb-2">
          {isLogin ? "Entrar" : "Crear cuenta"}
        </button>

        <p
          className="mt-2 text-sm text-center text-gray-600 cursor-pointer hover:text-black"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </p>
      </form>
    </div>
  );
}
