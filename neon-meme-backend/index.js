/*
  Full Node.js + Express.js + MongoDB (Mongoose) Backend
  Features: Meme CRUD, Real-time Bidding (Socket.IO), Leaderboard, Google Gemini API integration
*/

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const fetch = require("node-fetch");
const { swaggerUi, specs } = require("./swagger");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

console.log(":process.env.MONGO_URI", process.env.MONGO_URI);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Meme Schema
const memeSchema = new mongoose.Schema({
  title: String,
  image_url: String,
  tags: [String],
  upvotes: { type: Number, default: 0 },
  owner_id: String,
  caption: String,
  vibe: String,
});
const Meme = mongoose.model("Meme", memeSchema);

// Bid Schema
const bidSchema = new mongoose.Schema({
  meme_id: mongoose.Schema.Types.ObjectId,
  user_id: String,
  credits: Number,
});
const Bid = mongoose.model("Bid", bidSchema);

// In-memory Cache
const leaderboardCache = new Map();

// Mock Auth Users
const mockUsers = ["neo_hacker", "cyberpunk420", "glitch_lord"];

// Google Gemini API call
async function getGeminiData(tags) {
  try {
    const prompt = `Give a funny caption and vibe for these meme tags: ${tags.join(
      ", "
    )}`;
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await res.json();
    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "YOLO to the moon!";
    return { caption: output, vibe: "Retro Stonks Vibes" };
  } catch {
    return { caption: "YOLO to the moon!", vibe: "Neon Fail Vibes" };
  }
}

// API: Create Meme
app.post("/memes", async (req, res) => {
  const { title, image_url, tags, owner_id } = req.body;
  const { caption, vibe } = await getGeminiData(tags);
  const meme = new Meme({
    title,
    image_url,
    tags,
    upvotes: 0,
    owner_id,
    caption,
    vibe,
  });
  await meme.save();
  res.json(meme);
});

// API: Get Memes
app.get("/memes", async (req, res) => {
  const memes = await Meme.find();
  res.json(memes);
});

// API: Upvote Meme
app.post("/memes/:id/upvote", async (req, res) => {
  const meme = await Meme.findById(req.params.id);
  meme.upvotes += 1;
  await meme.save();
  leaderboardCache.clear(); // invalidate cache
  io.emit("memeUpvoted", { meme_id: meme._id, upvotes: meme.upvotes });
  res.json(meme);
});

// API: Place Bid
app.post("/bids", async (req, res) => {
  const { meme_id, user_id, credits } = req.body;
  const bid = new Bid({ meme_id, user_id, credits });
  await bid.save();
  io.emit("newBid", bid);
  res.json(bid);
});

// API: Get Leaderboard
app.get("/leaderboard", async (req, res) => {
  if (leaderboardCache.has("top10"))
    return res.json(leaderboardCache.get("top10"));
  const topMemes = await Meme.find().sort({ upvotes: -1 }).limit(10);
  leaderboardCache.set("top10", topMemes);
  res.json(topMemes);
});

// WebSocket events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
