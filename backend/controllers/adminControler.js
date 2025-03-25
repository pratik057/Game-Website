import User from "../models/User.js";
import Game from "../models/game.js";

export const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ success: true, games });
  } catch (error) {
    console.error("Get games error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const users= async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, balance } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.balance = balance || user.balance;
       

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "User updated successfully", 
            user: {
                id: user._id, // Include user ID in the response
                username: user.username,
                email: user.email,
                balance: user.balance,
                
            }
        });
    } catch (error) {
        console.error("Edit user error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};