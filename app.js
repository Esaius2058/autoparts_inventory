require("dotenv").config();

const express = require("express");
const app = express();
const atpRouter = require("./routers/atpRoutes");


const env = process.env.NODE_ENV;
const connectionString = process.env.connectionString;


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", atpRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));