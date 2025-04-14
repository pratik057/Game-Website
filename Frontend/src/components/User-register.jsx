import { useState, useContext } from "react";
import NewBackground from "../assets/user-bg.png";
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

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, login } = useContext(UserContext);  // Assuming there's a login function in context
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const responseMessage = await register(username, email, password,mobileNo);
    setMessage(responseMessage);

    if (responseMessage) {
      navigate("/dashboard");
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            <span className="text-yellow-400">ANDAR</span> <span className="text-white">BAHAR</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Sign up to ANDAR BAHAR and experience real-time AI-powered gameplay insights with expert live guidance.
          </p>
        </div>

        {/* Right Side - Register Form */}
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
            <Typography variant="subtitle1" className="font-medium" sx={{ color: "#ffcc00" }}>
              WELCOME
            </Typography>
            <Typography variant="h5" className="font-bold" sx={{ color: "#ffcc00" }}>
              Create your Account
            </Typography>
          </Box>

          <Box component="form" className="space-y-4 mt-6" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              label="Email"
              type="email"
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
              label="Mobile Number"
              type="tel"
              variant="outlined"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
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
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Button
              type="submit"
              fullWidth
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
              Register
            </Button>

            <div className="flex items-center justify-center my-4">
              <Divider sx={{ backgroundColor: "#ffcc00", flexGrow: 1 }} />
              <Typography variant="body2" className="mx-2" sx={{ color: "#ffcc00" }}>
                Or
              </Typography>
              <Divider sx={{ backgroundColor: "#ffcc00", flexGrow: 1 }} />
            </div>

            <Typography
              variant="body2"
              className="text-center mt-4 cursor-pointer hover:text-white"
              onClick={() => navigate("/login")}
              sx={{ color: "#ffcc00" }}
            >
              Already have an account? Sign in
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
