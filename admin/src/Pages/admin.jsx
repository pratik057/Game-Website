// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
// } from "@mui/material";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchEmail, setSearchEmail] = useState("");
//   const [show, setShow] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [addBalance, setAddBalance] = useState("");
//   const [removeBalance, setRemoveBalance] = useState("");
//   const [formData, setFormData] = useState({
//     userId: "",
//     username: "",
//     email: "",
//     balance: 0,
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       alert("Authentication token not found. Please log in again.");
//       return;
//     }

//     try {
//       const res = await axios.get("https://game-website-yyuo.onrender.com/api/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users);
//       setFilteredUsers(res.data.users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       alert("Failed to fetch users. Please try again.");
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchEmail(query);
//     setFilteredUsers(
//       users.filter((user) =>
//         user.email.toLowerCase().includes(query) ||
//         user.username.toLowerCase().includes(query)
//       )
//     );
//   };
  

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setFormData({
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       balance: user.balance,
//     });
//     setAddBalance("");
//     setRemoveBalance("");
//     setShow(true);
//   };

  

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleBalanceChange = (e) => {
//     const value = e.target.value;
//     if (/^\d*\.?\d*$/.test(value)) setAddBalance(value);
//   };

//   const handleRemoveBalanceChange = (e) => {
//     const value = e.target.value;
//     if (/^\d*\.?\d*$/.test(value)) setRemoveBalance(value);
//   };

//   const handleSave = async () => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return alert("Token missing. Log in again.");

//     const additional = parseFloat(addBalance) || 0;
//     const deduction = parseFloat(removeBalance) || 0;
//     let updatedBalance = (parseFloat(formData.balance) || 0) + additional - deduction;

//     if (updatedBalance < 0) return alert("Balance can't be negative!");

//     try {
//       await axios.put(
//         `https://game-website-yyuo.onrender.com/api/admin/users/${selectedUser._id}`,
//         { ...formData, balance: updatedBalance },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       fetchUsers();
//       setShow(false);
//     } catch (error) {
//       console.error("Update error:", error);
//       alert("Failed to update user.");
//     }
//   };

//   const handleDelete = async (userId) => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return alert("Token missing.");

//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await axios.delete(
//         `https://game-website-yyuo.onrender.com/api/admin/users/${userId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Failed to delete user.");
//     }
//   };

//   const toggleBlock = async (userId, isBlocked) => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return alert("Token missing.");

//     try {
//       await axios.put(
//         `https://game-website-yyuo.onrender.com/api/admin/users/${userId}/block`,
//         { isBlocked: !isBlocked },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//     } catch (error) {
//       console.error("Block/unblock error:", error);
//       alert("Failed to update block status.");
//     }
//   };

//   const userCount = filteredUsers.length;
//   const totalBalance = filteredUsers.reduce((acc, user) => acc + (user.balance || 0), 0);
//   const ActiveUser = filteredUsers.filter(user => user.isActive).length;
//   return (
//     <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Users List</h2>

//       {/* Search and Stats */}
//       <div className="flex justify-between items-center mb-4">
//         <TextField
//           label="Search by Email or Username"
//           value={searchEmail}
//           onChange={handleSearch}
//           variant="outlined"
//           sx={{ width: "40%" }}
//         />
//         <div className="space-x-6 text-gray-700 font-medium">
//           <span>👤 Total Users: {userCount}</span>
//           <span>💰 Total Coins: {totalBalance}</span>
//           <span>🟢 Active Users: {ActiveUser}</span>
//         </div>
//       </div>

//       {/* Users Table */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead className="bg-blue-600">
//             <TableRow>
//               <TableCell className="text-white">User ID</TableCell>
//               <TableCell className="text-white">Username</TableCell>
//               <TableCell className="text-white">Email</TableCell>
//               <TableCell className="text-white">Balance</TableCell>
//               <TableCell className="text-white text-center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <TableRow key={user._id} hover>
//                   <TableCell>{user._id}</TableCell>
//                   <TableCell>{user.username}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>COINS: {user.balance}</TableCell>
//                   <TableCell className="text-center space-x-2">
//                     <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handleDelete(user._id)}
//                     >
//                       Delete
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color={user.isBlocked ? "success" : "warning"}
//                       onClick={() => toggleBlock(user._id, user.isBlocked)}
//                     >
//                       {user.isBlocked ? "Unblock" : "Block"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center text-gray-500">
//                   No users found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Edit Dialog */}
//       <Dialog open={show} onClose={() => setShow(false)}>
//         <DialogTitle>Edit User</DialogTitle>
//         <DialogContent className="space-y-4 mt-2">
//           <TextField fullWidth label="User ID" value={formData.userId} disabled />
//           <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} />
//           <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
//           <TextField fullWidth label="Current Balance" value={`COINS: ${formData.balance}`} disabled />
//           <TextField fullWidth label="Add Balance" value={addBalance} onChange={handleBalanceChange} />
//           <TextField fullWidth label="Remove Balance" value={removeBalance} onChange={handleRemoveBalanceChange} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShow(false)} color="secondary">Close</Button>
//           <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default Users;  
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Tab,
  Tabs,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  LockOpen as UnblockIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneNoIcon,
  Email as EmailIcon,
  FilterAlt as FilterIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Key as KeyIcon,
} from "@mui/icons-material"
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from "@mui/icons-material/Close";
// Add this CSS animation to the top of the file, after the imports
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
.pulse-animation {
  animation: pulse 2s infinite;
}
`

const Users = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all") // "all", "email", "mobileNo", "username"
  const [show, setShow] = useState(false)
 
  const [selectedUser, setSelectedUser] = useState(null)
 
const [showDialog, setShowDialog] = useState(false)
  const [games, setGames] = useState([])

 // Default bet limit
  const [addBalance, setAddBalance] = useState("")
  const [removeBalance, setRemoveBalance] = useState("")
  const [loading, setLoading] = useState(true)
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    mobileNo: "",
    balance: 0,
    password: "",
    confirmPassword: "",
    betLimit: 0, // Default bet limit
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
   
    setLoading(true)
    const token = localStorage.getItem("adminToken")
    if (!token) {
      showSnackbar("Authentication token not found. Please log in again.", "error")
      setLoading(false)
      return
    }

    try {
      const res = await axios.get("https://game-website-yyuo.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const nonAdminUsers = res.data.users.filter(user => user.isAdmin !== true);

      setUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Failed to fetch users. Please try again.", "error");
      setLoading(false);
    }
  }

const handleDetails = async (user) => {
  
    setShowDialog(true)
    setLoading(true)

    const token = localStorage.getItem("adminToken")
    if (!token) {
      showSnackbar("Authentication token not found. Please log in again.", "error")
      return
    }

    try {
      
      const res = await axios.get(
        `https://game-website-yyuo.onrender.com/api/admin/games?userId=${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setGames(res.data.games)
      
    } catch (err) {
      console.error("Error fetching games:", err)
      showSnackbar("Failed to fetch games. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchTerm(query)

    if (!query) {
      setFilteredUsers(users)
      return
    }

    setFilteredUsers(
      users.filter((user) => {
        if (searchType === "email") {
          return user.email.toLowerCase().includes(query)
        } else if (searchType === "mobileNo") {
          return (user.mobileNo || "").toLowerCase().includes(query)
        } else if (searchType === "username") {
          return user.username.toLowerCase().includes(query)
        } else {
          // Search in all fields
          return (
            user.email.toLowerCase().includes(query) ||
            (user.mobileNo || "").toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
          )
        }
      }),
    )
  }

  
  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      userId: user._id,
      username: user.username,
      email: user.email,
      mobileNo: user.mobileNo || "",
      balance: user.balance || 0,
      password: "",
      confirmPassword: "",
      betLimit: user.betLimit , // Default bet limit
    })
    setAddBalance("")
    setRemoveBalance("")
    setActiveTab(0)
    setPasswordError("")
    setShow(true)
  }




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    // Clear password error when user types in password fields
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("")
    }
  }

  const handleBalanceChange = (e) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) setAddBalance(value)
  }

  const handleRemoveBalanceChange = (e) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) setRemoveBalance(value)
  }
const handleBetLimitChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, betLimit: value })
  } 

  const validatePassword = () => {
    // If both password fields are empty, assume no password change
    if (!formData.password && !formData.confirmPassword) {
      return true
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }

    // Check password strength (at least 6 characters)
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return false
    }

    return true
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      showSnackbar("Token missing. Log in again.", "error")
      return
    }

    // Validate password if it's being changed
    if (!validatePassword()) {
      setActiveTab(1) // Switch to password tab if there's an error
      return
    }

    const additional = Number.parseFloat(addBalance) || 0
    const deduction = Number.parseFloat(removeBalance) || 0
    const updatedBalance = (Number.parseFloat(formData.balance) || 0) + additional - deduction

    if (updatedBalance < 0) {
      showSnackbar("Balance can't be negative!", "error")
      return
    }

    // Prepare data for update
    const updateData = {
      ...formData,
      balance: updatedBalance,
    }

    // Only include password if it's being changed
    if (!formData.password) {
      delete updateData.password
      delete updateData.confirmPassword
    } else {
      // Remove confirmPassword as it's not needed for the API
      delete updateData.confirmPassword
    }

    try {
      await axios.put(`https://game-website-yyuo.onrender.com/api/admin/users/${selectedUser._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      fetchUsers()
      setShow(false)
      showSnackbar("User updated successfully!")
    } catch (error) {
      console.error("Update error:", error)
      showSnackbar("Failed to update user.", "error")
    }
  }

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      showSnackbar("Token missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      await axios.delete(`https://game-website-yyuo.onrender.com/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
      showSnackbar("User deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      showSnackbar("Failed to delete user.", "error")
    }
  }

  const toggleBlock = async (userId, isBlocked) => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      showSnackbar("Token missing.", "error")
      return
    }

    try {
      await axios.put(
       `https://game-website-yyuo.onrender.com/api/admin/users/${userId}/block`,
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token} `} },
      )
      fetchUsers()
      showSnackbar(`User ${isBlocked ? "unblocked" : "blocked"} successfully!`)
    } catch (error) {
      console.error("Block/unblock error:", error)
      showSnackbar("Failed to update block status.", "error")
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const userCount = filteredUsers.length
  const totalBalance = filteredUsers.reduce((acc, user) => acc + (user.balance || 0), 0)
  const creditBalance = filteredUsers.reduce((acc, user) => {
  const creditSum = user.transactions.reduce((sum, txn) => {
    return txn.type === "credit" ? sum + txn.amount : sum;
  }, 0);
  return acc + creditSum;
}, 0);

const debitBalance = filteredUsers.reduce((acc, user) => {
  const debitSum = user.transactions.reduce((sum, txn) => {
    return txn.type === "debit" ? sum + txn.amount : sum;
  }, 0);
  return acc + debitSum;
}, 0);
const totalProfit = creditBalance - debitBalance;

  const getSearchIcon = () => {
    switch (searchType) {
      case "email":
        return <EmailIcon />
      case "mobileNo":
        return <PhoneNoIcon />
      case "username":
        return <PersonIcon />
      default:
        return <SearchIcon />
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <style>{styles}</style>
      <Card elevation={3} className="mb-6 overflow-hidden justify-center items-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 md:p-6">
          <Typography variant="h4" className="text-white font-bold justify-center items-center">
            Admin Dashboard
          </Typography>
        
        </div>
      </Card>

      {/* Stats Cards */}
    

      {/* Search and Filters */}
      <Card elevation={2} className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row gap-3">
              <TextField
                label="Search Users"
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                className="w-full"
                placeholder={`Search by ${searchType === "all" ? "email, mobileNo or username" : searchType}...`}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{getSearchIcon()}</InputAdornment>,
                }}
              />

              <FormControl variant="outlined" className="min-w-[150px]">
                <InputLabel id="search-type-label">Search In</InputLabel>
                <Select
                  labelId="search-type-label"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Search In"
                >
                  <MenuItem value="all">All Fields</MenuItem>
                  <MenuItem value="email">Email Only</MenuItem>
                  <MenuItem value="mobileNo">mobileNo Only</MenuItem>
                  <MenuItem value="username">Username Only</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Typography variant="body2" className="text-gray-500 mr-2 flex items-center">
                <FilterIcon fontSize="small" className="mr-1" /> Quick Filters:
              </Typography>
              <Chip
                label="All Users"
                color={searchTerm === "" ? "primary" : "default"}
                onClick={() => {
                  setSearchTerm("")
                  setFilteredUsers(users)
                }}
                className="cursor-pointer"
              />
              <Chip
                label="Active Users"
                color="success"
                onClick={() => {
                  setFilteredUsers(users.filter((user) => user.isActive))
                }}
                className="cursor-pointer"
              />
              <Chip
                label="Blocked Users"
                color="error"
                onClick={() => {
                  setFilteredUsers(users.filter((user) => user.isBlocked))
                }}
                className="cursor-pointer"
              />
              <Chip
                label="Zero Balance"
                color="warning"
                onClick={() => {
                  setFilteredUsers(users.filter((user) => !user.balance || user.balance === 0))
                }}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-start">
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              className="w-full md:w-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>
  <div className="grid grid-cols-5 md:grid-cols-5 gap-4 mb-6">
        <Card elevation={2} className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <PersonIcon className="text-blue-600" fontSize="large" />
            </div>
            <div>
              <Typography variant="h6" color="textSecondary" className="text-sm">
                Total Users
              </Typography>
              <Typography variant="h4" className="font-bold">
                {userCount}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card elevation={2} className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              {/* <MoneyIcon className="text-green-600" fontSize="large" /> */}
            </div>
            <div>
              <Typography variant="h6" color="textSecondary" className="text-sm">
                Credit Coins
              </Typography>
              <Typography variant="h4" className="font-bold">
                {creditBalance.toLocaleString()}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card elevation={2} className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              {/* <MoneyIcon className="text-green-600" fontSize="large" /> */}
            </div>
            <div>
              <Typography variant="h6" color="textSecondary" className="text-sm">
                Debit Coins
              </Typography>
              <Typography variant="h4" className="font-bold">
                {debitBalance.toLocaleString()}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card elevation={2} className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              {/* <MoneyIcon className="text-green-600" fontSize="large" /> */}
            </div>
            <div>
              <Typography variant="h6" color="textSecondary" className="text-sm">
                Total Coins
              </Typography>
              <Typography variant="h4" className="font-bold">
                {totalBalance.toLocaleString()}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card elevation={2} className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              {/* <MoneyIcon className="text-green-600" fontSize="" /> */}
            </div>
            <div>
              <Typography variant="h6" color="textSecondary" className="text-sm">
                Total Profit
              </Typography>
              <Typography variant="h4" className="font-bold">
                {totalProfit.toLocaleString()}
              </Typography>
            </div>
          </CardContent>
        </Card>
       
      </div>
      {/* Users Table */}
      <Card elevation={3}>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <CircularProgress />
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table className="min-w-full">
                <TableHead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <TableRow>
                    <TableCell className="text-white font-medium">Username</TableCell>
                    <TableCell className="text-white font-medium">Email</TableCell>
                    <TableCell className="text-white font-medium">MobileNo</TableCell>
                    <TableCell className="text-white font-medium">Balance</TableCell>
                    <TableCell className="text-white font-medium">Status</TableCell>
                    <TableCell className="text-white font-medium">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id} hover className="transition-colors duration-150">
                        <TableCell>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">ID: {user._id}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.mobileNo ? (
                            <div className="flex items-center">
                              <PhoneNoIcon fontSize="small" className="text-gray-400 mr-1" />
                              {user.mobileNo}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            // icon={<MoneyIcon className="text-amber-500" />}
                            label={`${user.balance || 0} COINS`}
                            className="bg-amber-50"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {user.isActive ? (
                              <Chip size="small" label="Active" className="bg-green-100 text-green-800" />
                            ) : (
                              <Chip size="small" label="Inactive" className="bg-gray-100 text-gray-800" />
                            )}
                            {user.isBlocked && (
                              <Chip size="small" label="Blocked" className="bg-red-100 text-red-800" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Tooltip title="Edit User">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(user)}
                                size="small"
                                className="bg-blue-50 hover:bg-blue-100"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={user.isBlocked ? "Unblock User" : "Block User"}>
                              <IconButton
                                color={user.isBlocked ? "success" : "warning"}
                                onClick={() => toggleBlock(user._id, user.isBlocked)}
                                size="small"
                                className={
                                  user.isBlocked ? "bg-green-50 hover:bg-green-100" : "bg-amber-50 hover:bg-amber-100"
                                }
                              >
                                {user.isBlocked ? <UnblockIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete User">
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(user._id)}
                                size="small"
                                className="bg-red-50 hover:bg-red-100"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                           <Tooltip title="User details">
                              <IconButton
                                color="error"
                                onClick={() => handleDetails(user)}
                                size="small"
                                className="bg-red-50 hover:bg-red-100"
                              >
                               <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Typography variant="body1" color="textSecondary">
                          No users found
                        </Typography>
                        {searchTerm && (
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => {
                              setSearchTerm("")
                              setFilteredUsers(users)
                            }}
                            className="mt-2"
                          >
                            Clear Search
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Edit Dialog with Tabs */}
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 8,
          className: "rounded-lg overflow-hidden",
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 flex justify-between">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <EditIcon className="text-blue-600" />
            </div>
            <Typography variant="h6" className="font-bold">
              Edit User Profile
            </Typography>
         

          </div>
             <IconButton
          aria-label="close"
          onClick={() => setShow(false)}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
         

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
            <Tab icon={<LockIcon />} label="Password" iconPosition="start" />
            <Tab icon={""} label="Balance" iconPosition="start" />
          </Tabs>
        </Box>

        <DialogContent className="pt-6 px-6">
          {/* Profile Tab */}
          {activeTab === 0 && (
  <div className="space-y-5 animate-fadeIn">
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <Typography variant="subtitle2" className="text-blue-700 mb-2 font-medium flex items-center">
        <PersonIcon fontSize="small" className="mr-1" />
        User Information
      </Typography>

      <TextField
        fullWidth
        label="User  ID"
        value={formData.userId}
        disabled
        variant="outlined"
        size="small"
        className="mb-5 bg-white/80"
        InputProps={{
          className: "text-gray-500 text-sm",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          size="small"
          InputProps={{
            className: "bg-white",
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          helperText="                       "
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          size="small"
          InputProps={{
            className: "bg-white",
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          helperText="User 's email address for notifications and login"
        />

        <TextField
          fullWidth
          label="Mobile Number"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          variant="outlined"
          size="small"
          InputProps={{
            className: "bg-white",
            startAdornment: (
              <InputAdornment position="start">
                <PhoneNoIcon fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          helperText="User 's contact mobile number"
        />
      </div>
    </div>
  </div>
)}

          {/* Password Tab */}
          {activeTab === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <Typography variant="subtitle2" className="text-purple-700 mb-2 font-medium flex items-center">
                  <KeyIcon fontSize="small" className="mr-1" />
                  Password Management
                </Typography>

                <Alert severity="info" className="mb-4">
                  Leave the fields empty if you don't want to change the password.
                </Alert>

                {passwordError && (
                  <Alert severity="error" className="mb-4 pulse-animation">
                    {passwordError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  className="mb-3"
                  InputProps={{
                    className: "bg-white",
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Enter a new password (minimum 6 characters)"
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    className: "bg-white",
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Confirm the new password"
                />

                {selectedUser && selectedUser.password && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                    <Typography variant="subtitle2" className="text-purple-700 mb-1 font-medium">
                      Current Password Hash
                    </Typography>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
                      {selectedUser.password}
                    </div>
                    <Typography variant="caption" className="text-gray-500 mt-1 block">
                      This is the encrypted password hash stored in the database
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Balance Tab */}
          {activeTab === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <Typography variant="subtitle2" className="text-amber-700 mb-2 font-medium flex items-center">
                  
                  Balance Management
                </Typography>

                <div className="flex items-center justify-center bg-white rounded-lg p-3 mb-4 border border-amber-200">
                  <div className="text-center">
                    <Typography variant="caption" className="text-gray-500 block">
                      Current Balance 
                    </Typography>
                    <Typography variant="h4" className="font-bold text-amber-600">
                      {formData.balance} <span className="text-sm font-normal">COINS</span>
                    </Typography>
                    
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="transition-all duration-200 hover:scale-[1.02]">
                    <TextField
                      fullWidth
                      label="Add Balance"
                      value={addBalance}
                      onChange={handleBalanceChange}
                      variant="outlined"
                      size="small"
                      className="bg-green-50 rounded-lg shadow-sm"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <div className="bg-green-100 text-green-700 w-6 h-6 flex items-center justify-center rounded-full font-bold">
                              +
                            </div>
                          </InputAdornment>
                        ),
                        className: "border-green-200 bg-white",
                      }}
                      helperText="Amount to add to user's balance"
                    />
                  </div>
                     <div className="transition-all duration-200 hover:scale-[1.02]">
                    <TextField
                      fullWidth
                      label="Bet Limit"
                      value={formData.betLimit}
                      onChange={handleBetLimitChange}
                      variant="outlined"
                      size="small"
                      className="bg-green-50 rounded-lg shadow-sm"
                     
                    
                    />
                  </div>

                  <div className="transition-all duration-200 hover:scale-[1.02]">
                    <TextField
                      fullWidth
                      label="Remove Balance"
                      value={removeBalance}
                      onChange={handleRemoveBalanceChange}
                      variant="outlined"
                      size="small"
                      className="bg-red-50 rounded-lg shadow-sm"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <div className="bg-red-100 text-red-700 w-6 h-6 flex items-center justify-center rounded-full font-bold">
                              -
                            </div>
                          </InputAdornment>
                        ),
                        className: "border-red-200 bg-white",
                      }}
                      helperText="Amount to deduct from user's balance"
                    />
                  </div>
                </div>

                {addBalance || removeBalance ? (
                  <div className="mt-4 animate-fadeIn">
                    <Alert
                      severity={
                        Number.parseFloat(formData.balance) +
                          (Number.parseFloat(addBalance) || 0) -
                          (Number.parseFloat(removeBalance) || 0) <
                        0
                          ? "error"
                          : "info"
                      }
                      className="mt-2"
                      icon={<MoneyIcon />}
                    >
                      <Typography variant="body2">
                        New balance will be:{" "}
                        <span className="font-bold">
                          {(
                            Number.parseFloat(formData.balance) +
                            (Number.parseFloat(addBalance) || 0) -
                            (Number.parseFloat(removeBalance) || 0)
                          ).toFixed(2)}{" "}
                          COINS
                        </span>
                        {Number.parseFloat(formData.balance) +
                          (Number.parseFloat(addBalance) || 0) -
                          (Number.parseFloat(removeBalance) || 0) <
                          0 && (
                          <span className="block text-red-600 text-xs mt-1">Warning: Balance cannot be negative!</span>
                        )}
                      </Typography>
                    </Alert>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            onClick={() => setShow(false)}
            color="inherit"
            variant="outlined"
            className="w-full sm:w-auto order-2 sm:order-1"
            size="large"
          >
            Cancel
          </Button>
          <div className="flex-grow"></div>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="large"
            disabled={
              Number.parseFloat(formData.balance) +
                (Number.parseFloat(addBalance) || 0) -
                (Number.parseFloat(removeBalance) || 0) <
                0 ||
              (formData.password !== formData.confirmPassword && (formData.password || formData.confirmPassword))
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>


      {/* User Details Dialog */}
  <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 8,
        className: "rounded-lg overflow-hidden",
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <InfoIcon className="text-blue-600" />
          </div>
          <Typography variant="h6" className="font-bold">
            User Game Details
          </Typography>
        </div>
        <IconButton
          aria-label="close"
          onClick={() => setShowDialog(false)}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <CircularProgress />
          </div>
        ) : games.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No games found for this user.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "Game ID",
                    "Bet Amount",
                    "Bet Side",
                    "Joker Card",
                    "Winning Side",
                    "Result",
                    "Win Amount",
                    "Created At",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...games]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
  .map((game) => (
                  <tr
                    key={game._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm break-words max-w-xs">{game._id}</td>
                    <td className="px-4 py-2 text-sm">{game.betAmount}</td>
                    <td className="px-4 py-2 text-sm capitalize">{game.betSide}</td>
                    <td className="px-4 py-2 text-sm capitalize">
                      {game.jokerCard.suit} {game.jokerCard.value}
                    </td>
                    <td className="px-4 py-2 text-sm capitalize">{game.winningSide}</td>
                    <td className="px-4 py-2 text-sm capitalize">{game.result}</td>
                    <td className="px-4 py-2 text-sm">{game.winAmount}</td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">
                      {new Date(game.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>


      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}


export default Users