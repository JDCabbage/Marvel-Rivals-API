import axios from "axios";

export default async function handler(req, res) {
  const { username, platform } = req.query;
  const API_KEY = process.env.API_KEY;

  if (!username || !platform) {
    return res.status(400).send("Missing username or platform");
  }

  try {
    const response = await axios.get(
      `https://marvelrivalsapi.com/api/v1/player/${encodeURIComponent(username)}`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );

    console.log("📦 Full API Response:", response.data);

    const latestRank = response.data.rank_history?.[0];
    console.log("🎯 latestRank:", latestRank);

    if (!latestRank) {
      return res.send(`${username} has no recorded rank yet.`);
    }

    const message = `${username} is ${latestRank.rank} with ${latestRank.points} points.`;

    return platform === "nightbot" || platform === "streamelements"
      ? res.send(message)
      : res.json({ message });

  } catch (err) {
    console.error("🔥 API error:", err?.response?.data || err.message);
    return res.status(500).send("Failed to fetch player rank.");
  }
}
