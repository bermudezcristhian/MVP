import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/useAuth";

function App() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}

export default App;
