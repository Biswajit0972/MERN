import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/router.js";
const app = express();

const corsOptions = {
  origin: process.env.DEV == "P"? "http://localhost:5173" : "https://mern-red.vercel.app",
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(router)

app.get("/", (_, res) => {
  res.status(200).send("welcome to the backend-service");
});


export { app };