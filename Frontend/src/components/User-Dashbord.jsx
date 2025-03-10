
import { Link } from "react-router-dom";
import girlimage from "../assets/model.png";
import backgroundImage from "../assets/bg.png";

const GameUI = () => {
  
  return (
    <div
      className="w-screen h-screen relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className=" w-1/2    ">
      
        <h1 className=" absolute   left-110 top-15 text-6xl font-bold">
          <span
            className="text-yellow-400 font-extrabold tracking-wider"
            style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
          >
            ANDHAR
          </span>{" "}
          <span
            className="text-white font-extrabold tracking-wider"
            style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
          >
            BAHAR
          </span>
        </h1>
     
     
        <main className="flex flex-row justify-between w-full px-8 md:px-16 lg:px-24 top-0 left-0 right-0 bottom-0">
  <div className="bg-[#0c1228] rounded-lg shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
    
    {/* New Game Link */}
    <Link to="/game" className="w-64 h-14 mb-8 relative overflow-hidden rounded-md group text-center flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
      <span className="relative z-10 text-white font-bold text-xl">New Game</span>
    </Link>

    {/* Deposit Link */}
    <Link to="/deposit" className="w-64 text-white bg-gray-800 hover:bg-amber-300 hover:text-black rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center block">
      Deposit
    </Link>

    {/* Withdraw Link */}
    <Link to="/walet" className="w-64 text-white bg-gray-800 hover:bg-gray-700 hover:text-amber-300 rounded-md transition-colors duration-300 py-3 text-xl mb-4 text-center block">
      Withdraw
    </Link>

    {/* Exit Game Link */}
    <Link to="/exit" className="w-64 text-white bg-gray-800 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300 py-3 text-xl text-center block">
      Exit Game
    </Link>

     </div>
   </main>


      </div>
      
      <div className="w-1/2 h-full flex flex-end">
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
