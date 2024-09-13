import express from "express";
import {  requireSignIn} from "../Middlewares/authMiddleware.js";
import {  saveUserScoreController, getUserScoreController, getLeaderboardController } from "../Controllers/scoreController.js";

const router = express.Router();

router.post("/savescore", requireSignIn, saveUserScoreController);
router.get("/getuserscore/:id",requireSignIn,getUserScoreController);
router.get("/getleaderboard",requireSignIn,getLeaderboardController);

export default router;


