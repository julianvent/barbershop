import fs from "fs";
import path from "path";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";

export function setupLogging(app) {
  const logDirectory = path.join(process.cwd(), "logs");

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const stream = createStream("access.log", {
    interval: "1d",
    path: logDirectory,
    maxFiles: 7
  });

  app.use(morgan("combined", { stream }));
}
