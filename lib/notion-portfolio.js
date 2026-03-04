const { Client } = require("@notionhq/client");
const { getBlockImage, getByUrl, getPagePropertyImage } = require("./notion-asset-map");
const queryCache = new Map();
const QUERY_CACHE_TTL_MS = 60 * 1000;

function getClient() {
  return new Client({ auth: process.env.NOTION_API_KEY });
}

function getDatabaseId(...keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return null;
}

function getTitle(page, key = "Name") {
  const value = page?.properties?.[key];
  if (!value || value.type !== "title") return "";
  return value.title?.[0]?.plain_text || "";
}

function getRichText(page, key) {
  const value = page?.properties?.[key];
  if (!value || value.type !== "rich_text") return [];
  return value.rich_text || [];
}

function getRichTextPlain(page, key) {
  return getRichText(page, key).map((item) => item.plain_text || "").join("");
}

function getDate(page, key) {
  const value = page?.properties?.[key];
  if (!value || value.type !== "date") return null;
  return value.date?.start || null;
}

function getUrl(page, key) {
  const value = page?.properties?.[key];
  if (!value || value.type !== "url") return null;
  return value.url || null;
}

function getCheckbox(page, key) {
  const value = page?.properties?.[key];
  if (!value || value.type !== "checkbox") return false;
  return Boolean(value.checkbox);
}

function getMultiSelect(page, key) {
  const value = page?.properties?.[key];
  if (!value || value.type !== "multi_select") return [];
  return value.multi_select || [];
}

function getFileUrl(page, key) {
  const localByProperty = getPagePropertyImage(page?.id, key);
  if (localByProperty) return localByProperty;

  const value = page?.properties?.[key];
  if (!value || value.type !== "files") return null;
  const file = value.files?.[0];
  if (!file) return null;
  const remoteUrl = file.file?.url || file.external?.url || null;
  const localByUrl = getByUrl(remoteUrl);
  return localByUrl || remoteUrl;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getSlug(page, key = "Slug", fallbackTitleKey = "Name") {
  const fromProp = getRichTextPlain(page, key);
  if (fromProp) return slugify(fromProp);
  return slugify(getTitle(page, fallbackTitleKey));
}

async function queryVisible({ databaseId, sorts = [], pageSize }) {
  const cacheKey = JSON.stringify({ databaseId, sorts, pageSize, filter: "Display=true" });
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < QUERY_CACHE_TTL_MS) {
    return cached.data;
  }

  const notion = getClient();
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [{ property: "Display", checkbox: { equals: true } }],
    },
    sorts,
    ...(pageSize ? { page_size: pageSize } : {}),
  });
  const data = response.results || [];
  queryCache.set(cacheKey, { ts: Date.now(), data });
  return data;
}

async function listPageBlocks(blockId) {
  const notion = getClient();

  async function walk(id) {
    let cursor;
    const out = [];
    do {
      const response = await notion.blocks.children.list({
        block_id: id,
        page_size: 100,
        start_cursor: cursor,
      });
      for (const block of response.results) {
        if (block.type === "image") {
          const remoteUrl =
            block.image?.type === "external"
              ? block.image.external?.url
              : block.image?.file?.url;
          const localByBlock = getBlockImage(block.id);
          const localByUrl = getByUrl(remoteUrl);
          const localUrl = localByBlock || localByUrl;
          if (localUrl) {
            block.image.local_url = localUrl;
          }
        }
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

module.exports = {
  getDatabaseId,
  getTitle,
  getRichText,
  getRichTextPlain,
  getDate,
  getUrl,
  getCheckbox,
  getMultiSelect,
  getFileUrl,
  getSlug,
  queryVisible,
  listPageBlocks,
};
