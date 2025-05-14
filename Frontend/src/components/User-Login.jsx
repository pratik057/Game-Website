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
import { UserContext } from "../context/UserContext";
import NewBackground from "../assets/user-bg.png";
import Logo from "../assets/logo.png";

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifyr, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(identifyr, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen h-full w-full flex flex-col items-center justify-start bg-cover bg-center px-4 py-8 relative"
      style={{ backgroundImage: `url(${NewBackground})` }}
    >
      {/* Logo - Top Left on Desktop, Centered on Mobile */}
      <div className="w-full flex justify-center md:justify-start md:pl-8 absolute top-4 md:top-6">
        <img
          src={Logo}
          alt="Logo"
          className="w-20 md:w-24 lg:w-28"
          style={{ maxWidth: "150px", objectFit: "contain" }}
        />
      </div>

      {/* Main Container */}
      <Container
        maxWidth="lg"
        className="flex flex-col md:flex-row items-center justify-between w-full pt-28"
      >
        {/* Left Side - Title and Description */}
        <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8 text-center md:text-left">
          <p className="text-lg mb-6 max-w-md mx-auto md:mx-0">
            Sign in to ANDAR BAHAR and experience real-time gameplay insights.
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold">
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
            <Typography variant="subtitle1" sx={{ color: "#ffcc00" }}>
              WELCOME BACK
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#ffcc00", fontWeight: "bold" }}
            >
              Sign in to your Account
            </Typography>
          </Box>

          <Box
            component="form"
            className="space-y-4 mt-6"
            onSubmit={handleLogin}
          >
            {/* Email */}
            <TextField
              fullWidth
              label="Email or Username"
              variant="outlined"
              value={identifyr}
              onChange={(e) => setIdentifier(e.target.value)}
              InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
              sx={textFieldStyles}
            />

            {/* Password */}
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
              sx={textFieldStyles}
            />

            {/* Submit Button */}
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
              Login
            </Button>

            {/* Divider */}
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

            {/* Redirect to Register */}
            <Typography
              variant="body2"
              className="text-center mt-4 cursor-pointer hover:text-white"
              onClick={() => navigate("/register")}
              sx={{ color: "#ffcc00" }}
            >
              I DON'T HAVE AN ACCOUNT
            </Typography>
            <Typography
              variant="body2"
              className="text-center mt-4 cursor-pointer hover:text-white"
              onClick={() => navigate("/forgot-password")}
              sx={{ color: "#ffcc00" }}
            >
              Forget Password?
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255, 204, 0, 0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255, 204, 0, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255, 204, 0, 0.7)" },
    color: "#ffcc00",
  },
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
  marginBottom: "16px",
};

export default LoginScreen;
