import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const OUTPUT_PATH = path.resolve(process.cwd(), "public/data/github-contributions.json");
const requireToken = process.argv.includes("--require-token");
const username = process.env.GITHUB_CONTRIBUTIONS_USERNAME ?? "deweezy12";
const token = process.env.GH_GRAPHQL_TOKEN ?? process.env.GITHUB_TOKEN ?? "";

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const query = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          months {
            name
            firstDay
          }
          weeks {
            firstDay
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

function formatDate(date) {
  return date.toISOString();
}

function buildRange() {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 365);
  return { from, to };
}

async function readExistingSnapshot() {
  try {
    const content = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function fetchContributionCalendar() {
  const { from, to } = buildRange();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "oliver-jan-jarosik-site",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: formatDate(from),
        to: formatDate(to),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error(`No contribution calendar returned for ${username}`);
  }

  return calendar;
}

function normalizeCalendar(calendar) {
  const weekIndexByFirstDay = new Map(
    calendar.weeks.map((week, weekIndex) => [week.firstDay, weekIndex])
  );

  return {
    username,
    generatedAt: new Date().toISOString(),
    totalContributions: calendar.totalContributions,
    weekCount: calendar.weeks.length,
    months: calendar.months
      .map((month) => ({
        label: month.name.slice(0, 3),
        weekIndex: weekIndexByFirstDay.get(month.firstDay),
      }))
      .filter((month) => Number.isInteger(month.weekIndex)),
    cells: calendar.weeks.flatMap((week, weekIndex) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        weekIndex,
        weekday: day.weekday,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
      }))
    ),
  };
}

async function writeSnapshot(snapshot) {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

async function main() {
  if (!token) {
    if (requireToken) {
      throw new Error("GH_GRAPHQL_TOKEN or GITHUB_TOKEN is required.");
    }

    const existingSnapshot = await readExistingSnapshot();

    if (existingSnapshot) {
      console.log(`No GitHub token found. Keeping existing snapshot at ${OUTPUT_PATH}.`);
      return;
    }

    const emptySnapshot = {
      username,
      generatedAt: new Date().toISOString(),
      totalContributions: 0,
      weekCount: 0,
      months: [],
      cells: [],
    };

    await writeSnapshot(emptySnapshot);
    console.log(`No GitHub token found. Wrote empty snapshot to ${OUTPUT_PATH}.`);
    return;
  }

  const calendar = await fetchContributionCalendar();
  const snapshot = normalizeCalendar(calendar);
  await writeSnapshot(snapshot);
  console.log(`Wrote GitHub contribution snapshot for ${username} to ${OUTPUT_PATH}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
