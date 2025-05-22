"use client";

import { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, UserContext } from "./context/UserContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Components & Pages
import Wallate from "./components/walate";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";
import UserRegister from "./components/User-register";
import UserLogin from "./components/User-Login";
import UserDashboard from "./components/User-Dashbord";
import Logout from "./components/logout"
import Game from "./pages/Game";
import History from "./pages/History";
import Rules from "./pages/Rules";
import ForgotPassword from "./pages/forgetPasword";
import ResetPassword from "./pages/ResetPasword";
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
    <UserProvider>
      <SocketProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-800 text-white">
            <main className="h-full w-full flex-grow">
              {loading ? (
                <LoadingScreen />
              ) : (
                <UserContext.Consumer>
                {({ user }) => (
                  <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginScreen />} />
                    <Route path="/register" element={<UserRegister />} />
                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/" />} />
                    <Route path="/wallet" element={user ? <Wallate /> : <Navigate to="/" />} />
                    <Route path="/logout" element={user ? <Logout /> : <Navigate to="/" />} />
                    <Route path="/game" element={user ? <Game /> : <Navigate to="/" />} />
                    <Route path="/history" element={user ? <History /> : <Navigate to="/" />} />
                    <Route path="/Rules" element={user ? <Rules /> : <Navigate to="/" />} />

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Routes>
                )}
              </UserContext.Consumer>
              )}
            </main>
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
        </Router>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
