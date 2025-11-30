import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await userService.loginUser(req.body);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
};
