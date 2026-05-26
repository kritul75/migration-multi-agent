const fs = require("fs-extra");

const path = require("path");
const featureAnalyzer = require("./featureAnalyzer");

async function walk(dir, files = []) {
  const items = await fs.readdir(dir);

  for (let item of items) {
    const full = path.join(dir, item);
 
    const stat = await fs.stat(full);

    if (stat.isDirectory()) {
      await walk(full, files);
    } else {
      files.push(full);
    }
  }

  return files;
}

module.exports = async (repoPath) => {
  const files = await walk(repoPath);

  let packageJson = null;

  let routes = [];

  let dependencies = [];

  for (let file of files) {
    if (file.endsWith("package.json")) {
      packageJson = JSON.parse(await fs.readFile(file, "utf8"));

      dependencies = Object.keys(packageJson.dependencies || {});
    }

    // extracting routes
    if (file.includes("routes") || file.includes("Routes")) {
      routes.push(path.basename(file));
    }
  }

  //feature analysis
  const deepFeatures = await featureAnalyzer(files);

  return {
    framework: dependencies.includes("express") ? "Express" : "Unknown",

    dependencies,

    routeFiles: routes,

    totalFiles: files.length,

    deepFeatures
  };
};
