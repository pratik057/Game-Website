"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";
import UserRegister from "./components/User-register";
import UserLogin from "./components/User-Login";
import Userdashbord from "./components/User-Dashbord";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Routes>
          {/* If loading, show LoadingScreen */}
          {loading ? (
            <Route path="*" element={<LoadingScreen />} />
          ) : (
            <>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/dashboard" element={<Userdashbord />} />

            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
