import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function MapView({ shops }) {
  const pts = shops.filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lng));
  const center = pts.length ? [pts[0].lat, pts[0].lng] : [25.0375, 121.5637]; // 台北市政府

  return (
    <div style={{ height:"65vh", borderRadius:12, overflow:"hidden", border:"1px solid #ddd" }}>
      <MapContainer center={center} zoom={12} style={{ height:"100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution='&copy; OpenStreetMap contributors' />
        {pts.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
            <Popup>
              <b>{s.name}</b><br/>
              地區：{s.area}<br/>
              評分：{s.rating ?? "—"}<br/>
              {s.mapUrl && <a href={s.mapUrl} target="_blank" rel="noreferrer">在 Google Maps 開啟</a>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
