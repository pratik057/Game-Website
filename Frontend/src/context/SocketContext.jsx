// "use client";

// import { createContext, useState, useEffect, useContext, useRef } from "react";
// import { io } from "socket.io-client";
// import { toast } from "react-toastify";
// import { UserContext } from "./UserContext";

// export const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const { user, updateBalance } = useContext(UserContext);
//   const [socket, setSocket] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [gameState, setGameState] = useState({
//     status: "waiting",
//     jokerCard: null,
//     andarCards: [],
//     baharCards: [],
//     winningSide: null,
//     winningCardIndex: null,
//     bettingTimeLeft: 0,
//     players: [],
//     totalBets: { andar: 0, bahar: 0 },
//   });
//   const [onlinePlayers, setOnlinePlayers] = useState([]);
//   const [currentBet, setCurrentBet] = useState(null);
//   const [gameHistory, setGameHistory] = useState([]);
//   const [isPlacingBet, setIsPlacingBet] = useState(false);

//   // Use refs to track connection attempts and prevent multiple reconnections
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectTimer = useRef(null);
//   const socketRef = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     // Connect to the server
//     const connectSocket = () => {
//       try {
//         // Clear any existing reconnect timer
//         if (reconnectTimer.current) {
//           clearTimeout(reconnectTimer.current);
//           reconnectTimer.current = null;
//         }

//         // Create new socket connection
//         const socketInstance = io(
//           import.meta.env.VITE_SOCKET_URL ||
//             "https://game-website-yyuo.onrender.com",
//           {
//             transports: ["websocket"],
//             autoConnect: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 2000,
//             timeout: 10000, // Increase timeout to 10 seconds
//           }
//         );

//         socketRef.current = socketInstance;
//         setSocket(socketInstance);

//         // Reset reconnect attempts on successful connection
//         socketInstance.on("connect", () => {
//           reconnectAttempts.current = 0;
//         });

//         // Handle disconnect with custom reconnect logic
//         socketInstance.on("disconnect", () => {
//           setConnected(false);

//           // Try to reconnect if under max attempts
//           if (reconnectAttempts.current < maxReconnectAttempts) {
//             reconnectAttempts.current += 1;

//             // Set a timer to reconnect
//             reconnectTimer.current = setTimeout(() => {
//               if (socketRef.current) {
//                 socketRef.current.connect();
//               } else {
//                 connectSocket();
//               }
//             }, 2000 * reconnectAttempts.current); // Exponential backoff
//           } else {
//             toast.error(
//               "Connection lost. Please refresh the page to reconnect."
//             );
//           }
//         });
//       } catch (error) {
//         toast.error(
//           "Failed to connect to game server. Please refresh the page."
//         );
//       }
//     };

//     connectSocket();

//     // Clean up on unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }

//       if (reconnectTimer.current) {
//         clearTimeout(reconnectTimer.current);
//         reconnectTimer.current = null;
//       }
//     };
//   }, []);

//   // Set up socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     // Connection events
//     const handleConnect = () => {
//       console.log("Connected to server");
//       setConnected(true);

//       // Authenticate with the server
//       const token = localStorage.getItem("token");
//       if (token) {
//         socket.emit("authenticate", { token });
//       }
//     };

//     const handleDisconnect = () => {
//       console.log("Disconnected from server");
//       setConnected(false);
//     };

//     const handleConnectError = (error) => {
//       console.error("Connection error:", error);
//       // Don't show toast for every connection error to avoid spamming
//       if (reconnectAttempts.current === 0) {
//         toast.error("Failed to connect to the game server");
//       }
//     };

//     // Authentication events
//     const handleAuthenticated = (userData) => {
//       // If the user is a guest, update the balance
//       if (!user && userData.balance) {
//         updateBalance(userData.balance);
//       }
//     };

//     const handleAuthError = (error) => {
//       console.error("Authentication error:", error);
//       toast.error(error.message || "Authentication failed");
//     };

//     // Game state events
//     const handleGameState = (state) => {
//       // Validate state before updating
//       if (state && typeof state === "object") {
//         setGameState(state);

//         if (Array.isArray(state.players)) {
//           setOnlinePlayers(state.players);
//         }

//         // If there's a last game result, add it to history
//         if (
//           state.lastGameResult &&
//           state.lastGameResult.winningSide &&
//           !gameHistory.some((g) => g.gameId === state.gameId)
//         ) {
//           setGameHistory((prev) =>
//             [state.lastGameResult, ...prev].slice(0, 10)
//           );
//         }
//       }
//     };

