import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addBalance, setAddBalance] = useState("");
  const [removeBalance, setRemoveBalance] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    balance: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await axios.get("https://game-website-yyuo.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      )
    );
  };
  

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      userId: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    });
    setAddBalance("");
    setRemoveBalance("");
    setShow(true);
  };

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBalanceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setAddBalance(value);
  };

  const handleRemoveBalanceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setRemoveBalance(value);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Token missing. Log in again.");

    const additional = parseFloat(addBalance) || 0;
    const deduction = parseFloat(removeBalance) || 0;
    let updatedBalance = (parseFloat(formData.balance) || 0) + additional - deduction;

    if (updatedBalance < 0) return alert("Balance can't be negative!");

    try {
      await axios.put(
        `https://game-website-yyuo.onrender.com/api/admin/users/${selectedUser._id}`,
        { ...formData, balance: updatedBalance },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
      setShow(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Token missing.");

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `https://game-website-yyuo.onrender.com/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user.");
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Token missing.");

    try {
      await axios.put(
        `https://game-website-yyuo.onrender.com/api/admin/users/${userId}/block`,
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Block/unblock error:", error);
      alert("Failed to update block status.");
    }
  };

  const userCount = filteredUsers.length;
  const totalBalance = filteredUsers.reduce((acc, user) => acc + (user.balance || 0), 0);
  const ActiveUser = filteredUsers.filter(user => user.isActive).length;
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Users List</h2>

      {/* Search and Stats */}
      <div className="flex justify-between items-center mb-4">
        <TextField
          label="Search by Email or Username"
          value={searchEmail}
          onChange={handleSearch}
          variant="outlined"
          sx={{ width: "40%" }}
        />
        <div className="space-x-6 text-gray-700 font-medium">
          <span>👤 Total Users: {userCount}</span>
          <span>💰 Total Coins: {totalBalance}</span>
          <span>🟢 Active Users: {ActiveUser}</span>
        </div>
      </div>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-blue-600">
            <TableRow>
              <TableCell className="text-white">User ID</TableCell>
              <TableCell className="text-white">Username</TableCell>
              <TableCell className="text-white">Email</TableCell>
              <TableCell className="text-white">Balance</TableCell>
              <TableCell className="text-white text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>COINS: {user.balance}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      color={user.isBlocked ? "success" : "warning"}
                      onClick={() => toggleBlock(user._id, user.isBlocked)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent className="space-y-4 mt-2">
          <TextField fullWidth label="User ID" value={formData.userId} disabled />
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
          <TextField fullWidth label="Current Balance" value={`COINS: ${formData.balance}`} disabled />
          <TextField fullWidth label="Add Balance" value={addBalance} onChange={handleBalanceChange} />
          <TextField fullWidth label="Remove Balance" value={removeBalance} onChange={handleRemoveBalanceChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)} color="secondary">Close</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;  