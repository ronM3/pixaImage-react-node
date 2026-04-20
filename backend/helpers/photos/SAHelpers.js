const axios = require("axios");
const cache = require('memory-cache');
let memCache = new cache.Cache();

async function getAsync(endpoint){
    try {
        const { data: { hits } } = await axios.get(endpoint);
        return hits;
      } catch (error) {
        const detail = error.response
          ? `Pixabay ${error.response.status}: ${JSON.stringify(error.response.data)}`
          : error.message;
        console.error('Pixabay API error:', detail);
        throw new Error(detail);
      }
}  
async function cacheHandler(duration, category, httpCallBack) {
    const categoryVal = category ? category : 'general';
    const key = `__express__photos__${categoryVal}`;
    const cacheContent = memCache.get(key);
    if (cacheContent) {
      console.log("cache working");
      return JSON.parse(cacheContent);
    } else {
      const response = await httpCallBack();
      memCache.put(key, JSON.stringify(response), duration * 1000);
      return response;
    }
}

module.exports = {getAsync,cacheHandler}