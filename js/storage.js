const memory = new Map();
export function readLocal(key, fallback) {
  if (memory.has(key)) return memory.get(key);
  try { const value = localStorage.getItem(`escocia:${key}`); return value ? JSON.parse(value) : fallback; } catch { return memory.get(key) ?? fallback; }
}
export function writeLocal(key, value) {
  try { localStorage.setItem(`escocia:${key}`,JSON.stringify(value)); memory.delete(key); return true; } catch { memory.set(key,value); return false; }
}
export function favorites() { const value = readLocal('favorites',[]); return Array.isArray(value) ? value.filter(id => typeof id === 'string') : []; }
export function toggleFavorite(id) {
  const saved = new Set(favorites());
  saved.has(id) ? saved.delete(id) : saved.add(id);
  const persisted = writeLocal('favorites',[...saved]);
  return {saved:saved.has(id),persisted};
}
