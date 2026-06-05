import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { pinColor } from '../lib/pinColors'

function makePinIcon(color, size = 10) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid rgba(255,255,255,0.3);
      box-shadow:0 0 8px ${color}99,0 0 16px ${color}44;
    "></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2 + 4)],
  })
}

export default function PinMap({ pins = [], height = '42vh' }) {
  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxBounds={[[-85, -180], [85, 180]]}
        style={{ height, width: '100%', background: '#09090f' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {pins.map(pin => {
          const color = pinColor(pin.id)
          return (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={makePinIcon(color)}>
              {pin.label && (
                <Popup>
                  <span style={{ color: '#e8eaf0', fontSize: '12px', fontWeight: 600 }}>
                    {pin.label}
                  </span>
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>
      <style>{`
        .leaflet-container { font-family: inherit; }
        .leaflet-control-zoom a {
          background: #12141c !important; color: #6b7280 !important;
          border-color: #252836 !important;
        }
        .leaflet-control-zoom a:hover { color: #e8eaf0 !important; }
        .leaflet-control-attribution {
          background: rgba(9,9,15,0.7) !important; color: #6b7280 !important;
        }
        .leaflet-control-attribution a { color: #6b7280 !important; }
        .leaflet-popup-content-wrapper {
          background: #12141c !important; border: 1px solid #252836 !important;
          border-radius: 8px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important;
        }
        .leaflet-popup-tip { background: #12141c !important; }
      `}</style>
    </>
  )
}