//     const handleBettingStarted = ({ timeLeft }) => {
//       // toast.info(`Betting phase started! ${timeLeft} seconds to place your bets.`)
//       setGameState((prev) => ({
//         ...prev,
//         status: "betting",
//         bettingTimeLeft: timeLeft,
//       }));
//       // Reset current bet
//       setCurrentBet(null);
//       setIsPlacingBet(false);
//     };

//     const handleBettingTimeUpdate = ({ timeLeft }) => {
//       setGameState((prev) => ({ ...prev, bettingTimeLeft: timeLeft }));

//       if (timeLeft <= 5 && timeLeft > 0) {
//         // toast.warning(`${timeLeft} seconds left to place your bet!`, {
//         //   autoClose: 1000,
//         //   hideProgressBar: true,
//         // })
//       }
//     };

//     const handleJokerRevealed = ({ jokerCard }) => {
//       if (jokerCard) {
//         setGameState((prev) => ({
//           ...prev,
//           status: "dealing",
//           jokerCard,
//           andarCards: [],
//           baharCards: [],
//         }));
//       }
//     };

//     const handleCardDealt = ({ side, card, index }) => {
//       if (!side || !card) return;

//       setGameState((prev) => {
//         if (side === "andar") {
//           return {
//             ...prev,
//             andarCards: [...prev.andarCards, card],
//           };
//         } else {
//           return {
//             ...prev,
//             baharCards: [...prev.baharCards, card],
//           };
//         }
//       });
//     };

//     const handleGameResult = ({
//       winningSide,
//       winningCardIndex,
//       winners,
//       losers,
//     }) => {
//       setGameState((prev) => ({
//         ...prev,
//         status: "result",
//         winningSide,
//         winningCardIndex,
//       }));

//       // Check if the current user won or lost
//       if (socket && Array.isArray(winners) && Array.isArray(losers)) {
//         const socketId = socket.id;
//         const winner = winners.find((w) => w.id === socketId);
//         const loser = losers.find((l) => l.id === socketId);

//         if (winner) {
//           toast.success(`You won ${winner.winnings}!`, {
//             icon: "🎉",
//             autoClose: 5000,
//           });
//         } else if (loser) {
//           toast.error(`You lost ${loser.loss}`, {
//             autoClose: 5000,
//           });
//         }
//       }
//     };

//     // Player events
//     const handlePlayerJoined = ({ id, username }) => {
//       if (!id || !username) return;

//       // toast.info(`${username} joined the game`);

//       setOnlinePlayers((prev) => {
//         if (prev.find((p) => p.id === id)) return prev;
//         return [...prev, { id, username, bet: null }];
//       });
//     };

//     const handlePlayerLeft = ({ id, username }) => {
//       if (!id) return;

//       if (username) {
//         // toast.info(`${username} left the game`);
//       }

//       setOnlinePlayers((prev) => prev.filter((p) => p.id !== id));
//     };

//     const handleBetPlaced = ({
//       playerId,
//       username,
//       side,
//       amount,
//       totalBets,
//     }) => {
//       if (!playerId || !side || !amount) return;

//       // Update total bets
//       if (totalBets) {
//         setGameState((prev) => ({
//           ...prev,
//           totalBets,
//         }));
//       }

//       // Update player's bet
//       setOnlinePlayers((prev) => {
//         return prev.map((p) => {
//           if (p.id === playerId) {
//             return { ...p, bet: { side, amount } };
//           }
//           return p;
//         });
//       });

//       // If it's the current user, update current bet
//       if (playerId === socket.id) {
//         setCurrentBet({ side, amount });
//         setIsPlacingBet(false);
//         toast.success(`Bet placed: ${amount} on ${side.toUpperCase()}`);
//       }
//     };

//     const handleBetError = ({ message }) => {
//       console.error("Bet error:", message);
//       toast.error(message || "Error placing bet");
//       setIsPlacingBet(false);
//     };

//     const handleBalanceUpdated = ({ balance }) => {
//       if (balance !== undefined) {
//         updateBalance(balance);
//       }
//     };

//     const handleWinMessage = ({ amountWon }) => {
//       // Additional win animation or sound could be triggered here
//     };

//     const handleLoseMessage = ({ amountLost }) => {
//       // Additional lose animation or sound could be triggered here
//     };

