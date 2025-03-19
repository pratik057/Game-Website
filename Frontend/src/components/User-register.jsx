// import { useState } from "react";
// import axios from "axios";
// import NewBackground from "../assets/user-bg.png";
// import {
//     TextField,
//     InputAdornment,
//     IconButton,
//     Button,
//     Divider,
//     Box,
//     Typography,
//     Container,
//     Paper
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons properly
// import GoogleIcon from "@mui/icons-material/Google"; // Import Google icon properly

// const Register = () => {
//     const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: User Details
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const [showPassword, setShowPassword] = useState(false); // Added missing state

//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleSendOtp = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/send-otp`, { email });
//             setMessage(response.data.message);
//             setStep(2); // Move to OTP verification step
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error sending OTP");
//         }
//     };

//     const handleVerifyOtp = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/verify-otp`, { email, otp });
//             setMessage(response.data.message);
//             if (response.data.message === "OTP verified successfully") {
//                 setStep(3); // Move to user details step
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error verifying OTP");
//         }
//     };

//     const handleRegister = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/register`, {
//                 username, email, password
//             });
//             setMessage(response.data.message);
//             if (response.data.message === "User registered successfully") {
//                 setStep(1); // Reset to first step
//                 setEmail("");
//                 setOtp("");
//                 setUsername("");
//                 setPassword("");
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error registering");
//         }
//     };

//     return (
//         <div className="h-screen w-full flex items-center justify-center bg-cover bg-center"
//             style={{ backgroundImage: `url(${NewBackground})` }}>

//             <Container maxWidth="lg" className="flex flex-col md:flex-row items-center justify-between">
//                 {/* Left side - Game title and description */}
//                 <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
//                     <h1 className="text-4xl md:text-5xl font-bold mb-6">
//                         <span className="text-yellow-400 font-outline-2">ANDHAR</span>{" "}
//                         <span className="text-white font-outline-1">BAHAR</span>
//                     </h1>

//                     <p className="text-lg mb-8 max-w-md">
//                         Sign up to ANDHAR BHAR Game and experience real-time AI-powered gameplay insights with expert live guidance.
//                         Enhance your strategy, unlock personalized tips, and elevate your gaming skills to dominate the competition!
//                     </p>

//                     <h2 className="text-2xl md:text-3xl font-semibold mb-4">We are Happy to see you back...</h2>

//                     <div className="flex space-x-2 mt-4">
//                         <div className="w-8 h-1 bg-white"></div>
//                         <div className="w-8 h-1 bg-gray-400"></div>
//                         <div className="w-8 h-1 bg-gray-600"></div>
//                     </div>
//                 </div>

//                 {/* Right side - Registration Form */}
//                 <Paper
//                     elevation={3}
//                     className="md:w-5/12 w-full p-6 rounded-xl"
//                     sx={{
//                         backgroundColor: "rgba(200, 200, 255, 0.25)",
//                         backdropFilter: "blur(10px)",
//                         background: "linear-gradient(145deg, rgba(200, 200, 255, 0.4), rgba(200, 200, 255, 0.2))",
//                     }}
//                 >
//                     <Box className="text-center mb-4">
//                         <Typography variant="subtitle1" className="text-gray-200 font-medium">
//                             WELCOME
//                         </Typography>
//                         <Typography variant="h5" className="text-gray-100 font-bold">
//                             Sign up to your Account
//                         </Typography>
//                     </Box>

//                     <Box component="form" className="space-y-4 mt-6">
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             variant="outlined"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
//                                     "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
//                                     "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
//                                     color: "white",
//                                 },
//                                 backgroundColor: "rgba(255, 255, 255, 0.1)",
//                                 borderRadius: "8px",
//                                 marginBottom: "16px",
//                             }}
//                         />

//                         <TextField
//                             fullWidth
//                             label="Password"
//                             type={showPassword ? "text" : "password"}
//                             variant="outlined"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
//                                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
//                                     "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
//                                     "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
//                                     color: "white",
//                                 },
//                                 backgroundColor: "rgba(255, 255, 255, 0.1)",
//                                 borderRadius: "8px",
//                                 marginBottom: "16px",
//                             }}
//                         />

