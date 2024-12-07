import Login from "./components/Login";
import ListeNotes from "./components/ListeNotes";
import UpdatePassword from "./components/updatePassword";
import "./style.css";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

function App() {
  const [isConnected, SetIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      SetIsConnected(true);
    } else {
      SetIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (location.pathname === "/login") {
        navigate("/login");
      }
    } else if (location.pathname !== "/change-password") {
      navigate("/login");
    }
  }, [isConnected, navigate, location.pathname]);
  return (
    <Routes>
      <Route
        path="/ListeNotes"
        element={<ListeNotes SetIsConnected={SetIsConnected} />}
      />
      <Route
        path="/login"
        element={<Login SetIsConnected={SetIsConnected} />}
      />
      <Route path="/change-password" element={<UpdatePassword />} />
    </Routes>
  );
}
export default App;
