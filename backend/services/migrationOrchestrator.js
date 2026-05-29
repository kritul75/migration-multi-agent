const fs = require("fs-extra");

const path = require("path");

const migrationExecutor = require("./migrationExecutor");

const validator = require("./validator");

const fixer = require("./fixer");

const findFile = require("../utils/findFile");

const getFileType = require("../utils/getFileType");

module.exports = async (
  extractPath,

  report,
) => {
  const results = [];
  
  await fs.ensureDir("migrated");

  const filesToMigrate = [
    ...report.middlewareFiles,

    ...report.modelFiles,

    ...report.routeFiles,
  ];

  

  for (const file of filesToMigrate) {
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

      while (!validation.success && attempts <= 1) {
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

        type: getFileType(file, report),

        success: validation.success,

        errors: validation.errors || null,

        attempts,
      });
    } catch (err) {
      results.push({
        file,

        type: getFileType(file, report),

        success: false,

        error: err.message,
      });
    }
  }
  //generating summary
  const summary = {
    totalFiles: results.length,

    success: results.filter((r) => r.success).length,

    failed: results.filter((r) => !r.success).length,
  };
  return { summary , results};
};


