"use client"

import { useState } from "react"
import axios from "axios"
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { MailOutline } from "@mui/icons-material"
import Logo from "../assets/logo.png"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post("https://game-website-yyuo.onrender.com/api/auth/forgot-password", { email })
      setMessage(response.data.message)
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-black to-blue-900">
      {/* Logo Section */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="w-24 md:w-32 lg:w-40">
          <img
                   src={Logo}
                   alt="Logo"
                   style={{ width: "90px", height: "90px", objectFit: "contain" }}
                 />
        </div>
      </div>

      <Container maxWidth="sm" className="flex-grow flex items-center justify-center px-4 py-8">
        <Paper
          elevation={6}
          className="w-full rounded-lg overflow-hidden"
          sx={{
            bgcolor: "rgba(45, 45, 80, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            p: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Box className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-100/10 flex items-center justify-center mb-4">
              <MailOutline sx={{ color: "#FFD700", fontSize: 32 }} />
            </div>
            <Typography
              variant="h4"
              component="h2"
              className="text-center font-medium"
              sx={{ color: "#FFD700", fontWeight: 600, mb: 1 }}
            >
              Forgot Password
            </Typography>
            <Typography variant="body1" className="text-center mt-2" sx={{ color: "rgba(255, 215, 0, 0.7)" }}>
              Enter your email address and we'll send you a link to reset your password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mb-4"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 215, 0, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 215, 0, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFD700",
                  },
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 215, 0, 0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FFD700",
                },
                mb: 3,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              className="py-3 mt-2"
              sx={{
                bgcolor: "#00E676",
                color: "#000",
                fontWeight: "bold",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#00C853",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0, 230, 118, 0.5)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
            </Button>
          </form>

          {message && (
            <Alert
              severity="success"
              className="mt-4"
              sx={{ mt: 3, bgcolor: "rgba(0, 200, 83, 0.2)", color: "#00E676" }}
            >
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" className="mt-4" sx={{ mt: 3, bgcolor: "rgba(255, 0, 0, 0.2)", color: "#ff6b6b" }}>
              {error}
            </Alert>
          )}

          <Box className="mt-6 text-center" sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ color: "rgba(255, 215, 0, 0.7)" }}>
              Remember your password?{" "}
              <a
                href="/login"
                className="text-yellow-400 hover:underline"
                style={{ color: "#FFD700", textDecoration: "none" }}
              >
                Back to login
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Optional footer text */}
      <Box className="p-4 text-center" sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.8rem", mt: 2 }}>
        © {new Date().getFullYear()} Chetan's Royals Webtech Pvt. Ltd
. All rights reserved.
      </Box>
    </div>
  )
}

export default ForgotPassword
