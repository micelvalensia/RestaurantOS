import AppError from "../middleware/errorHandler.js";

export const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw new AppError(result.error.message, 400);
  } else {
    return result.value;
  }
};
