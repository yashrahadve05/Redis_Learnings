import dotenv from "dotenv";
import express from "express";
import Redis from "ioredis";

dotenv.config();
const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");



app.post("/post/:id/views", async (req, res) => {
    const { id } = req.params;
    try {
        const views = await redis.incr(`post:${id}:views`);
        res.status(200).json({
            message: "View count incremented",
            postId: id,
            views: views
        });
    } catch (error) {
        console.error("Error incrementing view count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/leaderboard/score", async (req, res) => {
    const { userId, points } = req.body;

    if (!userId || typeof points !== "number") {
        return res.status(400).json({
            message: "Invalid payload"
        });
    }

    try {
        await redis.zincrby("leaderboard", points, userId);
        res.status(200).json({
            message: "Score updated",
            userId: userId,
            score: points
        });
    } catch (error) {
        console.error("Error updating score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
    const { userId } = req.params;
    try {
        const rank = await redis.zrevrank("leaderboard", userId);

        if (rank === null) {
            return res.status(404).json({
                message: "User not found in leaderboard"
            });
        }

        res.status(200).json({
            userId: userId,
            rank: rank
        });
    } catch (error) {
        console.error("Error fetching user rank:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/leaderboard", async (req, res) => {
    try {
        const users = await redis.zrevrange("leaderboard", 0, 9, "WITHSCORES");
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});