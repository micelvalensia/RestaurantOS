import express from "express";
import { publicRouter } from "../route/publicAPI.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const web = express();
web.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

web.use(express.json());
web.use(cookieParser());
web.use(express.urlencoded({ extended: true }));
web.use(publicRouter);
web.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

export { web };
