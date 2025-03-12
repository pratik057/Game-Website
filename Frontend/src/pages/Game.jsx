"use client"

import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { SocketContext } from "../context/SocketContext"
import Card from "../components/Card"
import BetControls from "../components/BetControls"
import GameResult from "../components/GameResult"
import OnlinePlayers from "../components/OnlinePlayers"
import BettingTimer from "../components/BettingTimer"
import Navebar from "../components/Navbar"
import backgroundImage from "../assets/bg.png"
const Game = () => {
  const { user, balance } = useContext(UserContext)
  const { connected, gameState, onlinePlayers, currentBet, placeBet } = useContext(SocketContext)

  // Check if the game is in result state and user has a bet
  const userWon = gameState.status === "result" && currentBet && currentBet.side === gameState.winningSide

  // Calculate win amount if user won
  const calculateWinAmount = () => {
    if (!userWon || !currentBet) return 0

    const multiplier = currentBet.side === "andar" ? 1.9 : 2.0
    return Math.floor(currentBet.amount * multiplier)
  }

  const winAmount = calculateWinAmount()

  return (
    <>
    <Navebar />
    <div className="flex flex-col items-center"
   
    
    >
      <h1 className="text-3xl font-bold mb-4">
        <span className="text-red-500">Andar</span> <span className="text-white">or</span>{" "}
        <span className="text-blue-500">Bahar</span>
      </h1>

      {/* Game Status */}
      <div className="w-full max-w-5xl mb-6">
        <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-gray-300">{connected ? "Connected to Game Server" : "Disconnected"}</span>
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
              {gameState.status === "betting"
                ? "Betting Open"
                : gameState.status === "dealing"
                  ? "Dealing Cards"
                  : gameState.status === "result"
                    ? "Round Complete"
                    : "Waiting"}
            </span>
          </div>

          {gameState.status === "betting" && <BettingTimer timeLeft={gameState.bettingTimeLeft} />}
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Online Players */}
        <div className="lg:col-span-1">
          <OnlinePlayers players={onlinePlayers} />
        </div>

        {/* Main Game Area */}
        <div className="lg:col-span-3">
          {/* Game Table */}
          <div className="game-table rounded-xl p-6 mb-8 relative">
            {/* Total Bets Display */}
            <div className="flex justify-between mb-6">
              <div className="bg-red-900/30 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Total Andar Bets</div>
                <div className="text-xl font-bold text-red-500">{gameState.totalBets.andar}</div>
              </div>

              <div className="bg-blue-900/30 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Total Bahar Bets</div>
                <div className="text-xl font-bold text-blue-500">{gameState.totalBets.bahar}</div>
              </div>
            </div>

            {/* Joker Card */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-xl font-bold text-yellow-500 mb-4">Joker Card</h2>
              <div className="h-48">
                {gameState.jokerCard ? (
                  <Card card={gameState.jokerCard} flipped={true} highlighted={true} />
                ) : (
                  <div className="w-32 h-48 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <span className="text-gray-500">Waiting...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Areas */}
            <div className="grid grid-cols-2 gap-8">
              {/* Andar Cards */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-red-500 mb-4">ANDAR</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.andarCards.length > 0 ? (
                    gameState.andarCards.map((card, index) => (
                      <Card
                        key={`andar-${index}`}
                        card={card}
                        flipped={true}
                        delay={index * 100}
                        highlighted={
                          gameState.status === "result" &&
                          gameState.winningSide === "andar" &&
                          index === gameState.winningCardIndex
                        }
                      />
                    ))
                  ) : (
                    <div className="w-32 h-48 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <span className="text-gray-500">No cards yet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bahar Cards */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-blue-500 mb-4">BAHAR</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.baharCards.length > 0 ? (
                    gameState.baharCards.map((card, index) => (
                      <Card
                        key={`bahar-${index}`}
                        card={card}
                        flipped={true}
                        delay={index * 100}
                        highlighted={
                          gameState.status === "result" &&
                          gameState.winningSide === "bahar" &&
                          index === gameState.winningCardIndex
                        }
                      />
                    ))
                  ) : (
                    <div className="w-32 h-48 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <span className="text-gray-500">No cards yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Betting Controls */}
          <BetControls
            onPlaceBet={placeBet}
            disabled={gameState.status !== "betting" || currentBet !== null}
            currentBet={currentBet}
          />
        </div>
      </div>

      {/* Game Result Modal - Only show for the current user if they placed a bet */}
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
  )
}

export default Game

