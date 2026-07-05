import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
});

const USERS = [
    "Yash",
    "Rohan",
    "Aman",
    "Priya",
    "Ankit",
    "Neha",
    "Rahul",
    "Aditya",
    "Karan",
    "Sakshi",
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateViews() {
    console.log("\n📈 Adding Post Views...\n");

    for (let i = 0; i < 100; i++) {
        try {
            const postId = random(1, 5);

            await api.post(`/post/${postId}/views`);

            process.stdout.write(".");
        } catch (err) {
            console.log("\n❌ View Error:", err.message);
        }

        await sleep(20);
    }

    console.log("\n✅ Views Finished\n");
}

async function simulateLeaderboard() {
    console.log("\n🏆 Updating Scores...\n");

    for (let i = 0; i < 200; i++) {
        try {
            const userId = USERS[random(0, USERS.length - 1)];

            const points = random(1, 20);

            await api.post("/leaderboard/score", {
                userId,
                points,
            });

            process.stdout.write(".");
        } catch (err) {
            console.log("\n❌ Score Error:", err.message);
        }

        await sleep(10);
    }

    console.log("\n✅ Scores Updated\n");
}

async function printLeaderboard() {
    console.log("\n🏅 Top Players\n");

    const { data } = await api.get("/leaderboard");

    const users = data.users;

    console.log("----------------------------");

    for (let i = 0; i < users.length; i += 2) {
        console.log(
            `${String(i / 2 + 1).padStart(2)} | ${users[i].padEnd(10)} | ${users[i + 1]}`
        );
    }

    console.log("----------------------------");
}

async function printRanks() {
    console.log("\n📊 User Ranks\n");

    for (const user of USERS) {
        const { data } = await api.get(`/leaderboard/${user}/rank`);

        console.log(
            `${user.padEnd(10)} Rank : ${
                data.rank !== null ? data.rank + 1 : "Not Found"
            }`
        );
    }
}

async function main() {
    try {
        console.clear();

        console.log("🚀 Redis Leaderboard Simulation\n");

        await simulateViews();

        await simulateLeaderboard();

        await printLeaderboard();

        await printRanks();

        console.log("\n🎉 Simulation Completed");
    } catch (err) {
        console.error(err.message);
    }
}

main();