const path = require("path");
const { Worker, isMainThread } = require("worker_threads");

const pathToResizeWorker = path.resolve(__dirname, "resizeWorker.js");
const pathToMonochromeWorker = path.resolve(__dirname, "monochromeWorker.js");

function uploadPathResolver(filename) {
  return path.resolve(__dirname, "../uploads", filename);
}

function imageProcessor(filename) {
  const sourcePath = uploadPathResolver(filename);
  const resizedDestination = uploadPathResolver("resized-" + filename);
  const monochromeDestination = uploadPathResolver("monochrome-" + filename);

  let resizeWorkerFinished = false;

  return new Promise((resolve, reject) => {
    if (isMainThread) {
      try {
        const resizeWorker = Worker(pathToResizeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        });
        const monochromeWorker = Worker(pathToMonochromeWorker, {
          workerData: {
            source: sourcePath,
            destination: monochromeDestination,
          },
        });

        resizeWorker.on("message", (message) => {
          resizeWorkerFinished = true;
          resolve("resizeWorker finished processing");
        });

        resizeWorker.on("error", (error) => {
          reject(new Error(error.message));
        });

        resizeWorker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error("Exited with status code " + code));
          }
        });
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("not on main thread"));
    }
  });
}

module.exports = imageProcessor;
