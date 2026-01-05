import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Toast from "../components/Toast";

export default function Debts({ onLogout }) {
  const [debts, setDebts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [formAmount, setFormAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [editingDebt, setEditingDebt] = useState(null);

  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------------- CARGAR DEUDAS ----------------
  const loadDebts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/debts");
      setDebts(data);
    } catch (err) {
      addToast(err.message || "Error cargando deudas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  // ---------------- CREAR / EDITAR DEUDA ----------------
  const handleSubmitDebt = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formAmount || !formDescription) {
      setFormError("Todos los campos son obligatorios");
      return;
    }

    try {
      let res;
      if (editingDebt) {
        // Editar deuda
        res = await apiFetch(`/debts/${editingDebt.id}`, {
          method: "PUT",
          body: JSON.stringify({
            amount: Number(formAmount),
            description: formDescription,
          }),
        });
        addToast(res.message || "Deuda actualizada correctamente", "success");
      } else {
        // Crear deuda
        res = await apiFetch("/debts", {
          method: "POST",
          body: JSON.stringify({
            amount: Number(formAmount),
            description: formDescription,
          }),
        });
        addToast(res.message || "Deuda creada correctamente", "success");
      }

      // Limpiar formulario
      setFormAmount("");
      setFormDescription("");
      setEditingDebt(null);
      loadDebts();
    } catch (err) {
      let msg = err.message;
      if (msg.startsWith("{")) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed.message || "Error desconocido";
        } catch {}
      }
      addToast(msg, "error");
    }
  };

  // ---------------- ACCIONES ----------------
  const handlePayDebt = async (id) => {
    try {
      const res = await apiFetch(`/debts/${id}/pay`, { method: "PUT" });
      addToast(res.message || "Deuda pagada", "success");
      loadDebts();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleDeleteDebt = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta deuda?")) return;

    try {
      const res = await apiFetch(`/debts/${id}`, { method: "DELETE" });
      addToast(res.message || "Deuda eliminada correctamente", "success");
      loadDebts();
    } catch (err) {
      let msg = err.message;
      if (msg.startsWith("{")) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed.message || "Error desconocido";
        } catch {}
      }
      addToast(msg, "error");
    }
  };

  const handleEditDebtClick = (debt) => {
    setEditingDebt(debt);
    setFormAmount(debt.amount);
    setFormDescription(debt.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExportCSV = async () => {
    try {
      const res = await apiFetch("/debts/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "debts.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast("CSV exportado correctamente", "success");
    } catch (err) {
      addToast(err.message || "Error exportando CSV", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout(); // Redirige al login
  };

  const filteredDebts = debts.filter((d) => {
    if (filter === "paid") return d.paid;
    if (filter === "pending") return !d.paid;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            {editingDebt ? "Editar Deuda" : "Mis Deudas"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* FORMULARIO CREAR / EDITAR */}
        <form
          onSubmit={handleSubmitDebt}
          className="bg-white p-4 rounded-2xl shadow mb-4 flex flex-col gap-2"
        >
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <input
            type="number"
            placeholder="Monto"
            className="p-2 border rounded"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Descripción"
            className="p-2 border rounded"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 mt-2">
            {editingDebt && (
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                onClick={() => {
                  setEditingDebt(null);
                  setFormAmount("");
                  setFormDescription("");
                }}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-xl"
            >
              {editingDebt ? "Actualizar deuda" : "Agregar deuda"}
            </button>
          </div>
        </form>

        {/* BOTÓN EXPORTAR CSV */}
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl mb-4 hover:bg-blue-700 transition"
        >
          Exportar CSV
        </button>

        {/* FILTROS */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${
              filter === "pending" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`px-3 py-1 rounded ${
              filter === "paid" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Pagadas
          </button>
        </div>

        {/* LISTADO DE DEUDAS */}
        <div className="bg-white rounded-2xl shadow divide-y">
          {filteredDebts.length === 0 && !loading && (
            <p className="p-4 text-gray-500">No hay deudas</p>
          )}

          {filteredDebts.map((debt) => (
            <div
              key={debt.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{debt.description}</p>
                <p className="text-sm text-gray-500">${debt.amount}</p>
              </div>

              <div className="flex gap-2">
                {!debt.paid && (
                  <>
                    <button
                      onClick={() => handleEditDebtClick(debt)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handlePayDebt(debt.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                    >
                      Pagar
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteDebt(debt.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                >
                  Eliminar
                </button>
              </div>

              <span
                className={`ml-2 text-sm font-semibold ${
                  debt.paid ? "text-green-600" : "text-orange-600"
                }`}
              >
                {debt.paid ? "Pagada" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>

        {/* TOASTS */}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
