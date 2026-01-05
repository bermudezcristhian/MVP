import api from "../api/axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    api.get("/debts")
      .then((res) => setDebts(res.data))
      .catch(() => alert("No autorizado"));
  }, []);

  return (
    <>
      <h1>Mis Deudas</h1>
      <ul>
        {debts.map((d) => (
          <li key={d.id}>{d.description} - ${d.amount}</li>
        ))}
      </ul>
    </>
  );
}
