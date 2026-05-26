const { exec } = require("child_process");

const path = require("path");

module.exports = () => {
  return new Promise((resolve) => {
    const tsconfig = path.resolve(
      __dirname,

      "..",

      "tsconfig.json",
    );

    exec(
      `npx tsc --project "${tsconfig}"`,

      (
        err,

        stdout,

        stderr,
      ) => {
        if (err) {
          return resolve({
            success: false,

            errors: stderr || stdout,
          });
        }

        resolve({
          success: true,
        });
      },
    );
  });
};
