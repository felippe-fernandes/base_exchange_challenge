import { spawnSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup() {
  const cwd = path.resolve(__dirname, "..");

  const command =
    process.platform === "win32"
      ? { file: "cmd.exe", args: ["/c", "npm", "run", "seed"] }
      : { file: "npm", args: ["run", "seed"] };

  const result = spawnSync(command.file, command.args, {
    cwd,
    env: process.env,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error("Failed to seed the database before Playwright tests.");
  }
}
