const memoryCache = new Map<string, { expiresAt: number; value: unknown }>();

type CacheStorageWithDefault = CacheStorage & { default?: Cache };

const cachesApi = (globalThis as { caches?: CacheStorageWithDefault }).caches;

const getDefaultCache = (): Cache | undefined => {
  if (!cachesApi) {
    return undefined;
  }
  if ('default' in cachesApi && cachesApi.default) {
    return cachesApi.default;
  }
  return undefined;
};

const createRequest = (key: string) => new Request(`https://cache.local/${encodeURIComponent(key)}`);

export async function readCache<T>(key: string): Promise<T | null> {
  const defaultCache = getDefaultCache();
  if (defaultCache) {
    try {
      const match = await defaultCache.match(createRequest(key));
      if (!match) {
        return null;
      }
      const text = await match.text();
      if (!text) {
        return null;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      console.warn('[token-cache] read failed, falling back to memory', error);
    }
  }

  const entry = memoryCache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function writeCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const defaultCache = getDefaultCache();
  if (defaultCache) {
    try {
      const headers = new Headers({
        'cache-control': `max-age=${ttlSeconds}`,
        'content-type': 'application/json',
      });
      const response = new Response(JSON.stringify(value), { headers });
      await defaultCache.put(createRequest(key), response);
      return;
    } catch (error) {
      console.warn('[token-cache] write failed, storing in memory', error);
    }
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  resolver: () => Promise<T>,
): Promise<T> {
  const cached = await readCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await resolver();
  await writeCache(key, value, ttlSeconds);
  return value;
}

export function clearMemoryCache(): void {
  memoryCache.clear();
}
