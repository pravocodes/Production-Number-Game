import userModel from "../Models/userModel.js";

import { hashPassword, comparePassword } from "../Helpers/authHelper.js";
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
  try {
    const { name, email, password,  username } = req.body;
    if (!username) {
      return res.send({
        message: "Enter Username",
      });
    }
    if (!name || !password) {
      return res.send({
        message: "Enter username or password",
      });
    }
   
    if (!email) {
      return res.send({
        message: "Enter email",
      });
    }

    const hashpass = await hashPassword(password);
    // console.log(hashpass);
    const existinguser = await userModel.findOne({ email });

    if (existinguser) {
      return res.status(300).send({
        success: false,
        message: "User already Registered",
      });
    }

    const existingusername = await userModel.findOne({ username });

    if (existingusername) {
      return res.status(300).send({
        success: false,
        message: "Username is already taken",
      });
    }

    const user = await new userModel({
      name,
      email,
      password: hashpass,
   
      username,
    }).save();

    res.status(200).send({
      success: true,
      message: "Registerd successfully",
      user,
    });
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};



