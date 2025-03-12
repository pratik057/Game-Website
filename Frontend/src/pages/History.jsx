"use client"

import { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
// import api from "../utils/api"
import { toast } from "react-toastify"
import axios from "axios"
const History = () => {
  const { user } = useContext(UserContext)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    totalWagered: 0,
    totalWon: 0,
    netProfit: 0,
    winRate: 0,
  })

  useEffect(() => {
    const fetchGameHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
  const token = localStorage.getItem("token");
      try {
        console.log("Fetching game history...");
  
        const response = await axios.get("https://game-website-yyuo.onrender.com/api/games/history", {
          user:user,
          headers: {
            Authorization: `Bearer ${token}`, // Ensure user has a valid token
          },
        });
  
        console.log("API Response:",response.data);
  
        if (!response.data || !response.data.games) {
          console.error("Invalid API response format");
          toast.error("Invalid game history data");
          setLoading(false);
          return;
        }
  
        setGames(response.data.games);
  
        const totalGames = response.data.games.length;
        const wins = response.data.games.filter((game) => game.result === "win").length;
        const totalWagered = response.data.games.reduce((sum, game) => sum + (game.betAmount || 0), 0);
        const totalWon = response.data.games.reduce((sum, game) => (game.result === "win" ? sum + (game.winAmount || 0) : sum), 0);
  
        setStats({
          totalGames,
          wins,
          losses: totalGames - wins,
          totalWagered,
          totalWon,
          netProfit: totalWon - totalWagered,
          winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
        });
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game history:", error);
        toast.error("Failed to load game history");
        setLoading(false);
      }
    };
  
    fetchGameHistory();
  }, [user]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Game History</h1>
        <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-xl mb-4">Please log in to view your game history.</p>
          <button
            onClick={() => document.getElementById("login-btn").click()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Game History</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 mb-1">Games Played</h3>
          <div className="text-2xl font-bold">{stats.totalGames}</div>
          <div className="mt-2 text-sm">
            <span className="text-green-500">{stats.wins} Wins</span> /{" "}
            <span className="text-red-500">{stats.losses} Losses</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 mb-1">Win Rate</h3>
          <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
          <div className="mt-2 text-sm">
            <span className="text-gray-400">Based on {stats.totalGames} games</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 mb-1">Net Profit</h3>
          <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
            ₹{stats.netProfit.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <span>₹{stats.totalWagered.toFixed(2)} wagered</span>
          </div>
        </div>
      </div>

      {/* Game History Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Recent Games</h2>
        </div>

        {games.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>You haven't played any games yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Bet</th>
                  <th className="px-4 py-3 text-left">Side</th>
                  <th className="px-4 py-3 text-left">Result</th>
                  <th className="px-4 py-3 text-right">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-300">{new Date(game.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">₹{game.betAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={game.betSide === "andar" ? "text-red-500" : "text-blue-500"}>
                        {game.betSide === "andar" ? "Andar" : "Bahar"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          game.result === "win" ? "bg-green-900/30 text-green-500" : "bg-red-900/30 text-red-500"
                        }`}
                      >
                        {game.result === "win" ? "Win" : "Loss"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={game.result === "win" ? "text-green-500" : "text-red-500"}>
                        {game.result === "win"
                          ? `+₹${(game.winAmount - game.betAmount).toFixed(2)}`
                          : `-₹${game.betAmount.toFixed(2)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default History

