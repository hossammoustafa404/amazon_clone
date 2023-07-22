const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  const dbConnection = config.db.urL.replace("<password>", config.db.password);

  const con = await mongoose.connect(dbConnection);

  console.log(`MongoDB connected: ${con.connection.host}`);

  mongoose.connection.on("connecting", () => {
    console.log(`Mongoose Connecting to database...`);
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose Connected to database`);
  });
};

module.exports = connectDB;
