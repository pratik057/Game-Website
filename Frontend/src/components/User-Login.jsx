"use client";

import { useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import UserContext
import NewBackground from "../assets/user-bg.png";

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext); // Get login function from context

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password); // Use context login function
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${NewBackground})` }}
    >
      <Container
        maxWidth="lg"
        className="flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Side - Title and description */}
        <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-yellow-400">ANDAR</span>{" "}
            <span className="text-white">BAHAR</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Sign in to ANDAR BAHAR and experience real-time AI-powered gameplay
            insights.
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            We are happy to see you back...
          </h2>
        </div>

        {/* Right Side - Login Form */}
        <Paper
          elevation={3}
          className="md:w-5/12 w-full p-6 rounded-xl"
          sx={{
            background: "rgba(200, 200, 255, 0.25)",
            backdropFilter: "blur(10px)",
            color: "#ffcc00",
            padding: "24px",
          }}
        >
          <Box className="text-center mb-4">
            <Typography
              variant="subtitle1"
              className="font-medium"
              sx={{ color: "#ffcc00" }}
            >
              WELCOME BACK
            </Typography>
            <Typography
              variant="h5"
              className="font-bold"
              sx={{ color: "#ffcc00" }}
            >
              Sign in to your Account
            </Typography>
          </Box>

          <Box
            component="form"
            className="space-y-4 mt-6"
            onSubmit={handleLogin}
          >
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 204, 0, 0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 204, 0, 0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 204, 0, 0.7)",
                  },
                  color: "#ffcc00",
                },
                backgroundColor: "rgba(255, 255, 255, 0.05)",
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
              InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: "#ffcc00" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 204, 0, 0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 204, 0, 0.5)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 204, 0, 0.7)",
                  },
                  color: "#ffcc00",
                },
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#00e676",
                "&:hover": { backgroundColor: "#00c853" },
                textTransform: "none",
                borderRadius: "8px",
                padding: "12px",
                fontWeight: "bold",
                color: "#1a1a2e",
              }}
            >
              Submit
            </Button>

            <div className="flex items-center justify-center my-4">
              <Divider sx={{ backgroundColor: "#ffcc00", flexGrow: 1 }} />
              <Typography
                variant="body2"
                className="mx-2"
                sx={{ color: "#ffcc00" }}
              >
                Or
              </Typography>
              <Divider sx={{ backgroundColor: "#ffcc00", flexGrow: 1 }} />
            </div>

            <Typography
              variant="body2"
              className="text-center mt-4 cursor-pointer hover:text-white"
              onClick={() => navigate("/register")}
              sx={{ color: "#ffcc00" }}
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
