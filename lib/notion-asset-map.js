const manifest = require("./notion-assets-manifest.generated.json");

function normalizeUrl(url) {
  if (!url || typeof url !== "string") return null;
  return url.split("?")[0];
}

function getPagePropertyImage(pageId, propertyName) {
  if (!pageId || !propertyName) return null;
  return manifest?.pageProperty?.[`${pageId}:${propertyName}`] || null;
}

function getBlockImage(blockId) {
  if (!blockId) return null;
  return manifest?.blockImage?.[blockId] || null;
}

function getByUrl(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  return manifest?.byUrl?.[normalized] || null;
}

module.exports = {
  getPagePropertyImage,
  getBlockImage,
  getByUrl,
  normalizeUrl,
};
