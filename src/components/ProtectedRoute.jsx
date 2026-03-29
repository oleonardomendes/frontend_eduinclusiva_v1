// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/api/api";

function isValidToken(t) {
  if (!t) return false;
  try {
    const { exp } = JSON.parse(atob(t.split(".")[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!isValidToken(t)) {
      localStorage.removeItem("token");
      setOk(false);
      return;
    }
    api.get("/auth/me")
      .then(() => setOk(true))
      .catch(() => {
        localStorage.removeItem("token");
        setOk(false);
      });
  }, []);

  if (ok === null) return <div style={{ padding: 24 }}>Carregando…</div>;
  return ok ? children : <Navigate to="/login" replace />;
}