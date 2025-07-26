// import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix Leaflet's missing marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// function LocationMarker({ position, onLocationChange }) {
//   const map = useMap();

//   // Center and zoom when position changes
//   useEffect(() => {
//     if (position) {
//       map.setView(position, 13); // Zoom to level 13
//     }
//   }, [position, map]);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       onLocationChange({ lat, lon: lng });
//     },
//   });

//   return position ? <Marker position={position} /> : null;
// }

// function MapView({ position, onLocationChange }) {
//   return (
//     <MapContainer
//       center={position || [20.5937, 78.9629]}
//       zoom={5}
//       scrollWheelZoom={true}
//       className="h-64 w-full rounded shadow z-0"
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//       />
//       <LocationMarker position={position} onLocationChange={onLocationChange} />
//     </MapContainer>
//   );
// }

// export default MapView;

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, onLocationChange, userInteracted }) {
  const map = useMap();

  // Center and zoom only if user selected a location
  useEffect(() => {
    if (position && userInteracted) {
      map.setView(position, 13); // Zoom in only after interaction
    }
  }, [position, map, userInteracted]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange({ lat, lon: lng }, true); // mark as interacted
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapView({ position, onLocationChange, userInteracted }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India coordinates
      zoom={5} // Default India view
      scrollWheelZoom={true}
      className="h-64 w-full rounded shadow z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />
      <LocationMarker
        position={position}
        onLocationChange={onLocationChange}
        userInteracted={userInteracted}
      />
    </MapContainer>
  );
}

export default MapView;
