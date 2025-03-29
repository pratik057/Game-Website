"use client"

import { useState } from "react"

const OnlinePlayers = ({ players = [] }) => {
  const [expanded, setExpanded] = useState(true)
 

  if (!players || players.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Online Players</h3>
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white">
            {expanded ? "−" : "+"}
          </button>
        </div>

        {expanded && <div className="text-gray-400 text-center py-4">No players online</div>}
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Online Players ({players.length})</h3>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white">
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
    {(players ?? []).length > 0 ? (
      players.map((player) => (
        <div
          key={player?.id || Math.random()}
          className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium truncate max-w-[120px]">
              {player?.username || "Unknown"}
            </span>
          </div>

          {player?.bet && (
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                player?.bet.side === "andar"
                  ? "bg-red-900/30 text-red-400"
                  : "bg-blue-900/30 text-blue-400"
              }`}
            >
              {player?.bet.side === "andar" ? "A" : "B"} {player?.bet.amount}
            </div>
          )}
        </div>
      ))
    ) : (
      <div className="text-gray-400 text-center p-3">No players yet</div>
    )}
  </div>
)}

    </div>
  )
}

export default OnlinePlayers
