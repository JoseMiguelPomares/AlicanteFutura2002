import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

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
    googleMapsApiKey: "AIzaSyAf_ZTJFgLPkhdyodF3caPWIaK9Dwzfb-4" // Sustituye por tu API Key real
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