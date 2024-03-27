export const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch = (parseFunction) => async (req, res, next) => {
  try {
    await parseFunction(req, res,next);
  } catch (error) {
    next(error);
  }
};
