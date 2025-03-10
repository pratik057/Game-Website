// "use client"

// import { useContext } from "react"
// import { Link } from "react-router-dom"
// import { UserContext } from "../context/UserContext"

// const Home = () => {
//   const { user } = useContext(UserContext)

//   return (
//     <div className="flex flex-col items-center">
//       {/* Hero Section */}
//       <section className="w-full py-12 md:py-24 text-center">
//         <h1 className="text-4xl md:text-6xl font-bold mb-6">
//           <span className="text-red-500">Andar</span> <span className="text-white">or</span>{" "}
//           <span className="text-blue-500">Bahar</span>
//         </h1>
//         <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
//           Experience the thrill of India's favorite card game online. Play with others in real-time!
//         </p>
//         <Link
//           to="/game"
//           className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300"
//         >
//           Play Now
//         </Link>
//       </section>

//       {/* Multiplayer Feature */}
//       <section className="w-full py-12 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-lg my-8">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8 text-center">Multiplayer Experience</h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gray-800 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">🎮</div>
//               <h3 className="text-xl font-bold mb-2">Real-Time Gaming</h3>
//               <p className="text-gray-300">
//                 Play with other players in real-time. See their bets and celebrate wins together!
//               </p>
//             </div>

//             <div className="bg-gray-800 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">⏱️</div>
//               <h3 className="text-xl font-bold mb-2">Always On</h3>
//               <p className="text-gray-300">Games run continuously. Join anytime and jump straight into the action!</p>
//             </div>

//             <div className="bg-gray-800 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">🏆</div>
//               <h3 className="text-xl font-bold mb-2">Competitive Play</h3>
//               <p className="text-gray-300">See who's winning big and learn from the best players in the game.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Game Info Section */}
//       <section className="w-full py-12 bg-gray-800 rounded-lg my-8">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8 text-center">How to Play</h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gray-700 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">1</div>
//               <h3 className="text-xl font-bold mb-2">Place Your Bet</h3>
//               <p className="text-gray-300">
//                 Choose your bet amount and select either Andar (inside) or Bahar (outside).
//               </p>
//             </div>

//             <div className="bg-gray-700 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">2</div>
//               <h3 className="text-xl font-bold mb-2">Card Distribution</h3>
//               <p className="text-gray-300">The dealer draws a card (Joker) and places it face up.</p>
//             </div>

//             <div className="bg-gray-700 p-6 rounded-lg">
//               <div className="text-yellow-500 text-4xl mb-4">3</div>
//               <h3 className="text-xl font-bold mb-2">Find the Match</h3>
//               <p className="text-gray-300">
//                 Cards are drawn alternately for Andar and Bahar until a card matching the Joker's value appears.
//               </p>
//             </div>
//           </div>

//           <div className="mt-12 text-center">
//             <h3 className="text-2xl font-bold mb-4">Winning</h3>
//             <p className="text-gray-300 max-w-2xl mx-auto">
//               If the matching card appears on the side you bet on, you win! Andar bets pay 1.9x your bet, while Bahar
//               bets pay 2x your bet.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="w-full py-12 text-center">
//         <div className="bg-gradient-to-r from-red-500/20 to-blue-500/20 p-8 rounded-lg">
//           <h2 className="text-3xl font-bold mb-4">Ready to Join the Action?</h2>
//           <p className="text-xl text-gray-300 mb-6">
//             {user ? "Games are running 24/7. Jump in anytime!" : "Create an account to start playing with others"}
//           </p>

//           {user ? (
//             <Link
//               to="/game"
//               className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300"
//             >
//               Play Now
//             </Link>
//           ) : (
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Link
//                 to="/game"
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300"
//               >
//                 Play as Guest
//               </Link>
//               <button
//                 className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300"
//                 onClick={() => document.getElementById("register-btn").click()}
//               >
//                 Register
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Home

