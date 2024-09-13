import express from "express";
import { registerController,loginController } from "../Controllers/authController.js";
import { requireSignIn } from "../Middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/userauth",requireSignIn,(req,res)=>{
res.status(200).send({ok:true})
})

export default router;


