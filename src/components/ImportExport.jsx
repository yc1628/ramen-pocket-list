import { useRef, useState } from "react";

export default function ImportExport({ userShops, onMerge }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  // 匯出：下載目前的 userShops.json
  function handleExport() {
    const data = JSON.stringify(userShops, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.download = `ramen-user-shops-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 匯入：選檔 → 讀文字 → 解析 JSON → onMerge
  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 清除 input value，方便連續選同一檔
    if (!file) return;

    setBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        alert("檔案格式錯誤：應該是陣列(Array)。");
        return;
      }

      // 基本清洗與檢核：至少要有 id 與 name
      const cleaned = parsed
        .filter(x => x && typeof x === "object")
        .map(x => ({
          id: String(x.id ?? "").trim(),
          name: String(x.name ?? "").trim(),
          area: x.area ?? "",
          rating: x.rating ?? null,
          lat: typeof x.lat === "number" ? x.lat : null,
          lng: typeof x.lng === "number" ? x.lng : null,
          mapUrl: x.mapUrl ?? "",
          labels: Array.isArray(x.labels) ? x.labels : []
        }))
        .filter(x => x.id && x.name);

      if (cleaned.length === 0) {
        alert("檔案沒有有效的店家資料（至少要含 id 與 name）。");
        return;
      }

      const result = onMerge(cleaned); // 交給父層做合併與保存，回傳 {added, replaced}
      alert(`匯入完成：新增 ${result.added} 筆，覆蓋 ${result.replaced} 筆。`);
    } catch (err) {
      console.error(err);
      alert("匯入失敗：檔案不是合法的 JSON。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <button onClick={handleExport} style={btnStyle}>匯出 JSON</button>
      <button onClick={() => fileRef.current?.click()} style={btnStyle} disabled={busy}>
        {busy ? "匯入中…" : "匯入 JSON"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={handleImportFile}
      />
      <small style={{ color: "#666" }}>（僅包含你自己新增的店家）</small>
    </div>
  );
}

const btnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer"
};
