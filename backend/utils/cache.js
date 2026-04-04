export const memoizeAsync = (fn, ttlMs = 60_000) => {
  let cacheEntry = null;

  return async (...args) => {
    const now = Date.now();

    if (cacheEntry && cacheEntry.expiresAt > now) {
      return cacheEntry.value;
    }

    const value = await fn(...args);

    cacheEntry = {
      value,
      expiresAt: now + ttlMs,
    };

    return value;
  };
};
