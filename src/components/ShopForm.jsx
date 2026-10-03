import { useState } from "react";

export default function ShopForm({ onAdd }) {
  const [form, setForm] = useState({
    id: "", name: "", area: "", rating: "", lat: "", lng: "", mapUrl: ""
  });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.id || !form.name || !form.area) { alert("請填 id、店名、地區"); return; }
    const rating = form.rating === "" ? null : Number(form.rating);
    const lat = form.lat === "" ? null : Number(form.lat);
    const lng = form.lng === "" ? null : Number(form.lng);
    onAdd({ ...form, rating, lat, lng });
    setForm({ id: "", name: "", area: "", rating: "", lat: "", lng: "", mapUrl: "" });
  }

  return (
    <form onSubmit={submit} style={{ border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12 }}>
      <h3 style={{ marginTop:0 }}>新增店家</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <label>id（唯一）<input value={form.id} onChange={e=>update("id", e.target.value)} required/></label>
        <label>店名<input value={form.name} onChange={e=>update("name", e.target.value)} required/></label>
        <label>地區<input value={form.area} onChange={e=>update("area", e.target.value)} required/></label>
        <label>評分（可空）<input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e=>update("rating", e.target.value)} /></label>
        <label>緯度 lat（可空）<input type="number" step="any" value={form.lat} onChange={e=>update("lat", e.target.value)} /></label>
        <label>經度 lng（可空）<input type="number" step="any" value={form.lng} onChange={e=>update("lng", e.target.value)} /></label>
        <label style={{ gridColumn:"1 / -1" }}>Google Maps 連結（可空）
          <input value={form.mapUrl} onChange={e=>update("mapUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
        </label>
      </div>
      <div style={{ marginTop:12 }}>
        <button type="submit" style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer" }}>新增</button>
      </div>
    </form>
  );
}
