import { useMemo, useState, useEffect } from "react";
import ShopCard from "./components/ShopCard";
import rawShops from "./data/shop.json";
import { getFavs, toggleFav, isFav } from "./utils/storage";
import {
  loadUserShops,
  addShop as dbAddShop,
  mergeUserShops,
  updateShop as dbUpdate,
  removeShop as dbRemove,
} from "./utils/db";
import ShopForm from "./components/ShopForm";
import MapView from "./components/MapView";
import ImportExport from "./components/ImportExport";

export default function App() {
  // 1) 先放 hooks
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rating-desc");
  const [favs, setFavs] = useState([]);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [userShops, setUserShops] = useState([]);

  useEffect(() => {
    setFavs(getFavs());
    setUserShops(loadUserShops());
  }, []);

  // 2) 依賴 userShops 的計算放在 hooks 之後
  const userIds = useMemo(() => new Set(userShops.map((s) => s.id)), [userShops]);

  const allShops = useMemo(() => [...rawShops, ...userShops], [userShops]);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    let data = allShops.filter(
      (s) =>
        (!kw || s.name.toLowerCase().includes(kw) || s.area.toLowerCase().includes(kw)) &&
        (!onlyFavs || favs.includes(s.id))
    );
    if (sort === "rating-desc") data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "rating-asc") data.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    if (sort === "name-asc") data.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
    return data;
  }, [q, sort, onlyFavs, favs, allShops]);

  const avg = useMemo(() => {
    if (!list.length) return "—";
    const sum = list.reduce((s, x) => s + (x.rating ?? 0), 0);
    return (sum / list.length).toFixed(2);
  }, [list]);

  // 3) handlers
  function handleToggleFav(id) {
    setFavs(toggleFav(id));
  }

  function handleAddShop(shop) {
    if ([...rawShops, ...userShops].some((s) => s.id === shop.id)) {
      alert("此 id 已存在，請換一個。");
      return;
    }
    setUserShops(dbAddShop(shop));
  }

  function handleMerge(incomingArray) {
    const { list, added, replaced } = mergeUserShops(incomingArray);
    setUserShops(list);
    return { added, replaced };
  }

  function handleDelete(id) {
    if (!userIds.has(id)) return alert("只能刪除你自己新增的店家");
    const ok = confirm("確定要刪除嗎？");
    if (!ok) return;
    setUserShops(dbRemove(id));
  }

  function handleEdit(id, patch) {
    if (!userIds.has(id)) return alert("只能編輯你自己新增的店家");
    setUserShops(dbUpdate(id, patch));
  }

  // 4) render
  return (
    <main style={{ padding: 24, background: "#fff", color: "#000" }}>
      <h1 style={{ marginTop: 0 }}>我的拉麵口袋名單</h1>

      <ImportExport userShops={userShops} onMerge={handleMerge} />

      <div style={{ display: "flex", gap: 12, marginTop: 12, marginBottom: 8, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋店名或地區"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 15, border: "1px solid #ccc" }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="rating-desc">評分：高 → 低</option>
          <option value="rating-asc">評分：低 → 高</option>
          <option value="name-asc">店名：A → Z</option>
        </select>
      </div>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={onlyFavs} onChange={(e) => setOnlyFavs(e.target.checked)} />
        只看收藏（{favs.length}）
      </label>

      <p style={{ marginTop: 8, color: "#444" }}>
        共 {list.length} 家　|　平均評分：{avg}
      </p>

      <MapView shops={allShops} />

      <div style={{ marginTop: 16 }}>
        {list.map((s) => (
          <ShopCard
            key={s.id}
            id={s.id}
            name={s.name}
            area={s.area}
            rating={s.rating}
            mapUrl={s.mapUrl}
            fav={isFav(s.id)}
            isUser={userIds.has(s.id)}
            onToggle={handleToggleFav}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <ShopForm onAdd={handleAddShop} />
    </main>
  );
}
