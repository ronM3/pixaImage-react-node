import axios from 'axios';

import {
  setPhotosData,
  setPhotosLoading,
  setPhotosError,
  setCurrentPage,
  setCurrentCategory,
  updateCurrentQuery as updateCurrentQueryState,
} from "./photosSlice";

export const fetchPhotos = (category, page = 1, q) => {
    return async (dispatch, getState) => {
      try {
        const { currentCategory, currentQuery } = getState().photosState;
        const activeCategory = typeof category === "undefined" ? currentCategory : category;
        const activeQuery = typeof q === "undefined" ? currentQuery : q;
        const normalizedQuery = typeof activeQuery === "string" ? activeQuery.trim() : "";

        dispatch(setPhotosLoading(true));
        dispatch(setCurrentPage(page));
        const endPoint = `${import.meta.env.VITE_PIXABAY}?category=${activeCategory || ""}&page=${page}${normalizedQuery ? `&q=${encodeURIComponent(normalizedQuery)}` : ""}`;
        const {data} = await axios.get(endPoint)
        dispatch(setPhotosData(data));
        dispatch(setPhotosLoading(false));
      } catch (error) {
        dispatch(setPhotosError(error.message));
        dispatch(setPhotosLoading(false));
      }
    };
  };

  export const goToPrevPage = (category, currentPage) => {
    return (dispatch, getState) => {
      const prevPage = currentPage - 1;
      const currentQuery = getState().photosState.currentQuery;
      dispatch(setCurrentPage(prevPage));
      dispatch(fetchPhotos(category, prevPage, currentQuery));
    };
  };
  export const goToNextPage = (category, currentPage) => {
    return (dispatch, getState) => {
      const nextPage = currentPage + 1;
      const currentQuery = getState().photosState.currentQuery;
      dispatch(setCurrentPage(nextPage));
      dispatch(fetchPhotos(category, nextPage, currentQuery));
    };
  };

  export const updateCurrentCategory = (category) => {
    return (dispatch) => {
      const currentCategory = category
      dispatch(setCurrentCategory(currentCategory));
    };
  };

  export const updateCurrentQuery = (query) => {
    return (dispatch) => {
      dispatch(updateCurrentQueryState(query));
    };
  };
