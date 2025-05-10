"use client"

import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { SocketContext } from "../context/SocketContext"
import Card from "../components/Card"
import BetControls from "../components/BetControls"
import GameResult from "../components/GameResult"
import Navbar from "../components/Navbar"
// import BackgroundMusic from "../components/BagroundMusic"
const Game = () => {
  const { user, balance } = useContext(UserContext)
  const { connected, gameState, currentBet, placeBet } = useContext(SocketContext)

  const userWon = gameState.status === "result" && currentBet && currentBet.side === gameState.winningSide

  const calculateWinAmount = () => {
    if (!userWon || !currentBet) return 0
    const multiplier = currentBet.side === "andar" ? 2.0 : 2.0
    return Math.floor(currentBet.amount * multiplier)
  }

  const winAmount = calculateWinAmount()

  return (
    <> <div className="bg-gradient-to-b  from-gray-900 via-gray-900 to-black">

      <Navbar />
 
      <div className=" w-full h-[100%] flex flex-col justify-between bg-gradient-to-b mt-4 from-gray-900 via-gray-900 to-black text-white px-4 md:px-8 lg:px-16 overflow-hidden">
        {/* Bet Controls */}
        {/* <BackgroundMusic src="/Sounds/BagroundMusic.mp3" /> */}
        <BetControls
          onPlaceBet={placeBet}
          disabled={gameState.status !== "betting" || currentBet !== null}
          currentBet={currentBet}
          connected={connected}
          gameState={gameState}
        />

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
              {/* ANDAR Section */}
              <div className="flex flex-col items-center w-full relative">
                <h2 className="text-sm md:text-lg font-bold text-red-400 mb-5 uppercase bg-red-950/50 px-6 py-1 rounded-full shadow-lg">
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
                    <div className="w-14 h-20 md:w-28 md:h-36 rounded-lg border-2 border-dashed flex items-center justify-center mt-6 bg-black/20 backdrop-blur-sm">
                      <span className="text-yellow-300/70 text-sm text-center text-wrap md:text-base">
                        No cards yet
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* BAHAR Section */}
              <div className="flex flex-col items-center w-full relative">
                <h2 className="text-sm md:text-lg font-bold text-blue-400 mb-5 uppercase bg-blue-950/50 px-6 py-1 rounded-full shadow-lg">
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
