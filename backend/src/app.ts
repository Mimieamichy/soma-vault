// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))


//Routes
import authRouter from "../src/domain/auth/auth.route"
import studyRouter from "../src/domain/studyplan/study.route"



app.use("/api/v1/auth", authRouter)
app.use("/api/v1/study", studyRouter)



app.get("/health", (_req, res) => {
  res.json({ status: "OK", app: "Somavault API" });
});

export default app;
