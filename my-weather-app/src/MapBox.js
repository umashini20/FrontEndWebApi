import React from 'react';
import mapboxgl from 'mapbox-gl'; // Import Mapbox library
import axios from 'axios';

class Mapbox extends React.Component {
    state = {
        weatherData: null,
      };

  componentDidMount() {
    // Initialize Mapbox map
    mapboxgl.accessToken = 'pk.eyJ1IjoidW1hc2hpbmkyMDAwIiwiYSI6ImNsdWpsaTc2bDBoeDgybG8zMWp5djQyNWkifQ.LMa4KHYR_dNZVHvfMx5IjQ'; // Replace with your Mapbox access token
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [79.8612, 6.9271], // Initial center of the map
      zoom: 10 // Initial zoom level
    });

    // Add click event listener to the map
    map.on('click', async (e) => {
      const { lngLat } = e;
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:3500/weather/${lngLat.lat}/${lngLat.lng}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          );
          console.log('Response data:', response.data);

        const nearestDataPoint = this.findNearestDataPoint(response.data, lngLat.lat, lngLat.lng);
        console.log('Nearest data point:', nearestDataPoint);
        this.setState({ weatherData: nearestDataPoint});
        console.log('Weather data:', response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    });
  }

findNearestDataPoint(data, lat, lng) {
  let nearestPoint = null;
  let minDistance = Number.MAX_VALUE;

  // Check if data is an array or object
  if (Array.isArray(data)) {
    data.forEach(point => {
      const distance = this.calculateDistance(lat, lng, point.latitude, point.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    });
  } else if (typeof data === 'object') {
    // Handle single data object
    nearestPoint = data;
  } else {
    console.error('Unexpected data format:', data);
    return null;
  }

  return nearestPoint;
}

  calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = this.degreesToRadians(lat1);
    const lon1Rad = this.degreesToRadians(lon1);
    const lat2Rad = this.degreesToRadians(lat2);
    const lon2Rad = this.degreesToRadians(lon2);
  
    // Calculate differences
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;
  
    // Calculate distance using Haversine formula
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance; // Distance in kilometers
  }
  
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  renderWeatherInfo() {
    const { weatherData } = this.state;
    if (!weatherData) return null;

    return (
      <div className="weather-info">
        <h3>Weather Information</h3>
        <p>Temperature: {weatherData.temperature}</p>
        <p>Humidity: {weatherData.humidity}</p>
        <p>Air Pressure: {weatherData.airPressure}</p>
      </div>
    );
  }

  render() {
    return (
      <div id="map" style={{ width: '100%', height: '800px' }}>
        {this.renderWeatherInfo()}
      </div>
    );
  }
}

export default Mapbox;