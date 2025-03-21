
"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
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
         
        <div className="flex flex-col min-h-screen bg-gray-900 text-white"> 
            <main className="h-full w-full flex-grow+9  ">
              {loading ? (
                <LoadingScreen />
              ) : (
                <Routes>
                  {/* Authentication & User Dashboard */}
                  <Route path="/" element={<LoginScreen />} />
                  <Route path="/register" element={<UserRegister />} />
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/walet" element={<Wallate />} />
                  <Route path="/logout" element={<Logout />} />
                  {/* Game Pages */}
                
                  <Route path="/game" element={<Game />} />
                  <Route path="/history" element={<History />} />
                </Routes>
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
