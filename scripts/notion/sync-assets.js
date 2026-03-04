#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public", "notion-assets");
const PUBLIC_MANIFEST = path.join(PUBLIC_DIR, "manifest.json");
const LIB_MANIFEST = path.join(ROOT, "lib", "notion-assets-manifest.generated.json");

const DATABASE_ENV_KEYS = [
  "NOTION_UPDATES_ID",
  "NOTION_WRITING_ID",
  "NOTION_PROJECTS_ID",
  "NOTION_VIBE_CODING_ID",
  "NOTION_KIND_WORDS_ID",
];

function readEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return {};
  const raw = fs.readFileSync(filepath, "utf8");
  const out = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

function loadEnv() {
  const env = {
    ...readEnvFile(path.join(ROOT, ".env")),
    ...readEnvFile(path.join(ROOT, ".env.local")),
    ...process.env,
  };
  return env;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeUrl(url) {
  if (!url || typeof url !== "string") return null;
  return url.split("?")[0];
}

function safeName(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (ext && ext.length <= 6) return ext;
  } catch (_) {}
  return ".jpg";
}

async function downloadToFile(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed download ${url} (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
}

async function listAllPagesInDatabase(notion, databaseId) {
  const pages = [];
  let cursor;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...(response.results || []));
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function listAllBlocks(notion, blockId) {
  async function walk(id) {
    const out = [];
    let cursor;
    do {
      const response = await notion.blocks.children.list({
        block_id: id,
        page_size: 100,
        start_cursor: cursor,
      });
      for (const block of response.results || []) {
        if (block.has_children) {
          block.children = await walk(block.id);
        }
        out.push(block);
      }
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    return out;
  }
  return walk(blockId);
}

function flattenBlocks(blocks) {
  const out = [];
  for (const block of blocks || []) {
    out.push(block);
    if (block.children?.length) {
      out.push(...flattenBlocks(block.children));
    }
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const notionApiKey = env.NOTION_API_KEY;
  if (!notionApiKey) {
    throw new Error("Missing NOTION_API_KEY in .env/.env.local");
  }

  const notion = new Client({ auth: notionApiKey });
  ensureDir(PUBLIC_DIR);

  const manifest = {
    pageProperty: {},
    blockImage: {},
    byUrl: {},
  };

  for (const envKey of DATABASE_ENV_KEYS) {
    const databaseId = env[envKey];
    if (!databaseId) continue;

    const dbSlug = safeName(envKey.replace(/^NOTION_/, "").replace(/_ID$/, ""));
    const dbDir = path.join(PUBLIC_DIR, dbSlug);
    ensureDir(dbDir);

    console.log(`Syncing database: ${envKey} (${databaseId})`);
    const pages = await listAllPagesInDatabase(notion, databaseId);

    for (const page of pages) {
      const pageId = page.id;
      const pageDir = path.join(dbDir, safeName(pageId));
      ensureDir(pageDir);

      for (const [propName, propValue] of Object.entries(page.properties || {})) {
        if (propValue?.type !== "files") continue;
        const files = propValue.files || [];
        for (let i = 0; i < files.length; i += 1) {
          const fileObj = files[i];
          const remoteUrl = fileObj?.file?.url || fileObj?.external?.url;
          if (!remoteUrl) continue;
          const ext = extFromUrl(remoteUrl);
          const filename = `${safeName(propName)}-${i + 1}${ext}`;
          const target = path.join(pageDir, filename);
          const localPath = `/notion-assets/${dbSlug}/${safeName(pageId)}/${filename}`;
          try {
            await downloadToFile(remoteUrl, target);
            if (i === 0) {
              manifest.pageProperty[`${pageId}:${propName}`] = localPath;
            }
            manifest.byUrl[normalizeUrl(remoteUrl)] = localPath;
          } catch (error) {
            console.warn(`  Skip property file: ${pageId}:${propName} -> ${error.message}`);
          }
        }
      }

      try {
        const blocks = await listAllBlocks(notion, pageId);
        const flatBlocks = flattenBlocks(blocks);
        for (const block of flatBlocks) {
          if (block.type !== "image") continue;
          const remoteUrl =
            block.image?.type === "external"
              ? block.image.external?.url
              : block.image?.file?.url;
          if (!remoteUrl) continue;
          const ext = extFromUrl(remoteUrl);
          const filename = `block-${safeName(block.id)}${ext}`;
          const target = path.join(pageDir, filename);
          const localPath = `/notion-assets/${dbSlug}/${safeName(pageId)}/${filename}`;
          try {
            await downloadToFile(remoteUrl, target);
            manifest.blockImage[block.id] = localPath;
            manifest.byUrl[normalizeUrl(remoteUrl)] = localPath;
          } catch (error) {
            console.warn(`  Skip block image: ${block.id} -> ${error.message}`);
          }
        }
      } catch (error) {
        console.warn(`  Skip page blocks: ${pageId} -> ${error.message}`);
      }
    }
  }

  fs.writeFileSync(PUBLIC_MANIFEST, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(LIB_MANIFEST, JSON.stringify(manifest, null, 2));
  console.log("Done: synced Notion assets + updated manifest.");
  console.log(`Manifest: ${PUBLIC_MANIFEST}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
