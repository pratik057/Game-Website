"use client"

import { useContext, useState ,useEffect} from "react"
import { UserContext } from "../context/UserContext"
import { SocketContext } from "../context/SocketContext"
import Card from "../components/Card"
import BetControls from "../components/BetControls"
import GameResult from "../components/GameResult"
import Navbar from "../components/Navbar"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import axios from "axios";
import { Box, Typography, Divider, Chip, Grid, Tooltip } from "@mui/material";
import BettingTimer from "../components/BettingTimer"





const Game = () => {
  
    // 
  const { user, balance } = useContext(UserContext)
  const { connected, gameState, currentBet, placeBet } = useContext(SocketContext)
const [previousWinnings, setPreviousWinnings] = useState([]);
  const userWon = gameState.status === "result" && currentBet && currentBet.side === gameState.winningSide
  const showQuestionMark =
    gameState.status === "betting" || gameState.status === "jokerRevealed";
  const calculateWinAmount = () => {
    if (!userWon || !currentBet) return 0
    const multiplier = currentBet.side === "andar" ? 2.0 : 2.0
    return Math.floor(currentBet.amount * multiplier)
  }

  const [betDialogOpen, setBetDialogOpen] = useState(false);

  const handleOpen = () => setBetDialogOpen(true);
  const handleClose = () => setBetDialogOpen(false);
  const winAmount = calculateWinAmount()

  const fetchPreviousWinning = async () => {
    const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:5000/api/games/previous-history", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.success) {
      setPreviousWinnings(data.previousWinning);
      console.log("Previous winning data:", data.previousWinning);
    } else {
      console.error("Error fetching previous winning data:", data.message);
    }

  } catch (error) {
    console.error("Error fetching previous winning data:", error.message);
  }
};

