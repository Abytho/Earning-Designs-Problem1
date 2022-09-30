const express = require("express");
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config();

const userRouter = require("./router/user.router.js")

const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(
    process.env.DB_URI,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log("Database connected")
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use("/", userRouter);

app.listen(process.env.PORT,
    () => console.log(`Server up and running on port ${process.env.PORT}`))