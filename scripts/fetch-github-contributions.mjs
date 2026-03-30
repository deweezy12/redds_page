import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const username = "deweezy12";
const currentFile = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(currentFile), "..");
const outputDir = resolve(repoRoot, "src", "generated");
const outputFile = resolve(outputDir, "githubContributionSnapshot.ts");
const endpoint = `https://github-contributions.vercel.app/api/v1/${username}`;

async function hasExistingSnapshot() {
  try {
    await access(outputFile);
    return true;
  } catch {
    return false;
  }
}

let payload;
let fetchedAt = new Date().toISOString();

try {
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub contributions for ${username}: ${response.status} ${response.statusText}`);
  }

  payload = await response.json();
} catch (error) {
  if (await hasExistingSnapshot()) {
    console.warn(`[github-snapshot] Using existing snapshot because refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(0);
  }

  throw error;
}

const contents = `export const githubContributionSnapshot = ${JSON.stringify(
  {
    username,
    fetchedAt,
    endpoint,
    payload,
  },
  null,
  2
)} as const;\n`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, contents, "utf8");
