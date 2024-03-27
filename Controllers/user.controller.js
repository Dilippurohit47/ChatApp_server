import { compare } from "bcrypt";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/features.js";

// creating a new user
const newUser = async (req, res) => {
  const { name, username, bio, password } = req.body;
  const avatar = {
    public_id: "sdfd",
    url: "asds",
  };
  if(!name || !username || !bio || !password){ 
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  console.log("lol")

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });
console.log(user)
  sendToken(res,user,201, "User created successfully")

};  
const login = async (req, res) => {
  const {username , password} = req.body;
  const user = await User.findOne({username}).select("+password");


  if(!user){
    return res.status(400).json({
      message:"Invalid username"
    })
  }

  const isMatch =  await  compare(password, user.password);

  if(!isMatch) {
    return res.status(400).json({
      message:"Invalid password"
    })
  }

  sendToken(res ,user,200,`welcome back ,${user.name}`);

};

export { newUser, login };
