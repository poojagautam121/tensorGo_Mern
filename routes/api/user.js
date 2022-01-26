const express = require("express");
const router = express.Router();
const UserTensor = require("../../models/UserTensor");
var axios = require("axios");
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("user_data.csv");

router.get("/", async (req, res) => {
  console.log("api called ==");
  var options = {
    method: "GET",
    url: "https://gorest.co.in/public-api/users",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const response = await axios(options);
    const records = response.data.data;
    await UserTensor.insertMany(records);
    res.send(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const modifiedUser = await UserTensor.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      returnOriginal: false,
    });
    res.send({
      data: modifiedUser,
      status: "200",
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("server Error");
  }
});

router.get("/csv", async (req, res) => {
  try {
    const response = await UserTensor.find();
    console.log(response);
    fastcsv
      .write(response, { headers: true })
      .on("finish", function () {
        console.log("Write to user_data.csv successfully!");
      })
      .pipe(ws);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("server Error");
  }
});
module.exports = router;
