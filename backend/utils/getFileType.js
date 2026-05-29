module.exports = function getFileType(file, report) {
  if (report.middlewareFiles.includes(file)) {
    return "middleware";
  }

  if (report.modelFiles.includes(file)) {
    return "model";
  }

  return "route";
}
