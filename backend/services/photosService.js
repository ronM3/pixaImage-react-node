const photosSA = require("../servicesAgents/photosSA");

async function getPhotos(category, q) {
  return await photosSA.getPhotos(category, q);
}

async function sortPhotosById(photos, sortOrder) {
    return await photosSA.sortPhotosById(photos, sortOrder);
}

async function sortPhotosByDate(photos, sortOrder){
    return await photosSA.sortPhotosByDate(photos, sortOrder)
}

module.exports = { getPhotos, sortPhotosById, sortPhotosByDate };
