require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = async (report) => {
  const prompt = `

You are a senior backend migration engineer.

Analyze:

${JSON.stringify(report, null, 2)}

Create migration plan.

Return ONLY valid JSON:

{

"priorityOrder":[
""
],

"migrationSteps":[
""
],

"requiredPackages":[
""
],

"warnings":[
""
],

"estimatedDifficulty":"",

"estimatedEffort":""

}

No markdown.

Only JSON.

`;

  try {
    const result = await genAI.models.generateContent({
      model: process.env.MODEL || "gemini-2.5-flash",

      contents: prompt,
    });

    let text = result.candidates[0].content.parts[0].text.trim();

    text = text

      .replace(/```json/g, "")

      .replace(/```/g, "")

      .trim();

    return JSON.parse(text);
  } catch (err) {
    console.log(err);

    return {
      error: "Planning failed",
    };
  }
};
