import { useState } from "react";
import Auth from "./pages/Auth";
import Debts from "./pages/Debts";

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return isAuth ? (
    <Debts onLogout={() => setIsAuth(false)} />
  ) : (
    <Auth onAuth={() => setIsAuth(true)} />
  );
}
