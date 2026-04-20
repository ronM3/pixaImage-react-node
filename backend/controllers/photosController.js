const express = require("express");
const router = express.Router();
const photosService = require("../services/photosService");
const paginationMiddleware = require("../middlewares/paginationMiddleware")
const serviceHelper = require("../helpers/photos/serviceHelper")


router.get("/",paginationMiddleware(9), async (req, res, next) => {
    try {
        const { category } = req.query;
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        const { startIndex, endIndex } = req.pagination;
        const photos = await photosService.getPhotos(category, q);
        const paginatedPhotos = photos.slice(startIndex, endIndex);
        const pagination = serviceHelper.calculatePagination(photos, 9, req.pagination.page);
    
        const response = {
          ...pagination,
          items: paginatedPhotos,
        };
        res.json(response);
    }
    catch(error){
        return next(error)
    }
})

// Route for sorting images by ID
router.get("/:category/sortById/:sortOrder",paginationMiddleware(9), async (req, res, next) => {
  try {
    const { category, sortOrder } = req.params;
    const { startIndex, endIndex } = req.pagination;

    const photos = await photosService.getPhotos(category);
    const sortedPhotos = await photosService.sortPhotosById(photos, sortOrder);
    const paginatedPhotos = sortedPhotos.slice(startIndex, endIndex);
    const pagination = serviceHelper.calculatePagination(sortedPhotos, 9, req.pagination.page);

    const response = {
      ...pagination,
      items: paginatedPhotos,
    };
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

// Route for sorting images by Date
router.get("/:category/sortByDate/:sortOrder",paginationMiddleware(9), async (req, res, next) => {
  try {
    const { category, sortOrder } = req.params;
    const { startIndex, endIndex } = req.pagination;
    const photos = await photosService.getPhotos(category);
    const sortedPhotos = await photosService.sortPhotosByDate(photos,sortOrder);

    const paginatedPhotos = sortedPhotos.slice(startIndex, endIndex);
    const pagination = serviceHelper.calculatePagination(sortedPhotos, 9, req.pagination.page);

    const response = {
      ...pagination,
      items: paginatedPhotos,
    };
    res.json(response);

    res.json(sortedPhotos);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
