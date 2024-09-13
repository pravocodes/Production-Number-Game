import JWT from "jsonwebtoken";
import usermodel from "../Models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ success: false, message: "No token provided or invalid format" });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'

    // Verify the token
    const decode = JWT.verify(token, process.env.JWT_SECRETKEY);

    const { _id } = decode;

    // Find user by decoded ID
    const userdata = await usermodel.findById(_id);

    if (!userdata) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    req.user = userdata; // Attach user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).send({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};
