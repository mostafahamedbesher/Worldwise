import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";

import { useCities } from "../Contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

// import { map } from "leaflet";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geolocationPosition) setMapPosition(geolocationPosition);
    },
    [geolocationPosition]
  );

  return (
    <section className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClicks />
      </MapContainer>
    </section>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClicks() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
