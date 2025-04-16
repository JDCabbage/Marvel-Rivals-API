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
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    console.log("📦 API response:", JSON.stringify(response.data, null, 2));

    const rankHistory = response.data?.rank_history;
    const latestRank = Array.isArray(rankHistory) && rankHistory.length > 0 ? rankHistory[0] : null;

    if (!latestRank) {
      return res.send(`${username} has no recorded rank yet.`);
    }

    const message = `${username} is ${latestRank.rank} with ${latestRank.points} points.`;

    return platform === "nightbot" || platform === "streamelements"
      ? res.send(message)
      : res.json({ message });

  } catch (error) {
    console.error("❌ API Error:", error?.response?.data || error.message);
    return res.status(500).send("Failed to fetch player rank.");
  }
}
