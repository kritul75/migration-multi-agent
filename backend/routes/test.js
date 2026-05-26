const express = require("express");

const multer = require("multer");

const path = require("path");

const unzipper = require("unzipper");

const fs = require("fs-extra");

const analyzer = require("../services/analyzer");
const aiAnalyzer = require("../services/aiAnalyzer");
const migrationPlanner = require("../services/migrationPlanner");
const migrationExecutor = require("../services/migrationExecutor");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

router.post(
  "/upload",

  upload.single("repo"),

  async (req, res) => {
    try {
      const zipPath = req.file.path;

      const extractPath = `extracted/${Date.now()}`;

      await fs.ensureDir(extractPath);

      await fs
        .createReadStream(zipPath)

        .pipe(
          unzipper.Extract({
            path: extractPath,
          }),
        )

        .promise();

      /*
@calling analyzer
*/
      //const report = await analyzer(extractPath);
      /*
@calling aiAnalyzer
*/
    //const ai = await aiAnalyzer(report);


//----------testing migartion ----------------

      //const routeFile = report.routeFiles[0];
      const code = await fs.readFile(
        `${extractPath}/Back-end/Routes/auth.js`,

        "utf8",
      );
      const migrated = await migrationExecutor(code);
      await fs.writeFile(
        "migrated/auth.ts",

        migrated,
      );
      res.json({
        migration: migrated,
      });

//-------------------------------------------


      /*
@calling migrationPlanner 
*/
      
    } catch (err) {
        console.log("Error processing upload:");
        console.log(err);

        res.status(500).json({
            error: "failed",
        });
    }
  },
);

module.exports = router;
