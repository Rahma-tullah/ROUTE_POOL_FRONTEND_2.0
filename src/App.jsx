// src/App.jsx
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import RetailerDashboard from "./pages/RetailerDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import LandingPage from "./pages/LandingPage";
import {
  getToken,
  clearToken,
  saveToken,
  getCurrentUser,
} from "./api/auth.api";

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await getCurrentUser();
          setUser(res.data.user);
        } catch {
          clearToken();
        }
      }
      setReady(true);
    };
    init();
  }, []);

  const handleAuth = (data) => {
    if (data?.token) saveToken(data.token);
    if (data?.user) setUser(data.user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setShowAuth(false);
  };

  if (!ready)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}>
        <div className="w-6 h-6 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
      </div>
    );

  if (user) {
    if (user.user_type === "rider")
      return <RiderDashboard user={user} onLogout={handleLogout} />;
    return <RetailerDashboard user={user} onLogout={handleLogout} />;
  }

  if (showAuth)
    return <AuthPage onAuth={handleAuth} onBack={() => setShowAuth(false)} />;

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
