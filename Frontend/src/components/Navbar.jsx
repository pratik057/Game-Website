"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import LoginModal from "./User-Login"
import RegisterModal from "./User-register"

const Navbar = () => {
  const { user, balance, logout } = useContext(UserContext)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="Andar Bahar" className="h-8 w-auto mr-2" />
              <span className="text-xl font-bold text-yellow-500">Andar Bahar</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Home
                </Link>
                <Link to="/game" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Play Game
                </Link>
                <Link to="/history" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  History
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              {user ? (
                <>
                  <div className="mr-4 px-3 py-1 bg-gray-700 rounded-lg">
                    <span className="text-gray-400 text-sm">Balance:</span>
                    <span className="ml-1 text-yellow-500 font-bold">₹{balance.toFixed(2)}</span>
                  </div>
                  <div className="mr-4 text-white">
                    Welcome, <span className="font-semibold">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md mr-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
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
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 pb-3 px-4">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/game" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Play Game
            </Link>
            <Link to="/history" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              History
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2">
                  <span className="text-gray-400">Balance:</span>
                  <span className="ml-1 text-yellow-500 font-bold">₹{balance.toFixed(2)}</span>
                </div>
                <div className="px-3 py-2 text-white">
                  Welcome, <span className="font-semibold">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
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
            setShowLoginModal(false)
            setShowRegisterModal(true)
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onLoginClick={() => {
            setShowRegisterModal(false)
            setShowLoginModal(true)
          }}
        />
      )}
    </nav>
  )
}

export default Navbar

