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
} from "@mui/material"
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material"

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
        token,           // ✅ send the token in the body
        newPassword,     // ✅ send the new password in the body
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
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8 rounded-lg">
        <Box className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <LockOutlined className="text-blue-500" fontSize="large" />
          </div>
          <Typography variant="h4" component="h2" className="text-center font-medium">
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" className="text-center mt-2">
            Create a new password for your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Box className="mb-4">
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {newPassword && (
              <Box className="mt-2">
                <Box className="flex justify-between items-center mb-1">
                  <Typography variant="caption" color="textSecondary">
                    Password Strength:
                  </Typography>
                  <Typography variant="caption" color={getStrengthColor()}>
                    {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={passwordStrength} color={getStrengthColor()} />
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="mb-4"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={confirmPassword && newPassword !== confirmPassword}
            helperText={confirmPassword && newPassword !== confirmPassword ? "Passwords don't match" : ""}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading || !token}
            className="py-3 mt-4"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>
        </form>

        {success && (
          <Alert severity="success" className="mt-4">
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  )
}

export default ResetPassword
