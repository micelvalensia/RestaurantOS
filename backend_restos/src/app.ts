import express from "express";
import type { Application } from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from TypeScript Express!" });
});

export default app;