//     // Register event listeners
//     socket.on("connect", handleConnect);
//     socket.on("disconnect", handleDisconnect);
//     socket.on("connect_error", handleConnectError);
//     socket.on("authenticated", handleAuthenticated);
//     socket.on("authError", handleAuthError);
//     socket.on("gameState", handleGameState);
//     socket.on("bettingStarted", handleBettingStarted);
//     socket.on("bettingTimeUpdate", handleBettingTimeUpdate);
//     socket.on("jokerRevealed", handleJokerRevealed);
//     socket.on("cardDealt", handleCardDealt);
//     socket.on("gameResult", handleGameResult);
//     socket.on("playerJoined", handlePlayerJoined);
//     socket.on("playerLeft", handlePlayerLeft);
//     socket.on("betPlaced", handleBetPlaced);
//     socket.on("betError", handleBetError);
//     socket.on("balanceUpdated", handleBalanceUpdated);
//     socket.on("winMessage", handleWinMessage);
//     socket.on("loseMessage", handleLoseMessage);

//     // Clean up event listeners on unmount
//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("disconnect", handleDisconnect);
//       socket.off("connect_error", handleConnectError);
//       socket.off("authenticated", handleAuthenticated);
//       socket.off("authError", handleAuthError);
//       socket.off("gameState", handleGameState);
//       socket.off("bettingStarted", handleBettingStarted);
//       socket.off("bettingTimeUpdate", handleBettingTimeUpdate);
//       socket.off("jokerRevealed", handleJokerRevealed);
//       socket.off("cardDealt", handleCardDealt);
//       socket.off("gameResult", handleGameResult);
//       socket.off("playerJoined", handlePlayerJoined);
//       socket.off("playerLeft", handlePlayerLeft);
//       socket.off("betPlaced", handleBetPlaced);
//       socket.off("betError", handleBetError);
//       socket.off("balanceUpdated", handleBalanceUpdated);
//       socket.off("winMessage", handleWinMessage);
//       socket.off("loseMessage", handleLoseMessage);
//     };
//   }, [socket, user, updateBalance, gameHistory]);

//   // Function to place a bet with debounce to prevent multiple submissions
//   const placeBet = (side, amount) => {
//     // Validate inputs
//     if (
//       !side ||
//       !["andar", "bahar"].includes(side) ||
//       !amount ||
//       isNaN(amount) ||
//       amount <= 0
//     ) {
//       toast.error("Invalid bet parameters");
//       return;
//     }

//     // Check connection
//     if (!socket || !connected) {
//       toast.error("Not connected to the game server");
//       return;
//     }

//     // Check game state
//     if (gameState.status !== "betting") {
//       toast.error("Betting is not open right now");
//       return;
//     }

//     // Check if already placing a bet
//     if (isPlacingBet) {
//       toast.info("Your bet is being processed...");
//       return;
//     }

//     // Check if already placed a bet
//     if (currentBet) {
//       toast.warning("You've already placed a bet for this round");
//       return;
//     }

//     // Set flag to prevent multiple submissions
//     setIsPlacingBet(true);

//     try {
//       // Emit bet to server
//       socket.emit("placeBet", { side, amount });

//       // Set a timeout to reset the flag in case the server doesn't respond
//       setTimeout(() => {
//         setIsPlacingBet(false);
//       }, 5000);
//     } catch (error) {
//       console.error("Error placing bet:", error);
//       toast.error("Failed to place bet. Please try again.");
//       setIsPlacingBet(false);
//     }
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         connected,
//         gameState,
//         onlinePlayers,
//         currentBet,
//         placeBet,
//         gameHistory,
//         isPlacingBet,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

"use client";

