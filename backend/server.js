const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const UserRoute = require("./routes/User.route");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/andarBhar", {
  useNewUrlParser: true,
 
});
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))
const db = mongoose.connection;
app.use(express.json());
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/auth",UserRoute );

