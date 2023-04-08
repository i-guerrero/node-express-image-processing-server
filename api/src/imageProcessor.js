const path = require("path");
const { Worker, isMainThread } = require("worker_threads");

const pathToResizeWorker = path.resolve(__dirname, "resizeWorker.js");
const pathToMonochromeWorker = path.resolve(__dirname, "monochromeWorker.js");

function uploadPathResolver(filename) {
  return path.resolve(__dirname, "../uploads", filename);
}

function imageProcessor(filename) {
  const sourcePath = uploadPathResolver(filename);
  return new Promise((resolve, reject) => {
    if (isMainThread) {
    } else {
      reject(new Error("not on main thread"));
    }
    resolve();
  });
}

module.exports = imageProcessor;
