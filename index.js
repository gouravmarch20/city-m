const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

dotenv.config();

const app = express();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Example API Routes
app.get("/api/memes", (req, res) => {
  res.json({ message: "Memes route working!" });
});

app.get("/api/bids", (req, res) => {
  res.json({ message: "Bids route working!" });
});

app.get("/api/leaderboard", (req, res) => {
  res.json({ message: "Leaderboard route working!" });
});

app.get("/api/ai", (req, res) => {
  res.json({ message: "AI route working!" });
});

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Home Route
app.get("/", (req, res) => {
  res.send("Hello from Single-file Express Server!");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
