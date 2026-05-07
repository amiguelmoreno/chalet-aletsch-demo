"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_COORDS, MAP_DIRECTIONS_URL } from "@/lib/map";

const peakMarker = L.divIcon({
  html: `
    <svg viewBox="0 0 40 48" width="36" height="44" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 0 C 9 0 0 9 0 20 C 0 32 20 48 20 48 C 20 48 40 32 40 20 C 40 9 31 0 20 0 Z"
            fill="#2A3F2C" stroke="#FBF8F1" stroke-width="1"/>
      <path d="M 8 26 L 20 10 L 32 26 Z" fill="#FBF8F1"/>
      <path d="M 14 22 L 20 14 L 26 22" fill="none" stroke="#2A3F2C" stroke-width="1"/>
    </svg>
  `,
  className: "chalet-marker",
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -42],
});

const CENTER: [number, number] = [MAP_COORDS.lat, MAP_COORDS.lng];

export function ContactMap({
  labels,
}: {
  labels: {
    popupTitle: string;
    popupAddress: string;
    popupHint: string;
    directionsLabel: string;
  };
}) {
  return (
    <div className="border border-ink-700/15 overflow-hidden bg-parchment-100">
      <style>{`
        .chalet-leaflet { background: #F4ECD8 !important; }
        .chalet-leaflet .leaflet-popup-content-wrapper {
          background: #FBF8F1; color: #1F1E18;
          border-radius: 0; border: 1px solid rgba(20, 19, 15, 0.2);
          box-shadow: 0 6px 24px -12px rgba(20, 19, 15, 0.4);
          font-family: var(--font-serif), Georgia, serif;
        }
        .chalet-leaflet .leaflet-popup-tip { background: #FBF8F1; }
        .chalet-leaflet .leaflet-control-attribution {
          background: rgba(251, 248, 241, 0.85); color: #5C5749;
          font-family: var(--font-serif), Georgia, serif;
        }
        .chalet-leaflet .leaflet-control-zoom a {
          background: #FBF8F1; color: #1F1E18;
          border-color: rgba(20, 19, 15, 0.2); border-radius: 0;
          font-family: var(--font-display), Georgia, serif; font-weight: 400;
        }
        .chalet-popup-link {
          display: inline-block;
          margin-top: 0.5rem;
          font-family: var(--font-serif), Georgia, serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2A3F2C;
          text-decoration: none;
          border-bottom: 1px solid rgba(42, 63, 44, 0.4);
          padding-bottom: 1px;
          transition: color 200ms, border-color 200ms;
        }
        .chalet-popup-link:hover {
          color: #A82A1F;
          border-bottom-color: rgba(168, 42, 31, 0.6);
        }
      `}</style>
      <MapContainer
        center={CENTER}
        zoom={13}
        scrollWheelZoom
        className="chalet-leaflet h-[460px] w-full"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={CENTER} icon={peakMarker}>
          <Popup>
            <div className="px-1 py-1">
              <p className="font-display italic text-lg text-ink-700">
                {labels.popupTitle}
              </p>
              <p className="text-sm mt-1 leading-relaxed">{labels.popupAddress}</p>
              <p className="text-xs italic text-ink-500 mt-2">{labels.popupHint}</p>
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="chalet-popup-link"
              >
                {labels.directionsLabel} →
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

