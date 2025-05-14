import backgroundImg from "../assets/bg.png";
import woman from "../assets/model.png";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function LoginScreen() {
  return (
    <div
      className="h-screen w-full flex justify-center bg-cover bg-center overflow-hidden relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Logo Navbar */}
      <div className="w-full flex justify-center md:justify-start md:pl-8 absolute top-4 md:top-6 ">
        <img
          src={Logo}
          alt="Logo"
          className="w-20 md:w-20 lg:w-20"
          style={{ maxWidth: "150px", objectFit: "contain" }}
        />
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 justify-between top-0 mt-4">
        {/* Left Section - Signup & Login */}
        <div className="w-[100%] flex flex-col px-6 mt-[25%] lg:px-0 gap-6 z-10 text-center">
          {/* <h1 className="text-3xl font-bold tracking-wider text-white sm:text-6xl mt-0">
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
          </h1> */}
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

          <Link
            to="/login"
            className="w-full py-4 px-6 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-center text-lg"
          >
            Login With Existing Account
          </Link>
        </div>

        {/* Right Section - Woman Image */}
        <div className="w-full flex justify-center items-end pt-10 md:mt-[-5] relative  ">
          <img
            src={woman}
            alt="Model"
            className="sm:h-[110%] lg:h-[80%] md:h-[80%] object-cover sm:bottom-0 sm:mt-[-5]"
          />
        </div>
      </div>
    </div>
  );
}
