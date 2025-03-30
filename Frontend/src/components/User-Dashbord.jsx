import { Link ,useNavigate} from "react-router-dom";
import { useContext } from "react"
import girlimage from "../assets/model.png";
import backgroundImage from "../assets/bg.png";
import { UserContext } from "../context/UserContext"
const GameUI = () => {
const {logout } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div
      className="w-screen h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left px-6 md:px-12">
        {/* Game Title */}
        <h1 className="text-3xl font-bold tracking-wider text-white sm:text-6xl">
          <span
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent zen-tokyo-zoo-regular "
            style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
          >
            ANDHAR
          </span>
          <span
            className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent zen-tokyo-zoo-regular"
            style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
          >
            {" "}
            BAHAR
          </span>
        </h1>

        {/* Game Menu */}
        <main className="flex justify-center w-full px-4 md:px-12 lg:px-24 mt-8">
          <div className="bg-[#0c1228] rounded-lg shadow-2xl p-6 w-full max-w-md flex flex-col items-center">
            <Link to="/game" className="w-64 h-14 mb-4 relative overflow-hidden rounded-md group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative z-10 text-white font-bold text-xl">New Game</span>
            </Link>

            <Link to="/wallet" className="w-64 text-white bg-gray-800 hover:bg-amber-300 hover:text-black rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center">
              Deposit
            </Link>

            <Link to="/wallet" className="w-64 text-white bg-gray-800 hover:bg-gray-700 hover:text-amber-300 rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center">
              Withdraw
            </Link>

            <button onClick={handleLogout} className="w-64 text-white cursor-pointer bg-gray-800 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300 py-3 text-xl text-center">
              Exit Game
            </button>
          </div>
        </main>
      </div>

      <div className="w-1/2 h-full flex flex-end max-sm:hidden justify-center items-center relative">
      <img
        src={girlimage}
        alt="Game Assistant"
        className="h-[80%] bottom-0 mt-40"
      />
      </div>
    </div>
  );
};

export default GameUI;