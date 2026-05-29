require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = async (code) => {
  const prompt = `

Convert this Express.js
JavaScript code to
TypeScript.

Rules:

1 Add proper types

2 Add imports

3 Avoid <any>

4 Keep logic same

Return ONLY code


Code:


${code}

`;

  try {
    const result = await genAI.models.generateContent({
      model: process.env.MODEL || "gemini-2.5-flash",
 
      contents: prompt,
    });

    let text = result.candidates[0].content.parts[0].text.trim();

    text = text

      .replace(/```typescript/g, "")

      .replace(/```ts/g, "")

      .replace(/```/g, "")

      .trim();

    return text;
  } catch (err) {
    console.log(err);

    return code;
  }
};
