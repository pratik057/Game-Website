import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserContext } from "../context/UserContext";
import NewBackground from "../assets/user-bg.png";
import Logo from "../assets/logo.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const responseMessage = await register(username, email, password, mobileNo);
    setMessage(responseMessage);

    if (responseMessage) {
      navigate("/dashboard");
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${NewBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 5},
        // px: 2,
        position: "relative",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 24, md: 24 },
          left: { xs: "50%", md: 32 },
          transform: { xs: "translateX(-50%)", md: "none" },
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "90px", height: "90px", objectFit: "contain" }}
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: { xs: 10, md: [-1] } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* Left Text */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" }, color: "#fff" }}>
            
            <Typography variant="h6" sx={{ maxWidth: "400px" }}>
              Sign up to ANDAR BAHAR and experience real-time gameplay insights with expert live guidance.
            </Typography>
          </Box>

          {/* Register Form */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 3,
              background: "rgba(200, 200, 255, 0.25)",
              backdropFilter: "blur(10px)",
              color: "#ffcc00",
            }}
          >
            <Box textAlign="center" mb={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                WELCOME
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Create your Account
              </Typography>
            </Box>

            <form onSubmit={handleRegister}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
                  sx={inputStyles}
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
                  sx={inputStyles}
                />
                <TextField
                  label="Mobile Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
                  sx={inputStyles}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "#ffcc00" }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
                  sx={inputStyles}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputLabelProps={{ style: { color: "rgba(255, 204, 0, 0.7)" } }}
                  sx={inputStyles}
                />

                {message && (
                  <Typography variant="body2" color="error" textAlign="center">
                    {message}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#00e676",
                    "&:hover": { backgroundColor: "#00c853" },
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "#1a1a2e",
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Register
                </Button>

                <Divider sx={{ backgroundColor: "#ffcc00", my: 2 }} />

                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: "#ffcc00", cursor: "pointer", "&:hover": { color: "#fff" } }}
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Sign in
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255, 204, 0, 0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255, 204, 0, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255, 204, 0, 0.7)" },
    color: "#ffcc00",
  },
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
};

export default Register;
