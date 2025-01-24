import * as dotenv from "dotenv";
dotenv.config();

import express, {Application} from "express";
import atpRouter from "./routers/atpRoutes";

const app: Application = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", atpRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));