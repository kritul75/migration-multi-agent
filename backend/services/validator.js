const { exec } = require("child_process");

module.exports = () => {
  return new Promise((resolve) => {
    console.log("running validator");
    exec(
      "npx tsc",

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
