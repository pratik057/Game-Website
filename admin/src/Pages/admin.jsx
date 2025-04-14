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
    const token = localStorage.getItem("adminToken"); // Retrieve token
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }  // Attach token
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    setFilteredUsers(users.filter((user) => user.email.toLowerCase().includes(query)));
  };

  // Handle edit button click
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

  // Handle input changes
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

  // Handle save button click
  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    const additionalBalance = parseFloat(addBalance) || 0;
    const deductionBalance = parseFloat(removeBalance) || 0;
    let updatedBalance = (parseFloat(formData.balance) || 0) + additionalBalance - deductionBalance;

    if (updatedBalance < 0) {
      alert("Balance cannot be negative!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        { ...formData, balance: updatedBalance },
        { headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        } } // Attach token
      );

      fetchUsers();
      setShow(false);
      setAddBalance("");
      setRemoveBalance("");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Users List</h2>

      {/* Search Field */}
      <div className="flex justify-center mb-6">
        <TextField
          fullWidth
          label="Search by Email"
          variant="outlined"
          value={searchEmail}
          onChange={handleSearch}
          className="shadow-lg rounded-lg bg-white"
          sx={{ width: "50%" }}
        />
      </div>

      {/* Users Table */}
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead className="bg-blue-500">
            <TableRow>
              <TableCell className="text-white font-bold">User ID</TableCell>
              <TableCell className="text-white font-bold">Username</TableCell>
              <TableCell className="text-white font-bold">Email</TableCell>
              <TableCell className="text-white font-bold">Balance</TableCell>
              <TableCell className="text-white font-bold text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-100 transition">
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>COINS : {user.balance}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(user)}
                      className="hover:bg-blue-700 transition"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle className="text-center text-blue-600 font-bold">Edit User</DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField fullWidth label="User ID" value={formData.userId} disabled variant="outlined" />
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} variant="outlined" />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} variant="outlined" />
          <TextField fullWidth label="Current Balance" value={`COINS: ${formData.balance}`} disabled variant="outlined" />
          <TextField fullWidth label="Add Balance" value={addBalance} onChange={handleBalanceChange} variant="outlined" />
          <TextField fullWidth label="Remove Balance" value={removeBalance} onChange={handleRemoveBalanceChange} variant="outlined" />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setShow(false)} color="secondary">Close</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;