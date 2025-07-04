import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config()
const app=express();
const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());   

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRouter);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    connectDB();
})