import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDb = (uri) => {
  mongoose
    .connect(uri, {
      dbName: "ChatApp",
    })
    .then((data) => {
      console.log(`Server is connected to DB :${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("chat-token", token, cookieOption).json({
    success: true,
    message,
  });
};

const emitEvent =(req,event,users,data) =>{
  console.log("Emmitting event",event)

}

export { connectDb, sendToken,cookieOption ,emitEvent};
