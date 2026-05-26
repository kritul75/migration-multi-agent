const fs = require("fs-extra");

const path = require("path");

module.exports = function findFile(
  dir,

  target,
) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const found = findFile(
        fullPath,

        target,
      );

      if (found) return found;
    } else if (item === target) {
      return fullPath;
    }
  }

  return null;
};
