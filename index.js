const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // t

const memeRoutes = require("./routes/memeRoutes");
const bidRoutes = require("./routes/bidRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { createServer } = require("http");

dotenv.config();

const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/memes", memeRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Vercel Node.js function!");
});

// Swagger Docs (Postman-like GUI at: http://localhost:5001/api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
