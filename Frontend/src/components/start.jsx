import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://game-website-yyuo.onrender.com"); // Update with your backend URL if needed

const Game = () => {
  const [holeCard, setHoleCard] = useState(null);
  const [andar, setAndar] = useState([]);
  const [bahar, setBahar] = useState([]);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    socket.on("gameResult", (data) => {
      setHoleCard(data.holeCard);
      setAndar(data.andar);
      setBahar(data.bahar);
      setWinner(data.winner);
    });

    return () => socket.off("gameResult");
  }, []);

  const startGame = () => {
    socket.emit("startGame");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Andar Bahar Game</h1>
      <button
        onClick={startGame}
        className="bg-blue-500 px-6 py-2 rounded-md text-white font-semibold hover:bg-blue-600 transition"
      >
        Start Game
      </button>

      {holeCard && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Hole Card</h2>
          <div className="text-lg mt-2">{`${holeCard.value} of ${holeCard.suit}`}</div>
        </div>
      )}

      <div className="flex justify-between mt-6 w-3/4">
        <div className="w-1/2 bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Andar</h2>
          <div className="mt-2">
            {andar.map((card, index) => (
              <div key={index}>{`${card.value} of ${card.suit}`}</div>
            ))}
          </div>
        </div>

        <div className="w-1/2 bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Bahar</h2>
          <div className="mt-2">
            {bahar.map((card, index) => (
              <div key={index}>{`${card.value} of ${card.suit}`}</div>
            ))}
          </div>
        </div>
      </div>

      {winner && (
        <div className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
          {winner}
        </div>
      )}
    </div>
  );
};

export default Game;
