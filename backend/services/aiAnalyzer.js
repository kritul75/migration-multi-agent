
const { GoogleGenAI } = require("@google/genai");
 
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = async (report) => {
  try {
    // const model = genAI.models({
    //   model: "gemini-2.5-flash",
    // });
    
 const prompt = `

You are a senior backend migration engineer.

Analyze:

${JSON.stringify(report, null, 2)}

Create migration plan.

Return ONLY JSON:

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

"estimatedDifficulty":"",
"estimatedEffort":"",

"warnings":[
""
]

}

No markdown.

Only JSON.

`;

    //const result = await model.generateContent(prompt);
    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const response = result.candidates[0].content.parts[0].text.trim();
    //console.log("Gemini Response:", response);

    return JSON.parse(response);
  } catch (err) {
    console.log("Gemini Error:", err);

    return "AI analysis failed";
  }
};
