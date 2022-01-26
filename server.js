const express = require("express");
const app = express();
const connectDB = require("./config/db");
var cors = require("cors");

const PORT = process.PORT || 5001;

connectDB();

//Initiate middleware
app.use(express.json({ extend: false })); // allow us to get data in req.body
app.use(cors());
app.get("/", (req, res) => {
  res.send("API running");
});

// Define Routes
app.use("/api/user", require("./routes/api/user"));

app.listen(PORT, () => {
  console.log(`app running on Port===${PORT}`);
});
