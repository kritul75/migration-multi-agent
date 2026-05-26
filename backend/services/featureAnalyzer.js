const fs = require("fs-extra");

module.exports = async (files) => {
  let features = {
    database: null,

    auth: null,

    middleware: [],

    routes: [],

    modules: [],
  };

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const code = await fs.readFile(file, "utf8");

    //
    // Detect MongoDB
    //

    if (code.includes("mongoose") || code.includes("Schema(")) {
      features.database = "MongoDB";
    }

    //
    // Detect JWT
    //

    if (code.includes("jwt.sign") || code.includes("jwt.verify")) {
      features.auth = "JWT";
    }

    //
    // Detect routes
    //

    const routeRegex =
      /(?:router|route|app)\.(get|post|put|delete|patch|all)\s*\(\s*['"`]([^'"`]+)['"`]/gi;

    let match;

    // Only extract routes from route files
    if (file.toLowerCase().includes("routes")) {
        //console.log("This is route file");
      while ((match = routeRegex.exec(code)) !== null) {
        
        const path = require("path");

        features.routes.push({
          file: path.basename(file),

          method: match[1].toUpperCase(),

          path: match[2],
        });
      }
      
    }

    //
    // Detect middleware
    //

    if (code.includes("next()")) {
      const path = require("path");

      features.middleware.push(path.basename(file));
    }

    //
    // Detect modules
    //

    if (file.toLowerCase().includes("auth"))
      features.modules.push("Authentication");

    if (file.toLowerCase().includes("post")) features.modules.push("Posts");

    if (file.toLowerCase().includes("profile"))
      features.modules.push("Profiles");
  }

  features.modules = [...new Set(features.modules)];

  return features;
};
