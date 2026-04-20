const photosHelper = require("../helpers/photos/SAHelpers");
const serviceHelper = require("../helpers/photos/serviceHelper");

async function getPhotos(category, q) {
  const normalizedCategory = typeof category === "string" ? category.trim() : "";
  const normalizedQuery = typeof q === "string" ? q.trim() : "";
  const cacheKey = `__express__photos__${normalizedCategory || "all"}__${normalizedQuery || ""}`;
  const cacheKeyFragment = `${normalizedCategory || "all"}__${normalizedQuery || ""}`;

  let endPoint = `${process.env.API_ENDPOINT}&per_page=200`;
  if (normalizedCategory) {
    endPoint += `&category=${encodeURIComponent(normalizedCategory)}`;
  }
  if (normalizedQuery) {
    endPoint += `&q=${encodeURIComponent(normalizedQuery)}`;
  }

  console.log(cacheKey);
  const allPhotos = await photosHelper.cacheHandler(60, cacheKeyFragment, async () => {
    return await photosHelper.getAsync(endPoint);
  });
  return allPhotos;
}

async function sortPhotosById(photos, sortOrder) {
  const response = serviceHelper.sortPhotosById(photos, sortOrder);
  return response;
}

async function sortPhotosByDate(photos, sortOrder) {
  const response = serviceHelper.sortPhotosByDate(photos, sortOrder);
  return response;
}

module.exports = { getPhotos, sortPhotosById, sortPhotosByDate };
