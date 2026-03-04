#!/usr/bin/env node

/**
 * Create Notion databases required by this portfolio template.
 *
 * Usage:
 *   node scripts/notion/setup-template-databases.js --parent-page-id <NOTION_PAGE_ID>
 *
 * Auth order:
 *   1) NOTION_API_KEY
 *   2) NOTION_API_KEY_NUHGID
 */

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
    env: "NOTION_RECENTS_ID",
    title: "Portfolio - Recents",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Time: { date: {} },
      Body: { rich_text: {} },
      URL: { url: {} },
      Path: { url: {} },
      Logo: { files: {} },
      Tags: { multi_select: {} },
    },
  },
  {
    env: "NOTION_GOODS_ID",
    title: "Portfolio - Goods",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Created: { date: {} },
      URL: { url: {} },
      Note: { rich_text: {} },
      Fav: { checkbox: {} },
      Tags: { multi_select: {} },
      Thumbnail: { files: {} },
      Price: { number: {} },
      Brand: { rich_text: {} },
    },
  },
  {
    env: "NOTION_READINGLIST_ID",
    title: "Portfolio - Reading List",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Created: { date: {} },
      URL: { url: {} },
      Fav: { checkbox: {} },
      Tags: { multi_select: {} },
    },
  },
  {
    env: "NOTION_EXPERIENCE_ID",
    title: "Portfolio - Experience",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Date: { rich_text: {} },
      URL: { url: {} },
      Body: { rich_text: {} },
    },
  },
  {
    env: "NOTION_INVESTMENTS_ID",
    title: "Portfolio - Investments",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Private: { checkbox: {} },
      Path: { url: {} },
      Body: { rich_text: {} },
      URL: { url: {} },
      Logo: { files: {} },
    },
  },
  {
    env: "NOTION_NEWSLETTERS_ID",
    title: "Portfolio - Newsletters",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Order: { number: {} },
      Path: { url: {} },
      Logo: { files: {} },
      Body: { rich_text: {} },
      URL: { url: {} },
      Tags: { multi_select: {} },
      Fav: { checkbox: {} },
    },
  },
  {
    env: "NOTION_PODCASTS_ID",
    title: "Portfolio - Podcasts",
    properties: {
      Name: { title: {} },
      Order: { number: {} },
      Path: { url: {} },
      Logo: { files: {} },
      Body: { rich_text: {} },
      URL: { url: {} },
      Tags: { multi_select: {} },
      Fav: { checkbox: {} },
    },
  },
  {
    env: "NOTION_TALENT_ID",
    title: "Portfolio - Talent",
    properties: {
      Name: { title: {} },
      Display: { checkbox: {} },
      Created: { date: {} },
      URL: { url: {} },
      Fav: { checkbox: {} },
      Tags: { multi_select: {} },
      NotableUrl: { url: {} },
      NotableTitle: { rich_text: {} },
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
        found.push({
          id: block.id,
          title: block.child_database.title,
        });
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
    throw new Error(
      "Missing Notion key. Set NOTION_API_KEY or NOTION_API_KEY_NUHGID in your environment."
    );
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
