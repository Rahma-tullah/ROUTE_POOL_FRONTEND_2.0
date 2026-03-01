// src/components/BatchMap.jsx
import { useEffect, useRef, useState } from "react";

// Status colours matching the app design
const STATUS_COLOR = {
  pending: "#9CA3AF", // gray
  in_transit: "#16A34A", // orange
  delivered: "#16A34A", // green
};

// Fetch optimised driving route from OSRM (free, no key)
const fetchRoute = async (coords) => {
  // coords: [[lng, lat], [lng, lat], ...]
  const coordStr = coords.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== "Ok") throw new Error("Routing failed");
  return data.routes[0].geometry.coordinates; // [[lng, lat], ...]
};

export default function BatchMap({ deliveries, onClose }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | no_coords | error
  const [errorMsg, setErrorMsg] = useState("");

  const withCoords = deliveries.filter(
    (d) => d.latitude != null && d.longitude != null,
  );

  useEffect(() => {
    if (withCoords.length === 0) {
      setStatus("no_coords");
      return;
    }

    // Dynamically load Leaflet CSS + JS
    const loadLeaflet = () =>
      new Promise((resolve, reject) => {
        if (window.L) return resolve(window.L);

        // CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.head.appendChild(script);
      });

    let map = null;

    loadLeaflet()
      .then(async (L) => {
        if (!mapRef.current || mapInstance.current) return;

        // Fix default icon paths broken by bundlers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Init map
        map = L.map(mapRef.current, { zoomControl: true });
        mapInstance.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add numbered, coloured markers per delivery
        const bounds = [];
        withCoords.forEach((d, i) => {
          const lat = parseFloat(d.latitude);
          const lng = parseFloat(d.longitude);
          bounds.push([lat, lng]);

          const color = STATUS_COLOR[d.status] || STATUS_COLOR.pending;

          // Custom SVG pin with stop number
          const svgIcon = L.divIcon({
            className: "",
            html: `
              <div style="position:relative;width:32px;height:42px;">
                <svg viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" width="32" height="42">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z"
                    fill="${color}" stroke="white" stroke-width="2"/>
                  <circle cx="16" cy="16" r="9" fill="white"/>
                  <text x="16" y="20.5" text-anchor="middle"
                    font-family="system-ui,sans-serif" font-size="10" font-weight="700"
                    fill="${color}">${i + 1}</text>
                </svg>
              </div>`,
            iconSize: [32, 42],
            iconAnchor: [16, 42],
            popupAnchor: [0, -42],
          });

          const statusLabel = d.status?.replace("_", " ") || "pending";
          L.marker([lat, lng], { icon: svgIcon }).addTo(map).bindPopup(`
              <div style="font-family:system-ui,sans-serif;min-width:160px;">
                <p style="font-weight:700;margin:0 0 4px">${i + 1}. ${d.customer_name}</p>
                <p style="color:#6B7280;font-size:12px;margin:0 0 2px">${d.address}</p>
                ${d.customer_phone ? `<p style="color:#6B7280;font-size:12px;margin:0 0 4px">${d.customer_phone}</p>` : ""}
                <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;
                  background:${color}22;color:${color};">${statusLabel}</span>
              </div>`);
        });

        // Fit map to markers
        map.fitBounds(bounds, { padding: [40, 40] });

        // Draw OSRM route if 2+ stops
        if (withCoords.length >= 2) {
          try {
            const osrmCoords = withCoords.map((d) => [
              parseFloat(d.longitude),
              parseFloat(d.latitude),
            ]);
            const routeCoords = await fetchRoute(osrmCoords);
            // OSRM returns [lng, lat], Leaflet wants [lat, lng]
            const latLngs = routeCoords.map(([lng, lat]) => [lat, lng]);
            L.polyline(latLngs, {
              color: "#16A34A",
              weight: 4,
              opacity: 0.8,
              dashArray: null,
            }).addTo(map);
          } catch (e) {
            console.warn("OSRM routing failed, showing pins only:", e.message);
          }
        }

        setStatus("ready");
      })
      .catch((e) => {
        setErrorMsg(e.message);
        setStatus("error");
      });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(95vw, 860px)", height: "min(90vh, 620px)" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="font-extrabold text-gray-900">Delivery Route</h2>
            <p
              className="text-xs text-gray-400 mt-0.5"
              style={{ fontFamily: "var(--font-mono)" }}>
              {withCoords.length} of {deliveries.length} stops geocoded
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
              hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-4 px-5 py-2 border-b text-xs font-medium"
          style={{ borderColor: "var(--border)", background: "#FAFAF9" }}>
          {[
            ["pending", "#9CA3AF", "Pending"],
            ["in_transit", "#16A34A", "In Transit"],
            ["delivered", "#16A34A", "Delivered"],
          ].map(([, color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <span
              className="w-6 h-0.5 flex-shrink-0 rounded"
              style={{ background: "#16A34A" }}
            />
            <span className="text-gray-500">Route</span>
          </div>
        </div>

        {/* Map / state */}
        <div className="flex-1 relative">
          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
              <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
              <p className="text-sm text-gray-400">Loading map…</p>
            </div>
          )}
          {status === "no_coords" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <p className="text-gray-600 font-semibold">
                No coordinates available
              </p>
              <p className="text-sm text-gray-400 text-center max-w-xs">
                Deliveries need lat/lng to show on the map. They are geocoded
                automatically when created — try recreating them.
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <p className="text-red-600 font-semibold">Map failed to load</p>
              <p className="text-sm text-gray-400">{errorMsg}</p>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ visibility: status === "ready" ? "visible" : "hidden" }}
          />
        </div>

        {/* Stop list */}
        {withCoords.length > 0 && (
          <div
            className="border-t overflow-x-auto"
            style={{ borderColor: "var(--border)" }}>
            <div className="flex gap-0 min-w-max">
              {withCoords.map((d, i) => {
                const color = STATUS_COLOR[d.status] || STATUS_COLOR.pending;
                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 px-4 py-3 border-r text-sm min-w-[180px]"
                    style={{ borderColor: "var(--border)" }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: color }}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {d.customer_name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {d.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
