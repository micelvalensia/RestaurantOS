import Joi from "joi";

export const userRegisterValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
  roleId: Joi.number().integer().required(),
});

export const userLoginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(10).required(),
});
