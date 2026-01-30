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
import materialRouter from "../src/domain/materials/materials.route"
import pqHubRouter from "../src/domain/pqhub/pq.route"





app.use("/api/v1/auth", authRouter)
app.use("/api/v1/studyPlan", studyRouter)
app.use("/api/v1/materials", materialRouter)
app.use("/api/v1/pqhub", pqHubRouter)

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "OK", app: "Somavault API" });
});

export default app;
