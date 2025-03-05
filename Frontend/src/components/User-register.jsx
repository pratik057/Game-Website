"use client"

import { useState } from "react"
import {
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Divider,
    Box,
    Typography,
    Container,
    Paper,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import GoogleIcon from "@mui/icons-material/Google"
import NewBackground from "../assets/user-bg.png"
// import "./index.css"

function Page() {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-cover bg-center "
            style={{ backgroundImage: `url(${NewBackground})` }}>

            <Container maxWidth="lg" className="flex flex-col md:flex-row items-center justify-between">
                {/* Left side - Game title and description */}
                <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-yellow-400 font-outline-2">ANDHAR</span>{" "}
                        <span className="text-white font-outline-1">BAHAR</span>
                    </h1>

                    <p className="text-lg mb-8 max-w-md">
                        Sign up to ANDHAR BHAR Game and experience real-time AI-powered gameplay insights with expert live guidance.
                        Enhance your strategy, unlock personalized tips, and elevate your gaming skills to dominate the competition!
                    </p>

                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">We are Happy to see you back...</h2>

                    <div className="flex space-x-2 mt-4">
                        <div className="w-8 h-1 bg-white"></div>
                        <div className="w-8 h-1 bg-gray-400"></div>
                        <div className="w-8 h-1 bg-gray-600"></div>
                    </div>
                </div>

                {/* Right side - Login form */}
                <Paper
                    elevation={3}
                    className="md:w-5/12 w-full p-6 rounded-xl"
                    sx={{
                        backgroundColor: "rgba(200, 200, 255, 0.25)",
                        backdropFilter: "blur(10px)",
                        background: "linear-gradient(145deg, rgba(200, 200, 255, 0.4), rgba(200, 200, 255, 0.2))",
                    }}
                >
                    <Box className="text-center mb-4">
                        <Typography variant="subtitle1" className="text-gray-200 font-medium">
                            WELCOME BACK
                        </Typography>
                        <Typography variant="h5" className="text-gray-100 font-bold">
                            Sign up to your Account
                        </Typography>
                    </Box>

                    <Box component="form" className="space-y-4 mt-6">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            defaultValue="Entre Your Email"
                            InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
                                    color: "white",
                                },
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                marginBottom: "16px",
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            defaultValue="••••••••••••••"
                            InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
                                    color: "white",
                                },
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                marginBottom: "16px",
                            }}
                        />

                        <TextField
                            fullWidth
                            label="OTP"
                            type="password"
                            variant="outlined"
                            defaultValue="••••••"
                            InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
                                    color: "white",
                                },
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                marginBottom: "16px",
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            className="py-3 text-white font-medium"
                            sx={{
                                backgroundColor: "#00e676",
                                "&:hover": { backgroundColor: "#00c853" },
                                textTransform: "none",
                                borderRadius: "8px",
                                padding: "12px",
                            }}
                        >
                            Submit
                        </Button>

                        <div className="flex items-center justify-center my-4">
                            <Divider className="flex-grow bg-gray-400" />
                            <Typography variant="body2" className="mx-2 text-gray-300">
                                Or
                            </Typography>
                            <Divider className="flex-grow bg-gray-400" />
                        </div>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            className="py-3 text-gray-200 border-gray-400 br"
                            sx={{
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                color: "white",
                                "&:hover": {
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                },
                                textTransform: "none",
                                borderRadius: "8px",
                                padding: "12px",
                            }}
                        >
                            Register with Email
                        </Button>

                        <Typography variant="body2" className="text-center mt-4 text-gray-300 cursor-pointer hover:text-white br">
                            I HAVE A  ACCOUNT LOGIN HERE
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}

export default Page;

