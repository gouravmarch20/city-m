const cache = new Map();

const setCache = (key, value, ttl = 60 * 1000) => {
  cache.set(key, { value, expires: Date.now() + ttl });
};

const getCache = (key) => {
  const data = cache.get(key);
  if (!data) return null;
  if (Date.now() > data.expires) {
    cache.delete(key);
    return null;
  }
  return data.value;
};

module.exports = { setCache, getCache };
