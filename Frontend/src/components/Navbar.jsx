"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import LoginModal from "./User-Login";
import RegisterModal from "./User-register";
import Logo from "../assets/logo.png";
import "../css/custom.css"
const Navbar = () => {
  const { user, balance, logout } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className=" w-full bg-gradient-to-r bg-gray-800 border-gray-700 shadow-lg relative">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center sm:justify-start"
            >
              <img
                src={Logo || "/placeholder.svg"}
                alt="Andar Bahar"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mr-2 drop-shadow-lg transition-all duration-300"
              />
            </Link>

            <div className="hidden md:block ml-10 ">
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/20"
                >
                  Home
                </Link>
                <Link
                  to="/history"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/20"
                >
                  History
                </Link>
                <Link
                  to="/Rules"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/20"
                >
                  Rules
                </Link>
                  <Link
                  to="/wallet"
                  className="text-gray-300 tabview hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/20"
                >
             Add Amount
                </Link>
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center relative tabview">
            <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
              Andar
            </span>{" "}
            <span className="text-white"> </span>{" "}
            <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              Bahar
            </span>
          </h1>


          <div className="block md:hidden mr-4 px-4 py-1">
  <span className="text-gray-400 text-sm">COINS:</span>
  <span className="ml-1 text-yellow-300 font-bold text-sm">
    {balance.toFixed(2)}
  </span>
</div>


          

          <div className="hidden md:block">
            <div className="flex items-center">
              {user ? (
                <>
                  <div className="mr-4 px-4 py-1 bg-black/30 rounded-full border border-yellow-600/30 backdrop-blur-sm">
                    <span className="text-gray-400 text-sm">COINS:</span>
                    <span className="ml-1 text-yellow-300 font-bold">
                      {balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="mr-4 text-white px-4 py-1 bg-black/30 rounded-full border border-yellow-600/30 backdrop-blur-sm">
                    Welcome,{" "}
                    <span className="font-semibold text-yellow-300">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-full border border-red-500/50 shadow-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black px-4 py-2 rounded-full mr-2 font-medium border border-yellow-400 shadow-lg transition-all duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-4 py-2 rounded-full border border-gray-500 shadow-lg transition-all duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-yellow-400 focus:outline-none transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-900 to-emerald-950 pb-3 px-4 border-t border-yellow-600/30">
          
          <div className="flex flex-col space-y-2">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/history"
              className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200"
            >
              History
            </Link>
            <Link
              to="/Rules"
              className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200"
            >
              Rules
            </Link>
             <Link
              to="/wallet"
              className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md transition-colors duration-200"
            >
              Add balance
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2 bg-black/20 rounded-lg mt-2">
                  <span className="text-gray-400">Balance:</span>
                  <span className="ml-1 text-yellow-300 font-bold">
                    {balance.toFixed(2)}
                  </span>
                </div>
                <div className="px-3 py-2 text-white bg-black/20 rounded-lg">
                  Welcome,{" "}
                  <span className="font-semibold text-yellow-300">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-full border border-red-500/50 shadow-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black px-4 py-2 rounded-full font-medium border border-yellow-400 shadow-lg transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-4 py-2 rounded-full border border-gray-500 shadow-lg transition-all duration-200"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
