"use client";

import { useState } from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import backgroundImg from "../assets/bg.png";

function UserDashboard() {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    // Reset active button after animation completes
    setTimeout(() => {
      setActiveButton(null);
    }, 500);
  };

  return (
      

     <div
          className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        >
      {/* Animated Background Effect */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Game Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" className="text-6xl md:text-7xl font-extrabold mb-12 game-title tracking-widest text-white">
          <span className="text-yellow-400 drop-shadow-lg">ANDHAR</span> <span className="text-white drop-shadow-lg">BAHAR</span>
        </Typography>
      </motion.div>

      <Container className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Menu Panel */}
        <Box className="bg-blue-900/80 rounded-xl p-8 w-full md:w-1/3 flex flex-col items-center gap-6 shadow-2xl backdrop-blur-lg border border-white/20">
          {[
            { name: "newGame", label: "New Game", gradient: "bg-gradient-to-b from-yellow-400 to-orange-500", text: "text-black" },
            { name: "deposit", label: "Deposit", gradient: "bg-transparent", text: "text-white" },
            { name: "withdraw", label: "Withdraw", gradient: "bg-transparent", text: "text-white" },
            { name: "exit", label: "Exit Game", gradient: "bg-transparent", text: "text-white" }
          ].map((btn) => (
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} className="w-full" key={btn.name}>
              <Button
                variant="contained"
                fullWidth
                className={`py-3 text-xl font-bold rounded-md transition-all duration-300 ${btn.gradient} ${btn.text} ${
                  activeButton === btn.name ? "animate-pulse-yellow" : ""
                } shadow-lg hover:shadow-xl`}
                sx={{
                  background: btn.name === "newGame" ? "linear-gradient(to bottom, #ffeb3b, #ffc107, #ff9800)" : "transparent",
                  color: btn.name === "newGame" ? "#000" : "#fff",
                  "&:hover": {
                    background: btn.name === "newGame" ? "linear-gradient(to bottom, #ffd740, #ffb300, #ff8f00)" : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={() => handleButtonClick(btn.name)}
              >
                {btn.label}
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* Game Host Image */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
          <Box className="w-full md:w-2/3 flex justify-center">
            <img src="/game-host.png" alt="Game Host" className="max-h-[500px] object-contain drop-shadow-2xl" />
          </Box>
        </motion.div>
      </Container>
    </div>
  );
}

export default UserDashboard;
