"use client";

import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import Card from "../components/Card";
import BetControls from "../components/BetControls";
import GameResult from "../components/GameResult";
import BettingTimer from "../components/BettingTimer";
import Navbar from "../components/Navbar";

const Game = () => {
  const { user, balance } = useContext(UserContext);
  const { connected, gameState, currentBet, placeBet } =
    useContext(SocketContext);

  const userWon =
    gameState.status === "result" &&
    currentBet &&
    currentBet.side === gameState.winningSide;
  // const gameEndRef = useRef(null);

  // useEffect(() => {
  //   gameEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [gameState.andarCards, gameState.baharCards, gameState.status]);

  const calculateWinAmount = () => {
    if (!userWon || !currentBet) return 0;
    const multiplier = currentBet.side === "andar" ? 2.0 : 2.0;
    return Math.floor(currentBet.amount * multiplier);
  };

  const winAmount = calculateWinAmount();

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black text-white px-4 md:px-8 lg:px-16">
        {/* Game Title */}
        {/* <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mt-6">
          <span className="text-red-500">Andar</span>{" "}
          <span className="text-white">or</span>{" "}
          <span className="text-blue-500">Bahar</span>
        </h1> */}

        {/* Game Status */}
        <div className="w-full max-w-5xl mt-6 p-4 bg-gray-800 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-300">
              {connected ? "Connected to Game Server" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-2">Game Status:</span>
            <span
              className={`font-bold ${
                gameState.status === "betting"
                  ? "text-yellow-500"
                  : gameState.status === "dealing"
                  ? "text-blue-500"
                  : gameState.status === "result"
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {gameState.status === "betting" ? (
                gameState.bettingTimeLeft === 0 ? (
                  <span className="text-red-500">
                    Bets off. Wait for round.
                  </span>
                ) : (
                  <span className="text-green-500">Betting Open</span>
                )
              ) : gameState.status === "dealing" ? (
                <span>Dealing Cards</span>
              ) : gameState.status === "result" ? (
                <span>Round Complete</span>
              ) : (
                <span>Waiting</span>
              )}
            </span>
          </div>
          {gameState.status === "betting" && (
            <BettingTimer timeLeft={gameState.bettingTimeLeft} />
          )}
        </div>

        {/* Betting Controls */}
        <div className="w-full flex justify-center mt-6">
          <BetControls
            onPlaceBet={placeBet}
            disabled={gameState.status !== "betting" || currentBet !== null}
            currentBet={currentBet}
          />
        </div>

        {/* Main Game Section */}
        <div className="w-full flex flex-col items-center mt-3 flex-grow">
          {/* Game Table */}
          <div className="game-table bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-5xl">
            {/* Total Bets Display */}
            {/* <div className="w-full flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="bg-red-900/30 px-4 py-2 rounded-lg text-center w-full sm:w-1/2">
                <div className="text-sm text-gray-300">Total Andar Bets</div>
                <div className="text-xl font-bold text-red-500">
      uu            {gameState.totalBets.andar}
                </div>
              </div>
              <div className="bg-blue-900/30 px-4 py-2 rounded-lg text-center w-full sm:w-1/2">
                <div className="text-sm text-gray-300">Total Bahar Bets</div>
                <div className="text-xl font-bold text-blue-500">
                  {gameState.totalBets.bahar}
                </div>
              </div>
            </div> */}

            {/* Joker Card */}
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-yellow-500 mb-4">
                Joker Card
              </h2>
              <div className="h-40 flex justify-center items-center">
                {gameState.jokerCard ? (
                  <Card
                    card={gameState.jokerCard}
                    flipped={true}
                    highlighted={true}
                  />
                ) : (
                  <div className="w-28 h-40 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <span className="text-gray-500">Waiting...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* ANDAR Section */}
              <div className="flex flex-col items-center w-full relative">
                <h2 className="text-lg sm:text-xl font-bold text-red-500 mb-4">
                  ANDAR
                </h2>
                <div className="relative w-full flex justify-center min-h-[200px] overflow-hidden">
                  {gameState.andarCards.length > 0 ? (
                    <div className="relative w-full h-auto">
                      {gameState.andarCards.map((card, index) => (
                        <div
                          key={`andar-${index}`}
                          className="absolute"
                          style={{
                            left: `${(index % 10) * 20}px`,
                            top: `${Math.floor(index / 10) * 40}px`,
                            zIndex: index,
                          }}
                        >
                          <Card
                            card={card}
                            flipped={true}
                            highlighted={
                              gameState.status === "result" &&
                              gameState.winningSide === "andar" &&
                              index === gameState.winningCardIndex
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-28 h-40 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <span className="text-gray-500">No cards yet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BAHAR Section */}
              <div className="flex flex-col items-center w-full relative">
                <h2 className="text-lg sm:text-xl font-bold text-blue-500 mb-4">
                  BAHAR
                </h2>
                <div className="relative w-full flex justify-center min-h-[200px] overflow-hidden">
                  {gameState.baharCards.length > 0 ? (
                    <div className="relative w-full h-auto">
                      {gameState.baharCards.map((card, index) => (
                        <div
                          key={`bahar-${index}`}
                          className="absolute"
                          style={{
                            left: `${(index % 10) * 20}px`,
                            top: `${Math.floor(index / 10) * 40}px`,
                            zIndex: index,
                          }}
                        >
                          <Card
                            card={card}
                            flipped={true}
                            highlighted={
                              gameState.status === "result" &&
                              gameState.winningSide === "bahar" &&
                              index === gameState.winningCardIndex
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-28 h-40 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <span className="text-gray-500">No cards yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div ref={gameEndRef} /> */}

        {gameState.status === "result" && currentBet && (
          <GameResult
            result={userWon ? "win" : "lose"}
            winAmount={winAmount}
            onPlayAgain={() => {}} // No need to do anything, game restarts automatically
            autoClose={true}
          />
        )}
      </div>
    </>
  );
};

export default Game;
