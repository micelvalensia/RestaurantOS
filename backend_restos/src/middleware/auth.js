import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";

export const generateAuthToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    roleId: user.roleId,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const verifyAuthToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("ERROR VERIFY:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    console.log(error);
    throw new Error("Internal server error");
  }
};
