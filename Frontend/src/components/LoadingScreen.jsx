"use client"


import { useState, useEffect } from "react"
import { LinearProgress } from "@mui/material"
import "../index.css"
import backgroundimg from "../assets/bg.png"
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: `url(${backgroundimg})`}}>


      <div className="z-10 flex flex-col items-center justify-center gap-16">
        <h1 className="text-3xl font-bold tracking-wider text-white sm:text-6xl">
          <span
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent zen-tokyo-zoo-regular "
            style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
          >
            ANDHAR
          </span>
          <span
            className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent zen-tokyo-zoo-regular"
            style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
          >
            {" "}
            BAHAR
          </span>
        </h1>

        <div className="w-full max-w-md px-4">
          <div className="mb-2 flex justify-between">
            <span className="text-gray-300 text-sm">LOADING {Math.round(progress)}%</span>
          </div>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#a5b4fc",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

