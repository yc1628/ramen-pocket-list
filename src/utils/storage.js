const KEY = "ramen_favs";

export function getFavs() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}
export function setFavs(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}
export function toggleFav(id) {
  const favs = new Set(getFavs());
  favs.has(id) ? favs.delete(id) : favs.add(id);
  setFavs([...favs]);
  return [...favs];
}
export function isFav(id) {
  return getFavs().includes(id);
}
