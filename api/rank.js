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

    // Get current visible rank
    const currentRank = response.data?.player?.rank?.rank || "Unranked";

    // Optional: use points from rank history (if available)
    const points = response.data?.rank_history?.[0]?.points || "unknown";

    const message = `${username} is ${currentRank} with ${points} points.`;

    return platform === "nightbot" || platform === "streamelements"
      ? res.send(message)
      : res.json({ message });

  } catch (err) {
    console.error("❌ API Error:", err?.response?.data || err.message);
    return res.status(500).send("Failed to fetch player rank.");
  }
}
