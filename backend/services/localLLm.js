const ollama = require("ollama").default;

module.exports = async (prompt) => {
  const response = await ollama.chat({
    model: "qwen2.5-coder:1.5b",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.message.content;
};
