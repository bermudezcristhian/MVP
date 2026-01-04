const cache = new Map();

const redis = {
  get: async (key) => {
    const data = cache.get(key);
    if (!data) return null;

    // TTL
    if (data.expireAt && Date.now() > data.expireAt) {
      cache.delete(key);
      return null;
    }

    return data.value;
  },

  setEx: async (key, ttl, value) => {
    cache.set(key, {
      value,
      expireAt: Date.now() + ttl * 1000,
    });
  },

  del: async (key) => {
    cache.delete(key);
  },
};

console.log("Redis SIMULADO activo");

module.exports = redis;