import { createContext, useState, useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, updateBalance } = useContext(UserContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState({
    status: "waiting",
    jokerCard: null,
    andarCards: [],
    baharCards: [],
    winningSide: null,
    winningCardIndex: null,
    bettingTimeLeft: 0,
    players: [],
    totalBets: { andar: 0, bahar: 0 },
  });
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [currentBet, setCurrentBet] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Use refs to track connection attempts and prevent multiple reconnections
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimer = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Connect to the server
    const connectSocket = () => {
      try {
        // Clear any existing reconnect timer
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }

        // Create new socket connection
        const socketInstance = io(
          import.meta.env.VITE_SOCKET_URL ||
            "https://game-website-yyuo.onrender.com",
          {
            transports: ["websocket"],
            autoConnect: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            timeout: 10000, // Increase timeout to 10 seconds
          }
        );

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        // Reset reconnect attempts on successful connection
        socketInstance.on("connect", () => {
          reconnectAttempts.current = 0;
        });

        // Handle disconnect with custom reconnect logic
        socketInstance.on("disconnect", () => {
          setConnected(false);

          // Try to reconnect if under max attempts
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;

            // Set a timer to reconnect
            reconnectTimer.current = setTimeout(() => {
              if (socketRef.current) {
                socketRef.current.connect();
              } else {
                connectSocket();
              }
            }, 2000 * reconnectAttempts.current); // Exponential backoff
          } else {
            toast.error(
              "Connection lost. Please refresh the page to reconnect."
            );
          }
        });
      } catch (error) {
        toast.error(
          "Failed to connect to game server. Please refresh the page."
        );
      }
    };

    connectSocket();

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Connection events
    const handleConnect = () => {
      console.log("Connected to server");
      setConnected(true);

      // Authenticate with the server
      const token = localStorage.getItem("token");
      if (token) {
        socket.emit("authenticate", { token });
      }
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
      setConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Connection error:", error);
      // Don't show toast for every connection error to avoid spamming
      if (reconnectAttempts.current === 0) {
        toast.error("Failed to connect to the game server");
      }
    };

    // Authentication events
    const handleAuthenticated = (userData) => {
      // Check if the user data is valid
      if (userData && userData.balance !== undefined) {
        // If the user is a guest, update the balance
        if (!user && userData.balance) {
          updateBalance(userData.balance);
        }
      } else {
        // Handle the case where userData might be invalid (i.e., user not found)
        toast.error("User not found. Please login again.");
      }
    };

    const handleAuthError = (error) => {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    };

    // Game state events
    const handleGameState = (state) => {
      // Validate state before updating
      if (state && typeof state === "object") {
        setGameState(state);

        if (Array.isArray(state.players)) {
          setOnlinePlayers(state.players);
        }

        // If there's a last game result, add it to history
        if (
          state.lastGameResult &&
          state.lastGameResult.winningSide &&
          !gameHistory.some((g) => g.gameId === state.gameId)
        ) {
          setGameHistory((prev) =>
            [state.lastGameResult, ...prev].slice(0, 10)
          );
        }
      }
    };

    const handleBettingStarted = ({ timeLeft }) => {
      // toast.info(`Betting phase started! ${timeLeft} seconds to place your bets.`)
      setGameState((prev) => ({
        ...prev,
        status: "betting",
        bettingTimeLeft: timeLeft,
      }));
      // Reset current bet
      setCurrentBet(null);
      setIsPlacingBet(false);
    };

    const handleBettingTimeUpdate = ({ timeLeft }) => {
      setGameState((prev) => ({ ...prev, bettingTimeLeft: timeLeft }));

      if (timeLeft <= 5 && timeLeft > 0) {
        // toast.warning(`${timeLeft} seconds left to place your bet!`, {
        //   autoClose: 1000,
        //   hideProgressBar: true,
        // })
      }
    };

    const handleJokerRevealed = ({ jokerCard }) => {
      if (jokerCard) {
        setGameState((prev) => ({
          ...prev,
          status: "dealing",
          jokerCard,
          andarCards: [],
          baharCards: [],
        }));
      }
    };

    const handleCardDealt = ({ side, card, index }) => {
      if (!side || !card) return;

      setGameState((prev) => {
        if (side === "andar") {
          return {
            ...prev,
            andarCards: [...prev.andarCards, card],
          };
        } else {
          return {
            ...prev,
            baharCards: [...prev.baharCards, card],
          };
        }
      });
    };

    const handleGameResult = ({
      winningSide,
      winningCardIndex,
      winners,
      losers,
    }) => {
      setGameState((prev) => ({
        ...prev,
        status: "result",
        winningSide,
        winningCardIndex,
      }));

      // Check if the current user won or lost
      if (socket && Array.isArray(winners) && Array.isArray(losers)) {
        const socketId = socket.id;
        const winner = winners.find((w) => w.id === socketId);
        const loser = losers.find((l) => l.id === socketId);

        if (winner) {
          toast.success(`You won ${winner.winnings}!`, {
            icon: "🎉",
            autoClose: 5000,
          });
        } else if (loser) {
          toast.error(`You lost ${loser.loss}`, {
            autoClose: 5000,
          });
        }
      }
    };

    // Player events
    const handlePlayerJoined = ({ id, username }) => {
      if (!id || !username) return;

      // toast.info(`${username} joined the game`);

      setOnlinePlayers((prev) => {
        if (prev.find((p) => p.id === id)) return prev;
        return [...prev, { id, username, bet: null }];
      });
    };

    const handlePlayerLeft = ({ id, username }) => {
      if (!id) return;

      if (username) {
        // toast.info(`${username} left the game`);
      }

      setOnlinePlayers((prev) => prev.filter((p) => p.id !== id));
    };

    const handleBetPlaced = ({
      playerId,
      username,
      side,
      amount,
      totalBets,
    }) => {
      if (!playerId || !side || !amount) return;

      // Update total bets
      if (totalBets) {
        setGameState((prev) => ({
          ...prev,
          totalBets,
        }));
      }

      // Update player's bet
      setOnlinePlayers((prev) => {
        return prev.map((p) => {
          if (p.id === playerId) {
            return { ...p, bet: { side, amount } };
          }
          return p;
        });
      });

      // If it's the current user, update current bet
      if (playerId === socket.id) {
        setCurrentBet({ side, amount });
        setIsPlacingBet(false);
        toast.success(`Bet placed: ${amount} on ${side.toUpperCase()}`);
      }
    };

    const handleBetError = ({ message }) => {
      console.error("Bet error:", message);
      toast.error(message || "Error placing bet");
      setIsPlacingBet(false);
    };

    const handalBlockedUser = ({ message }) => {
      console.error("Blocked user:", message);
      toast.error(message || "Your account is blocked");
      setIsPlacingBet(false);
    }

    const handleBalanceUpdated = ({ balance }) => {
      if (balance !== undefined) {
        updateBalance(balance);
      }
    };

    const handleWinMessage = ({ amountWon }) => {
      // Additional win animation or sound could be triggered here
    };

    const handleLoseMessage = ({ amountLost }) => {
      // Additional lose animation or sound could be triggered here
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("authenticated", handleAuthenticated);
    socket.on("authError", handleAuthError);
    socket.on("gameState", handleGameState);
    socket.on("bettingStarted", handleBettingStarted);
    socket.on("bettingTimeUpdate", handleBettingTimeUpdate);
    socket.on("jokerRevealed", handleJokerRevealed);
    socket.on("cardDealt", handleCardDealt);
    socket.on("gameResult", handleGameResult);
    socket.on("playerJoined", handlePlayerJoined);
    socket.on("playerLeft", handlePlayerLeft);
    socket.on("betPlaced", handleBetPlaced);
    socket.on("betError", handleBetError);
    socket.on("balanceUpdated", handleBalanceUpdated);
    socket.on("winMessage", handleWinMessage);
    socket.on("loseMessage", handleLoseMessage);
    socket.on("blockedUser", handalBlockedUser);

    // Clean up event listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("authenticated", handleAuthenticated);
      socket.off("authError", handleAuthError);
      socket.off("gameState", handleGameState);
      socket.off("bettingStarted", handleBettingStarted);
      socket.off("bettingTimeUpdate", handleBettingTimeUpdate);
      socket.off("jokerRevealed", handleJokerRevealed);
      socket.off("cardDealt", handleCardDealt);
      socket.off("gameResult", handleGameResult);
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("playerLeft", handlePlayerLeft);
      socket.off("betPlaced", handleBetPlaced);
      socket.off("betError", handleBetError);
      socket.off("balanceUpdated", handleBalanceUpdated);
      socket.off("winMessage", handleWinMessage);
      socket.off("loseMessage", handleLoseMessage);
      socket.off("blockedUser", handalBlockedUser);
    };
  }, [socket, user, updateBalance, gameHistory]);

  // Function to place a bet with debounce to prevent multiple submissions
  const placeBet = (side, amount) => {
    // Validate inputs
    if (
      !side ||
      !["andar", "bahar"].includes(side) ||
      !amount ||
      isNaN(amount) ||
      amount <= 0
    ) {
      toast.error("Invalid bet parameters");
      return;
    }

    // Check connection
    if (!socket || !connected) {
      toast.error("Not connected to the game server");
      return;
    }

    // Check game state
    if (gameState.status !== "betting") {
      toast.error("Betting is not open right now");
      return;
    }

    // Check if already placing a bet
    if (isPlacingBet) {
      toast.info("Your bet is being processed...");
      return;
    }

    // Check if already placed a bet
    if (currentBet) {
      toast.warning("You've already placed a bet for this round");
      return;
    }
    if(user.isblocked){
      toast.error("Your account is blocked. Please contact support.");
      return;
    }

    // Set flag to prevent multiple submissions
    setIsPlacingBet(true);

    try {
      // Emit bet to server
      socket.emit("placeBet", { side, amount });

      // Set a timeout to reset the flag in case the server doesn't respond
      setTimeout(() => {
        setIsPlacingBet(false);
      }, 5000);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet. Please try again.");
      setIsPlacingBet(false);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        gameState,
        onlinePlayers,
        currentBet,
        placeBet,
        gameHistory,
        isPlacingBet,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
