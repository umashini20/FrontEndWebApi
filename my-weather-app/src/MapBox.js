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
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.7, 7.9], // Centered on Sri Lanka
      zoom: 2, // Adjust the zoom level as needed
      maxBounds: [[79.0, 5.9], [82.5, 10.2]]
    });

    // Calculate the bounding box for Sri Lanka
  const sriLankaBounds = [[79.0, 5.9], [82.5, 10.2]];

  // Set the map center and zoom level to fit Sri Lanka within the map
  this.map.fitBounds(sriLankaBounds, {
    padding: { top: 50, bottom: 50, left: 50, right: 50 } // Add padding to ensure some space around Sri Lanka
  });
    // Add click event listener to the map
    this.map.on('click', this.handleMapClick);
   
    // Schedule updates every five seconds
    this.updateWeatherInterval = setInterval(this.updateWeatherData, 5000);
  }

  componentWillUnmount() {
    // Remove event listener when component is unmounted
    this.map.off('click', this.handleMapClick);
    this.map = null; // Clear the map reference
    clearInterval(this.updateWeatherInterval); // Clear the interval when the component unmounts
  }
  updateWeatherData = async () => {
    try {
      // Fetch districts from the weather API
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3500/weather', {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });

      // Check if the response contains districts
      if (!response.data || response.data.length === 0) {
          console.log('No districts found.');
          return;
      }

      // Select a random district from the response
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const randomDistrict = response.data[randomIndex];

      // Generate random values for temperature, humidity, and air pressure
      const randomTemperature = (Math.random() * 30 + 20).toFixed(2);
      const randomHumidity = (Math.random() * 60 + 40).toFixed(2);
      const randomAirPressure = (Math.random() * 20 + 980).toFixed(2);

      // Send PUT request to update weather data for the random district
      await axios.put(`http://localhost:3500/weather/${randomDistrict.latitude}/${randomDistrict.longitude}`, {
          temperature: randomTemperature,
          humidity: randomHumidity,
          airPressure: randomAirPressure
      }, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });

      console.log(`Weather data updated successfully for ${randomDistrict.district}.`);
  } catch (error) {
      console.error('Error updating weather data:', error);
  }
  };
  
  handleMapClick = async (e) => {
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

      new mapboxgl.Marker()
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(this.map)
      .setPopup(new mapboxgl.Popup().setHTML(this.renderWeatherInfo()))
      .addTo(this.map);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

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
      `<div class="weather-info">
      <h3>Weather Information</h3>
      <p>Temperature: ${weatherData.temperature}</p>
      <p>Humidity: ${weatherData.humidity}</p>
      <p>Air Pressure: ${weatherData.airPressure}</p>
    </div>`
    );
  }

  render() {
    return (
      <div style={{ width: '80%', margin: '0 auto' }}>
          <div id="map" style={{ width: '100%', height: '2000px'}} />
      </div>
    );
  }
}

export default Mapbox;