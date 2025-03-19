import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-openweathermap';

const WeatherMap = ({ coordinates, apiKey, theme }) => {
  const mapRef = useRef(null);
  const [currentLayer, setCurrentLayer] = useState('precipitation');
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});

  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(coordinates, 10);
      
      L.control.scale({
        position: 'bottomleft',
        imperial: false
      }).addTo(mapInstanceRef.current);

      const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      
      const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      });
      
      if (theme === 'dark') {
        darkLayer.addTo(mapInstanceRef.current);
      } else {
        baseLayer.addTo(mapInstanceRef.current);
      }

      layersRef.current = {
        precipitation: L.OWM.precipitation({ 
          appId: apiKey,
          opacity: 0.5,
          showLegend: true
        }),
        temperature: L.OWM.temperature({
          appId: apiKey,
          opacity: 0.5,
          showLegend: true
        }),
        wind: L.OWM.wind({
          appId: apiKey,
          opacity: 0.5,
          showLegend: true
        }),
        pressure: L.OWM.pressure({
          appId: apiKey,
          opacity: 0.5,
          showLegend: true
        }),
        clouds: L.OWM.clouds({
          appId: apiKey,
          opacity: 0.5,
          showLegend: true
        })
      };

      L.marker(coordinates).addTo(mapInstanceRef.current);

      L.control.layers(
        {
          'Claro': baseLayer,
          'Oscuro': darkLayer
        },
        {
          'Precipitación': layersRef.current.precipitation,
          'Temperatura': layersRef.current.temperature,
          'Viento': layersRef.current.wind,
          'Presión': layersRef.current.pressure,
          'Nubes': layersRef.current.clouds
        }
      ).addTo(mapInstanceRef.current);

      layersRef.current[currentLayer].addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView(coordinates, 10);
      
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      L.marker(coordinates).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
      }
    };
  }, [coordinates, apiKey]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    
    if (theme === 'dark') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstanceRef.current);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
  }, [theme]);

  const changeLayer = (layer) => {
    if (!mapInstanceRef.current || !layersRef.current) return;
    
    if (layersRef.current[currentLayer]) {
      mapInstanceRef.current.removeLayer(layersRef.current[currentLayer]);
    }
    
    layersRef.current[layer].addTo(mapInstanceRef.current);
    setCurrentLayer(layer);
  };

  return (
    <div className="relative h-full w-full" style={{ minHeight: '300px', borderRadius: '15px'}}>
      <div ref={mapRef} className="h-full w-full z-10"></div>
      
      <div className={`absolute bottom-8 left-8 z-20 flex flex-col gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        <div className={`p-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-sm font-semibold mb-2">Capas</div>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-2 py-1 text-xs rounded ${currentLayer === 'precipitation' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              onClick={() => changeLayer('precipitation')}
            >
              Precipitación
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${currentLayer === 'temperature' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              onClick={() => changeLayer('temperature')}
            >
              Temperatura
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${currentLayer === 'wind' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              onClick={() => changeLayer('wind')}
            >
              Viento
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${currentLayer === 'pressure' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              onClick={() => changeLayer('pressure')}
            >
              Presión
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${currentLayer === 'clouds' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              onClick={() => changeLayer('clouds')}
            >
              Nubes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;