const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();
const UserRoute = require("./routes/User.route");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/andarBhar", {
  useNewUrlParser: true,
 
});
const db = mongoose.connection;
app.use(express.json());
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/auth",UserRoute );

