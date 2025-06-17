const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const bodyParser = require("body-parser");
const supabase = require("./config/supabase");

const memeRoutes = require("./routes/memeRoutes");
const bidRoutes = require("./routes/bidRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { createServer } = require("http");
const { setupSocket } = require("./config/socket");

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// 🔍 Add this line to serve images publicly:
app.use("/uploads", express.static("uploads"));

// API Routes

// Quick test API to insert into 'test_table'
app.post("/api/test-insert", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("test_table")
      .insert([{ name }])
      .select(); // 👈 fetch inserted data here

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ error: "Failed to insert into test_table" });
    }

    res.json({ message: "Inserted successfully!", data });
  } catch (err) {
    console.error("Create Test Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.use("/api/memes", memeRoutes);
app.use("/api/bids", bidRoutes);

app.use("/api/ai", aiRoutes);
console.log("✅ Supabase connected:", supabase !== undefined);
// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Socket.io Setup (if needed)
setupSocket(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