//                         <Button
//                             fullWidth
//                             variant="contained"
//                             onClick={handleSendOtp}
//                             sx={{
//                                 backgroundColor: "#00e676",
//                                 "&:hover": { backgroundColor: "#00c853" },
//                                 textTransform: "none",
//                                 borderRadius: "8px",
//                                 padding: "12px",
//                             }}
//                         >
//                             Send OTP
//                         </Button>
//                     </Box>
//                 </Paper>
//             </Container>
//         </div>
//     );
// };

// export default Register;
// import { useState } from "react";
// import axios from "axios";
// import NewBackground from "../assets/user-bg.png";
// import { useNavigate } from "react-router-dom";
// import {
//     TextField,
//     Button,

//     Typography,
//     Paper,
//     Container,
//     InputAdornment,
//     IconButton, 
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons properly
// // Import Google icon properly

//  // Import Google icon properly

// const Register = () => {
//     const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: User Details
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const [showPassword, setShowPassword] = useState(false); // Added missing state



//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const navigate = useNavigate();
//     const handleSendOtp = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/send-otp`, { email });
//             setMessage(response.data.message);
//             setStep(2); // Move to OTP verification step
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error sending OTP");
//         }
//     };

//     const handleVerifyOtp = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/verify-otp`, { email, otp });
//             setMessage(response.data.message);
//             if (response.data.message === "OTP verified successfully. You can now register.") {
//                 setStep(3); // Move to user details step
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error verifying OTP");
//         }
//     };

//     const handleRegister = async () => {
//         try {
//             const response = await axios.post(`https://game-website-yyuo.onrender.com/api/auth/register`, {
//                 username, email, password
//             });
//             setMessage(response.data.message);
//             if (response.data.message === "User registered successfully") {
//                 navigate("/dashboard");
//                 setEmail("");
//                 setOtp("");
//                 setUsername("");
//                 setPassword("");
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Error registering");
//         }
//     };

//     return (
    
//     <>
//     <div className="h-screen w-full flex items-center justify-center bg-cover bg-center"
//             style={{ backgroundImage: `url(${NewBackground})` }}>

//             <Container maxWidth="lg" className="flex flex-col md:flex-row items-center justify-between">
//                 {/* Left side - Game title and description */}
//                 <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
//                     <h1 className="text-4xl md:text-5xl font-bold mb-6">
//                         <span className="text-yellow-400 font-outline-2">ANDHAR</span>{" "}
//                         <span className="text-white font-outline-1">BAHAR</span>
//                     </h1>

//                     <p className="text-lg mb-8 max-w-md">
//                         Sign up to ANDHAR BHAR Game and experience real-time AI-powered gameplay insights with expert live guidance.
//                         Enhance your strategy, unlock personalized tips, and elevate your gaming skills to dominate the competition!
//                     </p>

//                     <h2 className="text-2xl md:text-3xl font-semibold mb-4">We are Happy to see you back...</h2>

//                     <div className="flex space-x-2 mt-4">
//                         <div className="w-8 h-1 bg-white"></div>
//                         <div className="w-8 h-1 bg-gray-400"></div>
//                         <div className="w-8 h-1 bg-gray-600"></div>
//                     </div>
//                 </div>








//                 {/* Right side - Registration Form */}
  
