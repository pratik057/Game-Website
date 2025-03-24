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
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    balance: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://game-website-yyuo.onrender.com/api/admin/users");
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
      console.log(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      userId: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    });
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://game-website-yyuo.onrender.com/api/admin/users/${selectedUser._id}`, formData);
      fetchUsers();
      setShow(false);
    } catch (error) {
      console.error("Error updating user:", error);
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
        <DialogTitle className="text-center text-blue-600 font-bold">
          Edit User
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            fullWidth
            label="User ID"
            name="userId"
            value={formData.userId}
            disabled
            variant="outlined"
            sx={{ backgroundColor: "#f3f4f6", borderRadius: "5px" }}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Balance"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setShow(false)} color="secondary" className="hover:bg-gray-300 transition">
            Close
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" className="hover:bg-blue-700 transition">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