useEffect(() => {
fetchPreviousWinning();
},[previousWinnings]);

  return (
    <> 
    <div className="bg-gradient-to-b  from-gray-900 via-gray-900 to-grey-800">

      <Navbar />
 
      <div className=" w-full h-[100%] flex flex-col justify-between bg-gradient-to-b mt-4 from-gray-900 via-gray-900 to-gray-800 text-white px-4 md:px-8 lg:px-16 overflow-hidden">
        {/* Bet Controls */}
           {/* Header: Connection + Game Status */}
      <div className="flex flex-col sm:flex-row justify-between items-center rounded-lg shadow-inner gap-4 relative z-10">
        {/* Connection + Timer */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full mr-2 ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {connected ? "Connected" : "Disconnected"}
          </div>
          {gameState.status === "betting" && gameState.bettingTimeLeft > 0 && (
            <div className="ml-4 bg-black/30 px-3 py-1 rounded-full">
              <BettingTimer timeLeft={gameState.bettingTimeLeft} />
            </div>
          )}
        </div>

        {/* Game Status */}
        <div className="text-sm font-semibold bg-black/30 px-4 py-1 rounded-full">
          <span className="text-gray-300 mr-2">Game Status:</span>
          <span
            className={`font-bold ${
              gameState.status === "betting"
                ? "text-yellow-400"
                : gameState.status === "dealing"
                  ? "text-blue-400"
                  : gameState.status === "result"
                    ? "text-green-500"
                    : "text-gray-400"
            }`}
          >
            {gameState.status === "betting" ? (
              gameState.bettingTimeLeft === 0 ? (
                <span className="text-red-500">Bets off. Wait for round.</span>
              ) : (
                <span>Betting Open</span>
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
      </div>
      <Dialog open={betDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Place Your Bet</DialogTitle>
        <DialogContent>
          <BetControls
            onPlaceBet={placeBet}
            disabled={gameState.status !== "betting" || currentBet !== null}
            currentBet={currentBet}
            connected={connected}
            gameState={gameState}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

        {/* Main Game Section */}
        <div className="flex flex-col flex-grow w-full h-full items-center ">
          <div className="game-tableborder bg-gray-800 border-gray-700 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-6xl mx-auto mb-6 gap-2 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
            {/* Joker Card */}
            <div className="flex flex-col items-center mb-4 ml-3">
              <h2 className="text-sm md:text-lg mb-2 font-bold text-yellow-400 uppercase tracking-wider bg-black/30 px-4 py-1 rounded-full shadow-inner">
                Joker Card
              </h2>
              <div className="w-14 h-20 md:w-28 md:h-36 flex justify-center items-center mt-4">
                {gameState.jokerCard ? (
                  <Card card={gameState.jokerCard} flipped={true} highlighted={true} />
                ) : (
                  <span className="text-gray-500 text-sm md:text-base">Waiting...</span>
                )}
              </div>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-2 gap-9 w-full px-4 mt-9">
                    {/* BAHAR Section */}
                
              {/* ANDAR Section */}
              <div className="flex flex-col items-center w-full relative" onClick={handleOpen}>
              <h2 className="text-sm md:text-lg font-bold text-blue-400 mb-5 uppercase bg-blue-950/50 px-6 py-1 rounded-full shadow-lg">
                  Andar
                </h2>
                <div className="relative w-full flex justify-center mr-3">
                  {gameState.andarCards.length > 0 ? (
                    <>
                      {/* Mobile layout: 5 cards per row */}
                      <div className="relative w-full h-auto sm:hidden">
                        {gameState.andarCards.map((card, index) => (
                          <div
                            key={`andar-mobile-${index}`}
                            className="absolute"
                            style={{
                              left: `${(index % 5) * 16}px`,
                              top: `${Math.floor(index / 5) * 32}px`,
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

                      {/* Desktop layout: 10 cards per row */}
                      <div className="relative w-full h-auto hidden sm:block">
                        {gameState.andarCards.map((card, index) => (
                          <div
                            key={`andar-desktop-${index}`}
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
                    </>
                  ) : (
                    <div className="w-14 h-20 md:w-28 md:h-36 rounded-lg border-2 border-dashed flex items-center justify-center mt-6 bg-black/20 backdrop-blur-sm"  >
                      <span className="text-yellow-300/70 text-sm text-center text-wrap md:text-base">
                        No cards yet
                      </span>
                    </div>
                  )}
                </div>
              </div>
                  <div className="flex flex-col items-center w-full relative" onClick={handleOpen}>
                
                <h2 className="text-sm md:text-lg font-bold text-red-400 mb-5 uppercase bg-red-950/50 px-6 py-1 rounded-full shadow-lg">
                  Bahar
                </h2>
                <div className="relative w-full flex justify-center min-h-[200px]">
                  {gameState.baharCards.length > 0 ? (
                    <>
                      {/* Mobile layout: 5 cards per row */}
                      <div className="relative w-full h-auto sm:hidden">
                        {gameState.baharCards.map((card, index) => (
                          <div
                            key={`bahar-mobile-${index}`}
                            className="absolute"
                            style={{
                              left: `${(index % 5) * 16}px`,
                              top: `${Math.floor(index / 5) * 32}px`,
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

                      {/* Desktop layout: 10 cards per row */}
                      <div className="relative w-full h-auto hidden sm:block">
                        {gameState.baharCards.map((card, index) => (
                          <div
                            key={`bahar-desktop-${index}`}
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
                    </>
                  ) : (
                    <div className="w-14 h-20 md:w-28 md:h-36 rounded-lg border-2 border-dashed  flex items-center justify-center mt-6 bg-black/20 backdrop-blur-sm">
                      <span className="text-yellow-300/70 text-sm text-center text-wrap md:text-base">
                        No cards yet
                      </span>
                    </div>
                  )}
                </div>
              </div>

        
            </div>
          </div>
        </div>
   <Box
      sx={{
        width: "100%",
        margin: "auto",
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        AndharBahar Record(s)
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={1} justifyContent="center" flexWrap="wrap">
        {/* Render declared results */}
         {/* Conditionally render the "?" chip for current betting game */}
        {showQuestionMark && (
          <Grid item>
            <Tooltip title="Current betting game">
              <Chip
                label="?"
                sx={{
                  width: 40,
                  height: 40,
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#ffa726", // distinct orange
                  borderRadius: "50%",
                  fontSize: "1.1rem",
                  border: "2px dashed #ffb74d",
                }}
              />
            </Tooltip>
          </Grid>
        )}
        {previousWinnings.map((game, index) => {
  let label = "?";
  let bgColor = "#FF9800"; // unknown orange
  if (game.winningSide === "andar") {
    label = "A";
    bgColor = "#1976d2"; // blue
  } else if (game.winningSide === "bahar") {
    label = "B";
    bgColor = "#d32f2f"; // red
  }
  {console.log("game",game.winningSide)}

  return (
    <Grid item key={index}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Tooltip title={new Date(game.playedAt).toLocaleString()}>
          <Chip
            label={label}
            sx={{
              width: 40,
              height: 40,
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: bgColor,
              borderRadius: "50%",
              fontSize: "1.1rem",
            }}
          />
        </Tooltip>
        <Typography variant="caption" sx={{ mt: 0.5 , color: "#000" }}>
          {index + 1}
        </Typography>
      </Box>
    </Grid>
  );
})}


       
      </Grid>
    </Box>



        {/* Result */}
        {gameState.status === "result" && currentBet && (
          <GameResult result={userWon ? "win" : "lose"} winAmount={winAmount} onPlayAgain={() => {}} autoClose={true} />
        )}
      </div>
      </div>
    </>
  )
}

export default Game

// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";
// import { SocketContext } from "../context/SocketContext";
// import Card from "../components/Card";
// import BetControls from "../components/BetControls";
// import GameResult from "../components/GameResult";
// import Navbar from "../components/Navbar";

// const Game = () => {
//   const { user, balance } = useContext(UserContext);
//   const { connected, gameState, currentBet, placeBet } =
//     useContext(SocketContext);

//   const userWon =
//     gameState.status === "result" &&
//     currentBet &&
//     currentBet.side === gameState.winningSide;

//   const calculateWinAmount = () => {
//     if (!userWon || !currentBet) return 0;
//     const multiplier = currentBet.side === "andar" ? 2.0 : 2.0;
//     return Math.floor(currentBet.amount * multiplier);
//   };

//   const winAmount = calculateWinAmount();

//   return (
//     <>
   
//       <Navbar />
 
//       <div className=" w-full h-[90%] flex flex-col justify-between bg-gradient-to-b mt-6 from-gray-900 to-black text-white px-4 md:px-8 lg:px-16 overflow-hidden">
//         {/* Bet Controls */}
//         <BetControls
//           onPlaceBet={placeBet}
//           disabled={gameState.status !== "betting" || currentBet !== null}
//           currentBet={currentBet}
//           connected={connected}
//           gameState={gameState}
//         />

//         {/* Main Game Section */}
//         <div className="flex flex-col flex-grow w-full h-full items-center ">
//           <div className="game-table bg-gray-800 border border-gray-700 p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-6xl mx-auto mb-6 gap-2">
//             {/* Joker Card */}
//             <div className="flex flex-col items-center mb-4 ml-3">
//               <h2 className="text-sm md:text-lg mb-2 font-bold text-yellow-500 uppercase tracking-wider">
//                 Joker Card
//               </h2>
//               <div className="w-14 h-20 md:w-28 md:h-36 flex justify-center items-center mt-4">
//                 {gameState.jokerCard ? (
//                   <Card
//                     card={gameState.jokerCard}
//                     flipped={true}
//                     highlighted={true}
//                   />
//                 ) : (
//                   <span className="text-gray-500 text-sm md:text-base">
//                     Waiting...
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Cards Section */}
//             <div className="grid grid-cols-2 gap-9 w-full px-4 mt-9">
//               {/* ANDAR Section */}
//               <div className="flex flex-col items-center w-full relative">
//                 <h2 className="text-sm md:text-lg font-bold text-red-500 mb-2 uppercase">
//                   Andar
//                 </h2>
//                 <div className="relative w-full flex justify-center mr-3">
//                   {gameState.andarCards.length > 0 ? (
//                     <>
//                       {/* Mobile layout: 5 cards per row */}
//                       <div className="relative w-full h-auto sm:hidden">
//                         {gameState.andarCards.map((card, index) => (
//                           <div
//                             key={`andar-mobile-${index}`}
//                             className="absolute"
//                             style={{
//                               left: `${(index % 5) * 16}px`,
//                               top: `${Math.floor(index / 5) * 32}px`,
//                               zIndex: index,
//                             }}
//                           >
//                             <Card
//                               card={card}
//                               flipped={true}
//                               highlighted={
//                                 gameState.status === "result" &&
//                                 gameState.winningSide === "andar" &&
//                                 index === gameState.winningCardIndex
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>

//                       {/* Desktop layout: 10 cards per row */}
//                       <div className="relative w-full h-auto hidden sm:block">
//                         {gameState.andarCards.map((card, index) => (
//                           <div
//                             key={`andar-desktop-${index}`}
//                             className="absolute"
//                             style={{
//                               left: `${(index % 10) * 20}px`,
//                               top: `${Math.floor(index / 10) * 40}px`,
//                               zIndex: index,
//                             }}
//                           >
//                             <Card
//                               card={card}
//                               flipped={true}
//                               highlighted={
//                                 gameState.status === "result" &&
//                                 gameState.winningSide === "andar" &&
//                                 index === gameState.winningCardIndex
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="w-14 h-20 md:w-28 md:h-36 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mt-6">
//                       <span className="text-gray-500 text-sm text-center text-wrap md:text-base">
//                         No cards yet
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* BAHAR Section */}
//               <div className="flex flex-col items-center w-full relative">
//                 <h2 className="text-sm md:text-lg font-bold text-blue-500 mb-2 uppercase">
//                   Bahar
//                 </h2>
//                 <div className="relative w-full flex justify-center min-h-[200px]">
//                   {gameState.baharCards.length > 0 ? (
//                     <>
//                       {/* Mobile layout: 5 cards per row */}
//                       <div className="relative w-full h-auto sm:hidden">
//                         {gameState.baharCards.map((card, index) => (
//                           <div
//                             key={`bahar-mobile-${index}`}
//                             className="absolute"
//                             style={{
//                               left: `${(index % 5) * 16}px`,
//                               top: `${Math.floor(index / 5) * 32}px`,
//                               zIndex: index,
//                             }}
//                           >
//                             <Card
//                               card={card}
//                               flipped={true}
//                               highlighted={
//                                 gameState.status === "result" &&
//                                 gameState.winningSide === "bahar" &&
//                                 index === gameState.winningCardIndex
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>

//                       {/* Desktop layout: 10 cards per row */}
//                       <div className="relative w-full h-auto hidden sm:block">
//                         {gameState.baharCards.map((card, index) => (
//                           <div
//                             key={`bahar-desktop-${index}`}
//                             className="absolute"
//                             style={{
//                               left: `${(index % 10) * 20}px`,
//                               top: `${Math.floor(index / 10) * 40}px`,
//                               zIndex: index,
//                             }}
//                           >
//                             <Card
//                               card={card}
//                               flipped={true}
//                               highlighted={
//                                 gameState.status === "result" &&
//                                 gameState.winningSide === "bahar" &&
//                                 index === gameState.winningCardIndex
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="w-14 h-20 md:w-28 md:h-36 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mt-6">
//                       <span className="text-gray-500 text-center text-wrap text-sm md:text-base">
//                         No cards yet
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Result */}
//         {gameState.status === "result" && currentBet && (
//           <GameResult
//             result={userWon ? "win" : "lose"}
//             winAmount={winAmount}
//             onPlayAgain={() => {}}
//             autoClose={true}
//           />
//         )}
//       </div>

   
//     </>
//   );
// };

// export default Game;
