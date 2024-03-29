import JWT from "jsonwebtoken";
import { Errorhandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["chat-token"];
  if (!token)
    return next(new Errorhandler("Please login to access this route", 401));

  const decodedData = JWT.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});

export { isAuthenticated };
