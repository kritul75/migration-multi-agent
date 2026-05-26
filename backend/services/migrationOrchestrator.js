const fs = require("fs-extra");

const path = require("path");

const migrationExecutor = require("./migrationExecutor");

const validator = require("./validator");

const fixer = require("./fixer");

const findFile = require("../utils/findFile");

module.exports = async (
  extractPath,

  report,
) => {
  const results = [];

  await fs.ensureDir("migrated");

  for (const file of report.routeFiles) {
    try {
      console.log(
        `\nMigrating:
${file}`,
      );

      const fullPath = findFile(
        extractPath,

        file,
      );

      if (!fullPath) {
        results.push({
          file,

          success: false,

          error: "File not found",
        });

        continue;
      }

      const code = await fs.readFile(
        fullPath,

        "utf8",
      );

      let currentCode = await migrationExecutor(code);

      const outputPath = `migrated/${file.replace(".js", ".ts")}`;

      await fs.writeFile(
        outputPath,

        currentCode,
      );

      let validation = await validator(outputPath);

      let attempts = 0;

      while (!validation.success && attempts < 3) {
        console.log(
            `Fixing:
            ${file}
            Attempt:
            ${attempts + 1}`,
        );

        currentCode = await fixer(
          currentCode,

          validation.errors,
        );

        await fs.writeFile(
          outputPath,

          currentCode,
        );

        validation = await validator(outputPath);

        attempts++;
      }

      results.push({
        file,

        success: validation.success,

        attempts,

        errors: validation.errors || null,
      });
    } catch (err) {
      results.push({
        file,

        success: false,

        error: err.message,
      });
    }
  }

  return results;
};


