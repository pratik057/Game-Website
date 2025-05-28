"use client";

import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import BettingTimer from "./BettingTimer";

const BetControls = ({
  onPlaceBet,
  disabled,
  currentBet,
  connected,
  gameState,
  selectedSide,
  onCloseBetDialog,
}) => {
  const { balance, user } = useContext(UserContext);
  const [betAmount, setBetAmount] = useState(10);
  const predefinedBets = [10, 20, 50, 100, 200, 500, 1000];

  const handlePlaceBet = (side) => {
    if (betAmount <= 0 || betAmount > balance) return;
    onPlaceBet(side, betAmount);
    onCloseBetDialog?.(); 

  };

  return (
    <div className="w-full h-full bg-gray-800 border-gray-700 rounded-xl shadow-2xl p-4 mb-4 max-w-5xl mx-auto text-white relative overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Header: Connection + Game Status */}
     

      {/* Current Bet Preview */}
      {currentBet && (
        <div className="text-center text-white font-semibold text-sm mt-3 bg-black/40 py-2 rounded-lg backdrop-blur-sm">
          You bet <span className="text-yellow-400">{currentBet.amount}</span>{" "}
          on{" "}
          <span
            className={
              currentBet.side === "andar" ? "text-red-400" : "text-blue-400"
            }
          >
            {currentBet.side.toUpperCase()}
          </span>
        </div>
      )}
      {betAmount > balance && (
        <p className="text-red-500 mt-2 text-center">Insufficient balance</p>
      )}
      {/* Bet Chips */}
      <div className="flex justify-center flex-wrap gap-[5px] mt-3">
        {predefinedBets.map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount)}
            className={`px-2 py-1 md:py-2 md:px-4 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
              betAmount === amount
                ? "bg-yellow-500 text-black border-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                : "bg-gray-800 text-white border-gray-600 hover:border-yellow-600"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            disabled={disabled}
          >
            {amount}
          </button>
        ))}
        <input
          type="number"
          className={`px-2 py-1 md:py-2 md:px-4 rounded-full text-xs font-semibold border-2 transition-all duration-200${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
          disabled={disabled}
          onChange={(e) => setBetAmount(e.target.value)}
          value={betAmount}
        />
      </div>

      {/* Place Bet Buttons */}
      <div className="flex justify-center gap-6 pt-3">
         {selectedSide === "andar" && (
    <button
      className="bg-gradient-to-br from-blue-500 to-blue-900 text-white px-4 py-1 md:py-2 md:px-8 rounded-xl text-md font-bold shadow-lg border-2 border-blue-700/50"
      disabled = {disabled}
      onClick={() => handlePlaceBet("andar")}
    >
      PLACE BET
    </button>
  )}

  {selectedSide === "bahar" && (
    <button
      className="bg-gradient-to-br from-red-500 to-red-900 text-white px-4 py-1 md:py-2 md:px-8 rounded-xl text-md font-bold shadow-lg border-2 border-red-700/50"
      disabled = {disabled}
      onClick={() => handlePlaceBet("bahar")}
    >
      PLACE BET
    </button>
  )}
      </div>
    </div>
  );
};

export default BetControls;
