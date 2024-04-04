// MapPage.js
import React from 'react';
import Mapbox from './MapBox';

function MapPage() {
  return (
    <div>
  <h2 style={{ textAlign: 'center' }}>Map</h2>
  <div style={{ textAlign: 'left', marginLeft: '20px' }}>
    <p>Please click the map to get the weather data</p>
  </div>
  <Mapbox />
</div>
  );
}

export default MapPage;