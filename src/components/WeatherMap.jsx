import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-openweathermap';

const WeatherMap = ({ coordinates, apiKey }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    const map = L.map(mapRef.current).setView(coordinates, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const precipitation = L.OWM.precipitation({ appId: apiKey });
    precipitation.addTo(map);

    return () => {
      map.remove();
    };
  }, [coordinates, apiKey]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '15px' }}></div>;
};

export default WeatherMap;