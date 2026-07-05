import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://:localhost:6379');

const PORT = 8080;
const BANNRER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
    await redis.set(BANNRER_KEY, req.body.message || "Welcome to our website!");

    res.send({
        success: true
    })
})

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNRER_KEY);

    res.json({ message });
})

app.delete("/banner", async (req, res) => {
    await redis.del(BANNRER_KEY);

    res.json({
        success: true
    })
})

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNRER_KEY);

    res.json({
        exists: !!exists // !!exists converts the output into boolean
    })
})

// app.get("/banner/exists", async (req, res) => {
//     const exists = await redis.exists(BANNER_KEY);
//     // res.json({ exists: exists === 1 });

//     res.json({ exists: Boolean(exists) });
// });

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNRER_KEY);

    res.json({
        exists: exists
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})