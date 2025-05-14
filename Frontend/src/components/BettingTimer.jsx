const BettingTimer = ({ timeLeft }) => {
  // Calculate percentage for the progress bar
  const percentage = (timeLeft / 20) * 100

  return (
    <div className="flex items-center">
      <div className="mr-2 text-white font-bold">{timeLeft}s</div>
      <div className="w-24 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            timeLeft > 10 ? "bg-green-500" : timeLeft > 5 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default BettingTimer

