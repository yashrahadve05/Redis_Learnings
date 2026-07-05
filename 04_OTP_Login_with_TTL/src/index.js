import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const PORT = 8080;
const BANNER_KEY = "app:banner"

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379' );

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    await redis.set(otpKey(phone), otp, 'EX', 30); // Set OTP with 30 second expiration
    res.json({ otp });

    res.json({
        message: "OTP Sent",
        otp // In production application, OTP is send via SMS or e-mail
    })
})

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;

    const saveOTP = await redis.get(otpKey(phone));

    if (!saveOTP) {
        return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (saveOTP !== otp) {
        return res.json({ success: false, message: "Invalid OTP" });
    }

    await redis.del(otpKey(phone)); // OTP is valid, delete it from Redis

    res.json({ success: true, message: "OTP verified successfully" });
})


app.get("/otp/:phone/ttl", async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));

    res.json({ ttl });
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});