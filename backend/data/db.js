import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data.json");

export async function readData() {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function writeData(data) {
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2)
  );
}