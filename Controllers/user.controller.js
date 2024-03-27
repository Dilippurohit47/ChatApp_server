import { compare } from "bcrypt";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { Errorhandler } from "../utils/utility.js";

// creating a new user
const newUser = TryCatch(async (req, res,next) =>  {
  const { name, username, bio, password } = req.body;
  const avatar = {
    public_id: "sdfd",
    url: "asds",
  };
  if (!name || !username || !bio || !password) return next(new Errorhandler("Please Enter all fields", 400));

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });
  sendToken(res, user, 201, "User created successfully");
}) 
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new Errorhandler("Invalid Username or password", 400));

  const isMatch = await compare(password, user.password);

  if (!isMatch)   return next(new Errorhandler("Invalid Username or password", 400));

  sendToken(res, user, 200, `welcome back ,${user.name}`);
});

const getMyProfile = async (req, res) => {

  res.send("heelo")

};

export { newUser, login, getMyProfile };
