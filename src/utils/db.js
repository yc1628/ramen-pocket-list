const SHOPS_KEY = "ramen_shops_user_added";

export function loadUserShops() {
  try { return JSON.parse(localStorage.getItem(SHOPS_KEY)) ?? []; }
  catch { return []; }
}
export function saveUserShops(list) {
  localStorage.setItem(SHOPS_KEY, JSON.stringify(list));
}
export function addShop(shop) {
  const list = loadUserShops();
  list.push(shop);
  saveUserShops(list);
  return list;
}
export function removeShop(id) {
  const list = loadUserShops().filter(s => s.id !== id);
  saveUserShops(list);
  return list;
}
export function updateShop(id, patch) {
  const list = loadUserShops();
  const i = list.findIndex(s => s.id === id);
  if (i === -1) return list;               // 不在 userShops 就不處理
  list[i] = { ...list[i], ...patch };      // 局部更新
  saveUserShops(list);
  return list;
}
/** 合併：同 id 覆蓋；回傳 { list, added, replaced } */
export function mergeUserShops(incoming) {
  const map = new Map(loadUserShops().map(s => [s.id, s]));
  let added = 0, replaced = 0;
  for (const x of incoming) {
    if (map.has(x.id)) { map.set(x.id, { ...map.get(x.id), ...x }); replaced++; }
    else { map.set(x.id, x); added++; }
  }
  const list = [...map.values()];
  saveUserShops(list);
  return { list, added, replaced };
}
