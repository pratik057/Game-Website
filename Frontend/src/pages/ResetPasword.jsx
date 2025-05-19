"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material"
import Logo from "../assets/logo.png"

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const token = new URLSearchParams(location.search).get("token")

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await axios.put("https://game-website-yyuo.onrender.com/api/auth/reset-password", {
        token,
        newPassword,
      })
      setSuccess(response.data.message)
      setError("")
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred")
      setSuccess("")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setError("Invalid reset token")
    }
  }, [token])

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "error"
    if (passwordStrength < 75) return "warning"
    return "success"
  }

  const getStrengthLabel = () => {
    if (passwordStrength < 50) return "Weak"
    if (passwordStrength < 75) return "Medium"
    return "Strong"
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
   
      
      <Container maxWidth="lg" className="flex flex-col  items-center justify-between">
        {/* Left side with logo and welcome text */}
        
        {/* Right side with form */}
        <div className="w-full md:w-5/12">
          <Paper 
            elevation={6} 
            className="rounded-xl shadow-xl"
            sx={{ 
              bgcolor: 'rgba(45, 45, 80, 0.9)', 
              p: { xs: 3, sm: 4 },
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box className="flex flex-col items-center mb-6">
              <Typography 
                variant="h6" 
                component="h3" 
                className="text-center font-medium"
                sx={{ color: '#FFD700', mb: 1 }}
              >
                WELCOME BACK
              </Typography>
              <Typography 
                variant="h4" 
                component="h1" 
                className="text-center font-bold"
                sx={{ color: '#FFD700', mb: 3 }}
              >
                Reset Your Password
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                className="mb-4 rounded-lg"
                sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff8a80' }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert 
                severity="success" 
                className="mb-4 rounded-lg"
                sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#69f0ae' }}
              >
                {success} Redirecting to login...
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{ color: '#FFD700' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD700',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFD700',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
              />
              
              {newPassword && (
                <Box className="mt-1 mb-3">
                  <Box className="flex justify-between items-center mb-1">
                    <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.7)' }}>
                      Password Strength:
                    </Typography>
                    <Typography variant="caption" color={getStrengthColor()}>
                      {getStrengthLabel()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getStrengthColor()}
                    className="rounded-full h-1"
                  />
                  <Box className="mt-1 grid grid-cols-4 gap-1">
                    <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.7)', fontSize: '0.7rem' }}>
                      {passwordStrength >= 25 ? "✓" : "○"} 8+ characters
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.7)', fontSize: '0.7rem' }}>
                      {/[A-Z]/.test(newPassword) ? "✓" : "○"} Uppercase
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.7)', fontSize: '0.7rem' }}>
                      {/[0-9]/.test(newPassword) ? "✓" : "○"} Number
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.7)', fontSize: '0.7rem' }}>
                      {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} Symbol
                    </Typography>
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        edge="end"
                        sx={{ color: '#FFD700' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={confirmPassword && newPassword !== confirmPassword}
                helperText={confirmPassword && newPassword !== confirmPassword ? "Passwords don't match" : ""}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD700',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFD700',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f44336',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !token}
                sx={{
                  py: 1.5,
                  mt: 2,
                  mb: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  bgcolor: "#00E676",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#00C853",
                  },
                  borderRadius: "8px",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
              </Button>

              <Box className="flex flex-col items-center">
                <Box className="flex items-center w-full mb-4">
                  <div className="flex-grow h-px bg-gray-600"></div>
                  <Typography variant="body2" sx={{ color: '#FFD700', mx: 2 }}>
                    Or
                  </Typography>
                  <div className="flex-grow h-px bg-gray-600"></div>
                </Box>

                <Typography 
                  variant="body2" 
                  className="text-center cursor-pointer"
                  sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Typography>
              </Box>
            </form>
          </Paper>
        </div>
      </Container>
    </div>
  )
}

export default ResetPassword
