require("dotenv").config();

// const express = require("express");
// const mongoose = require('mongoose');
// const cors = require("cors");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const routes = require("./routes/routes.ts");
const mongoString = process.env.DATABASE_URL;
const options = [
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
];

if (!mongoString) {
  throw new Error(
    "Expected mongoString to exist, cannot form DB connection..."
  );
}

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
