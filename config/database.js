const mongoose = require("mongoose");
const dotenv = require("dotenv");

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected successfully"))
    .catch((err) => console.log(err));
};
module.exports = db;
