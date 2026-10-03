import { useState } from "react";

export default function ShopCard({
  id, name, area, rating, lat, lng, mapUrl,
  fav, isUser, onToggle, onDelete, onEdit
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name, area, rating, lat, lng, mapUrl });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function save() {
    const patch = {
      name: form.name.trim(),
      area: form.area.trim(),
      rating: form.rating === "" ? null : Number(form.rating),
      lat: form.lat === "" ? null : Number(form.lat),
      lng: form.lng === "" ? null : Number(form.lng),
      mapUrl: form.mapUrl?.trim() ?? ""
    };
    onEdit?.(id, patch);
    setEditing(false);
  }

  return (
    <div style={{
      border: "1px solid #ddd", padding: 16, marginBottom: 12,
      borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,.04)"
    }}>
      {/* 標題列 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>
          {mapUrl
            ? <a href={mapUrl} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "none" }}>{name}</a>
            : name}
        </h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onToggle(id)} style={btn}>{fav ? "💖 已收藏" : "🤍 收藏"}</button>
          {isUser && !editing && (
            <>
              <button onClick={() => setEditing(true)} style={btn}>編輯</button>
              <button onClick={() => onDelete(id)} style={btnDanger}>刪除</button>
            </>
          )}
        </div>
      </div>

      {!editing ? (
        <p style={{ margin: "8px 0 0 0", color: "#555" }}>
          地區：{area}　評分：{rating ?? "—"}
          {Number.isFinite(lat) && Number.isFinite(lng) && <>　/ 座標：{lat}, {lng}</>}
        </p>
      ) : (
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <label>店名<input value={form.name} onChange={e=>update("name", e.target.value)} /></label>
          <label>地區<input value={form.area} onChange={e=>update("area", e.target.value)} /></label>
          <label>評分<input type="number" step="0.1" value={form.rating ?? ""} onChange={e=>update("rating", e.target.value)} /></label>
          <label>緯度 lat<input type="number" step="any" value={form.lat ?? ""} onChange={e=>update("lat", e.target.value)} /></label>
          <label>經度 lng<input type="number" step="any" value={form.lng ?? ""} onChange={e=>update("lng", e.target.value)} /></label>
          <label style={{ gridColumn:"1 / -1" }}>Google Maps 連結
            <input value={form.mapUrl ?? ""} onChange={e=>update("mapUrl", e.target.value)} />
          </label>
          <div style={{ gridColumn:"1 / -1", display:"flex", gap:8 }}>
            <button onClick={save} style={btn}>儲存</button>
            <button onClick={() => { setForm({ name, area, rating, lat, lng, mapUrl }); setEditing(false); }} style={btn}>
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btn = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor:"pointer" };
const btnDanger = { ...btn, border: "1px solid #d33", color: "#d33" };
