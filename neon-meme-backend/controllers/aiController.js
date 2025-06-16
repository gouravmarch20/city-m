const { getGeminiCaption } = require("../services/geminiService");
exports.generateCaption = async (req, res) => {
  const { tags } = req.body;
  const caption = await getGeminiCaption(tags);
  res.json({ caption });
};
