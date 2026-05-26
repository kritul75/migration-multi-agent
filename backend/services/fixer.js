require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = async (
  code,
  errors,
) => {
  try {
    const prompt = `

You are an expert TypeScript migration engineer.

The following code was generated while migrating JavaScript → TypeScript.

It fails compilation.

Your job:

1 Fix ALL TypeScript errors

2 Preserve logic

3 Keep same framework
(Express remains Express)

4 Add imports/types if needed

5 Remove invalid assumptions

6 Return ONLY corrected code

--------------------------------

Code:


${code}


--------------------------------


Compilation Errors:


${errors}


--------------------------------

Return ONLY corrected TypeScript code.

No markdown.

No explanation.

`;
    console.log("running fixer");
    const result = await genAI.models.generateContent({
      model: process.env.MODEL || "gemini-2.5-flash",

      contents: prompt,
    });
    console.log("fixer completed");

    let fixed = result.candidates[0].content.parts[0].text.trim();

    fixed = fixed

      .replace(/```typescript/g, "")

      .replace(/```ts/g, "")

      .replace(/```/g, "")

      .trim();

    return fixed;
  } catch (err) {
    console.log(
      "Fixer Error:",

      err,
    );

    return code;
  }
};
