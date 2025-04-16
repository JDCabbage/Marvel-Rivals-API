import axios from 'axios';

export default async function handler(req, res) {
  const { username, platform } = req.query;

  if (!username || !platform) {
    return res.status(400).send("Missing username or platform");
  }

  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://marvelrivalsapi.com/api/v1/player/${encodeURIComponent(username)}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );

    const latestRank = response.data.rank_history?.[0];

    if (!latestRank) {
      return res.send(`${username} has no recorded rank yet.`);
    }

    const message = `${username} is ${latestRank.rank} with ${latestRank.points} points.`;

    return platform === 'nightbot' || platform === 'streamelements'
      ? res.send(message)
      : res.json({ message });

  } catch (err) {
    console.error("🔥 API error:", err?.response?.data || err.message);
    return res.status(500).send("Failed to fetch player rank.");
  }
}
