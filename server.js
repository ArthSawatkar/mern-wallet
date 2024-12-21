const mongoose = require("mongoose");

const dbURI = "mongodb+srv://mern_user:securePassword123@mern-wallet-cluster.4fiix.mongodb.net/mern-wallet?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
