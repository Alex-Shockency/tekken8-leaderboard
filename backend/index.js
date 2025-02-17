require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");
const mongoString = process.env.DATABASE_URL;
const cors = require("cors");

const options = [
  cors({
    origin: ["http://localhost:4200", "https://tekkenleaderboard.com"],
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
];

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Mongo Database Connected");
});

const app = express();
app.use(options);

app.use("/api", routes);

app.use(express.json());

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
