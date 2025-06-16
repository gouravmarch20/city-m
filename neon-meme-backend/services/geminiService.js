const fetch = require("node-fetch");
exports.getGeminiCaption = async (tags) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a funny meme caption for: ${tags.join(", ")}`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || "YOLO to the moon!"
    );
  } catch (err) {
    return "YOLO to the moon!";
  }
};
