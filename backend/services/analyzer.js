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
  
  const report  = {
      framework: "Unknown",
      dependencies: [],
      routeFiles: [],
      modelFiles: [],
      middlewareFiles: [],
      totalFiles: 0,
      
  }
  let packageJson = null;


  for (let file of files) {
    report.totalFiles++;
    if (file.endsWith("package.json")) {
      packageJson = JSON.parse(await fs.readFile(file, "utf8"));

      report.dependencies = Object.keys(packageJson.dependencies || {});
    }

    // extracting routes
    if (file.toLowerCase().includes("routes") || file.toLowerCase().includes("route")) {
      report.routeFiles.push(path.basename(file));
    }
    // extracting models
    if (file.toLowerCase().includes("models") || file.toLowerCase().includes("model")) {
      report.modelFiles.push(path.basename(file));
    }
    // extracting middlewares
    if (file.toLowerCase().includes("middleware") || file.toLowerCase().includes("middlewares")) {
      report.middlewareFiles.push(path.basename(file));
    }
  }

  //feature analysis
  const deepFeatures = await featureAnalyzer(files);

  return {
    framework: report.dependencies.includes("express") ? "Express" : "Unknown",

    dependencies: report.dependencies,

    routeFiles: report.routeFiles,

    modelFiles: report.modelFiles,

    middlewareFiles: report.middlewareFiles,

    totalFiles: files.length,

    deepFeatures
  };
};
