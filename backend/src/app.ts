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

import { setupSwagger } from '../src/domain/docs/swagger';

setupSwagger(app);


//Routes
import authRouter from "../src/domain/auth/auth.route"
import studyRouter from "../src/domain/studyplan/study.route"
import materialRouter from "../src/domain/materials/materials.route"
import pqHubRouter from "../src/domain/pqhub/pq.route"
import schoolRouter from "../src/domain/schools/school.route"
import notificationRouter from "./domain/notification/notification.routes";
import subscriptionRouter from "./domain/subscription/subscription.routes";
import paymentRouter from "./domain/payment/payment.route";





app.use("/api/v1/auth", authRouter)
app.use("/api/v1/studyPlan", studyRouter)
app.use("/api/v1/material", materialRouter)
app.use("/api/v1/pqhub", pqHubRouter)
app.use("/api/v1/schools", schoolRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/notification", notificationRouter)
app.use("/api/v1/subscription", subscriptionRouter)

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "OK", app: "Somavault API" });
});

export default app;
