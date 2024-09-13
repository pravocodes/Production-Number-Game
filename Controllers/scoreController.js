// controllers/scoreController.js
import scoreModel from "../Models/scoreModel.js";
import userModel from "../Models/userModel.js";

// Save user score
export const saveUserScoreController = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes you have user info from the `requireSignin` middleware
    const { score } = req.body;

    // Create a new score entry
    const newScore = await new scoreModel({
      user: userId,
      score,
    }).save();

    // Check if the new score is higher than the user's current high score
    const user = await userModel.findById(userId);
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }

    res.status(201).send({
      success: true,
      message: "Score saved successfully",
      score: newScore,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error saving user score",
      error,
    });
  }
};

// Fetch user profile and scores

// controllers/userController.js

// Fetch user profile and scores by user ID from request parameters

// Fetch user profile and scores by user ID from request parameters
export const getUserScoreController = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from request parameters
    console.log('User ID from params:', userId);

    // Fetch user data using the provided userId
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Fetch all scores for the user using the `scoreModel` and select only the `score` field
    const scores = await scoreModel.find({ user: userId }).select("score"); // Select only the score

    // Extract the score values into a simple array
    const scoreValues = scores.map((score) => score.score);

    // Send user data and scores
    res.status(200).send({
      success: true,
      message: "User profile and scores fetched successfully",
      user, // User details
      scores: scoreValues, // Array of score values
    });
  } catch (error) {
    console.error('Error fetching user profile and scores:', error);
    res.status(500).send({
      success: false,
      message: "Error fetching user profile and scores",
      error: error.message,
    });
  }
};


export const getLeaderboardController = async (req, res) => {
  try {
    // Aggregate scores to get the highest score for each user
    const leaderboard = await scoreModel.aggregate([
      {
        $group: {
          _id: "$user", // Group by user ID
          highestScore: { $max: "$score" }, // Get the maximum score for each user
        },
      },
      {
        $sort: { highestScore: -1 }, // Sort by highest score in descending order
      },
      {
        $limit: 10, // Limit to top 10 users
      },
    ]);

    // Populate user details based on the grouped user IDs
    const populatedLeaderboard = await userModel.populate(leaderboard, {
      path: "_id",
      select: "username", // Select only the username field
    });

    // Format the leaderboard response
    const formattedLeaderboard = populatedLeaderboard.map((entry) => ({
      username: entry._id.username, // Access the populated username
      score: entry.highestScore,
    }));

    res.status(200).send({
      success: true,
      message: "Top scores fetched successfully",
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching leaderboard",
      error,
    });
  }
};
