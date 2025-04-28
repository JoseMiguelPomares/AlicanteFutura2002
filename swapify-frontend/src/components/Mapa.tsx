import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';

export default function Mapa() {
  return (
    <APIProvider apiKey={'AIzaSyBW87uGfb05mWrsuS_SUq-gT51Cg36WunQ'}>
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