import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const PORT = 8080;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY = 'queue:emails';

app.post('/send-email', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || "No subject",
        body: req.body.body || "No body",
        createdAt: new Date().toISOString()
    };

    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.status(200).json({ message: 'Email job added to the queue', job });
});

app.get('/emails/process-one', async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if (!rawJob) {
        return res.status(200).json({ message: 'No email jobs in the queue' });
    }

    const job = JSON.parse(rawJob);
    // Simuate email send

    res.json({ message: "Email sent", job: job})
})

app.listen(PORT, () => {
    console.log(`Email queue server is running on port ${PORT}`);
});