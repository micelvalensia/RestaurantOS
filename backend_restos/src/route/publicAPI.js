import express from "express";
import userController from "../controller/user-controller.js";
import { verifyAuthToken } from "../middleware/auth.js";
const publicRouter = new express.Router();

publicRouter.post("/authenticate", verifyAuthToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
publicRouter.post("/register", userController.register);
publicRouter.post("/login", userController.login);

export { publicRouter };
