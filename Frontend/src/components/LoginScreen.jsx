// import { Link } from "@mui/material";
import backgroundImg from "../assets/bg.png";
import woman from "../assets/model.png";
import { Link } from "react-router-dom"

export default function LoginScreen() {
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="grid lg:grid-cols-2 grid-cols-1 items-center justify-between">
        {/* Left Section - Signup & Login */}

        <div className="w-[100%] flex flex-col justify-center items-start px-6 lg:px-0  gap-6 ">

          <Link
            to="/register"
            className="w-full py-4 px-6 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300 text-center text-lg"
          >
            Create New Account
          </Link>

          {/* Divider */}
          <div className="flex items-center justify-center w-full">
            <div className="border border-white w-1/2"></div>
            <span className="px-4 text-gray-400 text-center">OR</span>
            <div className="border border-white w-1/2"></div>

          </div>

          <Link to="/login"
          className="w-full py-4 px-6 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-center text-lg">
            Login With Existing Account
          </Link>
        </div>

        {/* Right Section - Woman Image */}
        <div className="w-full flex justify-center items-end pt-10 relative">
          <img src={woman} alt="Model" className="h-full object-cover" />
        </div>
      </div>
    </div>

  );
}