//         <Container maxWidth="sm">
//             <Paper
//                 elevation={3}
//                 className="p-6 rounded-xl"
//                 sx={{
//                     backgroundColor: "rgba(200, 200, 255, 0.25)",
//                     backdropFilter: "blur(10px)",
//                     background: "linear-gradient(145deg, rgba(200, 200, 255, 0.4), rgba(200, 200, 255, 0.2))",
//                     padding: "24px",
//                     color: "white"
//                 }}
//             >
//                 <Typography variant="h5" className="text-center font-bold mb-4" sx={{ color: "white" }}>
//                     {step === 1 ? "Register" : step === 2 ? "Verify OTP" : "Create Account"}
//                 </Typography>
//                 {step === 1 && (
//                     <>
//                         <TextField
//                             fullWidth
//                             label="Enter Your Email"
//                             variant="outlined"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
//                                     "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
//                                     "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
//                                     color: "white",
//                                 },
//                                 backgroundColor: "rgba(255, 255, 255, 0.1)",
//                                 borderRadius: "8px",
//                                 marginBottom: "16px",
//                             }}
//                         />
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             onClick={handleSendOtp}
//                             sx={{ backgroundColor: "#00e676", "&:hover": { backgroundColor: "#00c853" }, borderRadius: "8px", padding: "12px" }}
//                         >
//                             Send OTP
//                         </Button>
//                     </>
//                 )}
//                 {step === 2 && (
//                     <>
//                         <TextField
//                             fullWidth
//                             label="Enter OTP"
//                             variant="outlined"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             sx={{ marginBottom: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
//                         />
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             onClick={handleVerifyOtp}
//                             sx={{ backgroundColor: "#28a745", "&:hover": { backgroundColor: "#218838" }, borderRadius: "8px", padding: "12px" }}
//                         >
//                             Verify OTP
//                         </Button>
//                     </>
//                 )}
//                 {step === 3 && (
//                     <>
//                         <TextField
//                             fullWidth
//                             label="Enter Username"
//                             variant="outlined"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             sx={{ marginBottom: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
//                         />
//                         <TextField
//                             fullWidth
//                             label="Enter Password"
//                             type={showPassword ? "text" : "password"}
//                             variant="outlined"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
//                                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{ marginBottom: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
//                         />
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             onClick={handleRegister}
//                             sx={{ backgroundColor: "#6f42c1", "&:hover": { backgroundColor: "#5937a3" }, borderRadius: "8px", padding: "12px" }}
//                         >
//                             Register
//                         </Button>
//                     </>
//                 )}
//                 {message && <Typography className="mt-2 text-center" sx={{ color: "#ff4444" }}>{message}</Typography>}
//             </Paper>
//         </Container>
//             </Container>
//         </div>

//                 </>  
//     );
// };

// export default Register;
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserContext } from "../context/UserContext";

const Register = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { sendOtp, verifyOtp, register } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSendOtp = async () => {
        const responseMessage = await sendOtp(email);
        setMessage(responseMessage);
        if (responseMessage.includes("OTP sent")) setStep(2);
    };

    const handleVerifyOtp = async () => {
        const responseMessage = await verifyOtp(email, otp);
        setMessage(responseMessage);
        if (responseMessage.includes("OTP verified")) setStep(3);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        const responseMessage = await register(username, email, password);
        setMessage(responseMessage);
     
        if (responseMessage) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${NewBackground})` }}>
            <Container maxWidth="lg" className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-10 md:mb-0 md:w-1/2 md:pr-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-yellow-400">ANDHAR</span>{" "}
                        <span className="text-white">BAHAR</span>
                    </h1>
                    <p className="text-lg mb-8 max-w-md">
                        Sign up to ANDHAR BAHAR and experience real-time AI-powered gameplay insights with expert live guidance.
                    </p>
                </div>

                <Container maxWidth="sm">
                    <Paper elevation={3} className="p-6 rounded-xl" sx={{ backgroundColor: "rgba(200, 200, 255, 0.25)", backdropFilter: "blur(10px)", padding: "24px", color: "white" }}>
                        <Typography variant="h5" className="text-center font-bold mb-4" sx={{ color: "white" }}>
                            {step === 1 ? "Register" : step === 2 ? "Verify OTP" : "Create Account"}
                        </Typography>

                        {step === 1 && (
                            <>
                                <TextField fullWidth label="Enter Your Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ marginBottom: 2 }} InputProps={{ style: { color:"white" } }} />
                                <Button fullWidth variant="contained" onClick={handleSendOtp} sx={{ backgroundColor: "#00e676" }}>Send OTP</Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <TextField fullWidth label="Enter OTP" variant="outlined" value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ marginBottom: 2 ,color:"white"}} InputProps={{ style: { color:"white" } }} />
                                <Button fullWidth variant="contained" onClick={handleVerifyOtp} sx={{ backgroundColor: "#28a745" }}>Verify OTP</Button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <TextField fullWidth label="Enter Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ marginBottom: 2 ,color:"white" }} InputProps={{ style: { color:"white" } }} />
                                <TextField fullWidth label="Enter Password" type={showPassword ? "text" : "password"} variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ marginBottom: 2,color:"white" }}
                                />
                                <TextField fullWidth label="Confirm Password" type="password" variant="outlined" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ marginBottom: 2,color:"white" }} InputProps={{ style: { color:"white" } }} />
                                <Button fullWidth variant="contained" onClick={handleRegister} sx={{ backgroundColor: "#6f42c1" }}>Register</Button>
                            </>
                        )}
                        {message && <Typography className="mt-2 text-center" sx={{ color: "#ff4444" }}>{message}</Typography>}
                    </Paper>
                </Container>
            </Container>
        </div>
    );
};

export default Register;
