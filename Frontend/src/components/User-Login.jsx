"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Navigation
import axios from "axios";
import NewBackground from "../assets/user-bg.png"; // Ensure path is correct

function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents form refresh

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

          
            setMessage(response.data.message);
            console.log("Response:", response);
            if (response.statusText === "OK") {
                localStorage.setItem("token", response.data.token);
                setEmail("");
                setPassword("");
                setMessage("");
                navigate("/dashboard");
                console.log("Response:", response);

            }
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div
            className="h-screen w-full flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${NewBackground})` }}
        >
            <Container maxWidth="lg" className="flex flex-col md:flex-row items-center justify-between">
                {/* Left Side - Title and description */}
                <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-yellow-400">ANDHAR</span>{" "}
                        <span className="text-white">BAHAR</span>
                    </h1>
                    <p className="text-lg mb-8 max-w-md">
                        Sign in to ANDHAR BAHAAR and experience real-time AI-powered gameplay insights.
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">We are happy to see you back...</h2>
                </div>

                {/* Right Side - Login Form */}
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
                            Sign in to your Account
                        </Typography>
                    </Box>

                    <Box component="form" className="space-y-4 mt-6" onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                        <Button
                            fullWidth
                            type="submit"
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

                        {message && <Typography variant="body2" className="text-red-500 text-center">{message}</Typography>}

                        <div className="flex items-center justify-center my-4">
                            <Divider className="flex-grow bg-gray-400" />
                            <Typography variant="body2" className="mx-2 text-gray-300">
                                Or
                            </Typography>
                            <Divider className="flex-grow bg-gray-400" />
                        </div>

                        <Typography
                            variant="body2"
                            className="text-center mt-4 text-gray-300 cursor-pointer hover:text-white"
                            onClick={() => navigate("/register")}
                        >
                            I DON'T HAVE AN ACCOUNT
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}

export default LoginScreen;
