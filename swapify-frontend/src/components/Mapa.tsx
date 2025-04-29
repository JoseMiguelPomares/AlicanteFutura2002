import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export default function Mapa() {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{width: '100%', height: '100%'}}
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
      />
    </APIProvider>
  );
}