require("dotenv").config();

const express = require("express");

const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

const URL =process.env.MONGO_URL;
const PORT =process.env.PORT;

const mongoose = require("mongoose");

const cors = require("cors");


const app = express();



mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);