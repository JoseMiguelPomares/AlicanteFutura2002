import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 38.341313,
  lng: -0.538899
};

export default function MapaWeb() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey // Sustituye por tu API Key real
  });

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}