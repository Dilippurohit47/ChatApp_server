import { User } from "../models/user.model.js";

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

  await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  res.status(201).json({ message: "User created successfully" });
};
const login = (req, res) => {};

export { newUser, login };
