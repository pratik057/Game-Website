// import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import girlimage from "../assets/model.png";
// import backgroundImage from "../assets/bg.png";
// import { UserContext } from "../context/UserContext";
// import Logo from "../assets/logo.png";

// const GameUI = () => {
//   const { logout } = useContext(UserContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div
//       className="w-screen h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center relative overflow-hidden"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <img
//         src={Logo}
//         height={100}
//         width={100}
//         className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 z-50"
//         aria-label="Close"
//       />

//       {/* Left Section */}
//       <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left px-4 sm:px-6 md:px-12 mt-20 sm:mt-0">
//         {/* Game Menu */}
//         <main className="flex justify-center w-full px-4 sm:px-12 lg:px-24 mt-4 sm:mt-8">
//           <div className="bg-[#0c1228] rounded-lg shadow-2xl p-6 w-full max-w-md flex flex-col items-center">
//             <Link
//               to="/game"
//               className="w-64 h-14 mb-4 relative overflow-hidden rounded-md group flex items-center justify-center"
//             >
//               <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
//               <span className="relative z-10 text-white font-bold text-xl">
//                 Play the Game
//               </span>
//             </Link>

//             <Link
//               to="/wallet"
//               className="w-64 text-white bg-gray-800 hover:bg-amber-300 hover:text-black rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center"
//             >
//               Deposit
//             </Link>

//             <Link
//               to="/wallet"
//               className="w-64 text-white bg-gray-800 hover:bg-gray-700 hover:text-amber-300 rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center"
//             >
//               Withdraw
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="w-64 text-white cursor-pointer bg-gray-800 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300 py-3 text-xl text-center"
//             >
//               Logout Game
//             </button>
//           </div>
//         </main>
//       </div>

//       {/* Right Section (Game Assistant Image) */}
//       <div className="w-1/2 h-full sm:flex hidden justify-center items-center relative">
//         <img
//           src={girlimage}
//           alt="Game Assistant"
//           className="h-[60%] sm:h-[80%] bottom-0 mt-10 sm:mt-40"
//         />
//       </div>
//     </div>
//   );
// };

// export default GameUI;
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import girlimage from "../assets/model.png";
import backgroundImage from "../assets/bg.png";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/logo.png";
import "../css/custom.css";
const GameUI = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="w-screen h-screen  flex flex-col lg:flex-row items-center justify-center bg-cover bg-center relative overflow-hidden dashbord "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
     <div className="w-full flex justify-center md:justify-start md:pl-8 absolute top-4 md:top-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-28 md:w-24 lg:w-28"
              style={{ maxWidth: "150px", objectFit: "contain" }}
            />
          </div>
    

      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left px-4 sm:px-6 md:px-12 mt-20 sm:mt-0 margin">
        {/* Game Menu */}
        <main className="flex justify-center w-full px-4 sm:px-12 lg:px-24 mt-4 sm:mt-8">
          <div className="bg-[#1a1a2e] rounded-lg shadow-[0_0_15px_#ffd70030] p-6 w-full max-w-md flex flex-col items-center">
                  <Link
              to="/game"
              className="w-64 h-14 mb-4 relative overflow-hidden rounded-md group flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative z-10 text-white font-bold text-xl">
                Play the Game
              </span>
            </Link>

            <Link
              to="/wallet"
              className="w-64 text-white bg-gray-800 hover:bg-amber-300 hover:text-black rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center"
            >
              Deposit
            </Link>

            <Link
              to="/wallet"
              className="w-64 text-white bg-gray-800 hover:bg-gray-700 hover:text-amber-300 rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center"
            >
              Withdraw
            </Link>

            <button
              onClick={handleLogout}
              className="w-64 text-white cursor-pointer bg-gray-800 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300 py-3 text-xl text-center"
            >
              Logout Game
            </button>
          </div>
        </main>
      </div>

      {/* Right Section (Game Assistant Image) */}
      <div className="w-1/2 h-full sm:flex hidden justify-center items-center relative image">
        <img
          src={girlimage}
          alt="Game Assistant"
          className="h-[60%] sm:h-[80%] bottom-0 mt-10 sm:mt-40 drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]"
        />
      </div>
    </div>
  );
};

export default GameUI;
