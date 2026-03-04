#!/usr/bin/env node

const { Client } = require("@notionhq/client");

const DEFAULT_PARENT_PAGE_ID = "1fb35103aee9800292e6cc58c7d5bd72";

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function textTitle(content) {
  return [{ type: "text", text: { content } }];
}

const DATABASE_DEFS = [
  {
    env: "NOTION_HOME_SHOWCASE_ID",
    title: "Site - Home Showcase",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Section: {
        select: {
          options: [
            { name: "Section 1", color: "blue" },
            { name: "Section 2", color: "green" },
            { name: "Section 3", color: "purple" },
          ],
        },
      },
      Body: { rich_text: {} },
      URL: { url: {} },
      Time: { date: {} },
      Logo: { files: {} },
      Path: { url: {} },
    },
  },
  {
    env: "NOTION_ABOUT_BIO_ID",
    title: "Site - About Bio",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Body: { rich_text: {} },
    },
  },
  {
    env: "NOTION_ABOUT_LINKS_ID",
    title: "Site - About Links",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      URL: { url: {} },
    },
  },
  {
    env: "NOTION_PROJECTS_ID",
    title: "Site - Projects",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Category: {
        select: {
          options: [
            { name: "Automata", color: "orange" },
            { name: "Vibe Coding", color: "pink" },
          ],
        },
      },
      Body: { rich_text: {} },
      URL: { url: {} },
    },
  },
];

async function listChildDatabases(notion, pageId) {
  let startCursor;
  const found = [];

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      start_cursor: startCursor,
    });

    for (const block of response.results) {
      if (block.type === "child_database") {
        found.push({ id: block.id, title: block.child_database.title });
      }
    }

    startCursor = response.has_more ? response.next_cursor : undefined;
  } while (startCursor);

  return found;
}

async function createOrReuseDatabases(notion, parentPageId) {
  const existing = await listChildDatabases(notion, parentPageId);
  const byTitle = new Map(existing.map((db) => [db.title, db.id]));
  const output = {};

  for (const def of DATABASE_DEFS) {
    if (byTitle.has(def.title)) {
      output[def.env] = byTitle.get(def.title);
      continue;
    }

    const created = await notion.databases.create({
      parent: { type: "page_id", page_id: parentPageId },
      title: textTitle(def.title),
      properties: def.properties,
    });
    output[def.env] = created.id;
  }

  return output;
}

async function main() {
  const notionApiKey = process.env.NOTION_API_KEY || process.env.NOTION_API_KEY_NUHGID;
  if (!notionApiKey) {
    throw new Error("Set NOTION_API_KEY or NOTION_API_KEY_NUHGID before running.");
  }

  const parentPageId = getArg("--parent-page-id") || DEFAULT_PARENT_PAGE_ID;
  const notion = new Client({ auth: notionApiKey });

  const ids = await createOrReuseDatabases(notion, parentPageId);

  console.log("Done. Add these to .env.local:");
  console.log(`NOTION_API_KEY=${notionApiKey}`);
  Object.entries(ids).forEach(([key, value]) => {
    console.log(`${key}=${String(value).replace(/-/g, "")}`);
  });
}

main().catch((error) => {
  console.error("Failed:", error.message || error);
  process.exit(1);
});
