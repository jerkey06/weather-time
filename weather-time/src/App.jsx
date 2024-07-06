import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import Weather from './components/Weather';
import WeatherMap from './components/WeatherMap';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('light');
  const [coordinates, setCoordinates] = useState(null);
  const API_KEY = 'f9983b23412d9b6c7ed6d21c4ba563c0';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');

    const handleThemeChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    darkModeMediaQuery.addListener(handleThemeChange);

    return () => {
      darkModeMediaQuery.removeListener(handleThemeChange);
    };
  }, []);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      Axios.get(url)
        .then((response) => {
          setData(response.data);
          setCoordinates([response.data.coord.lat, response.data.coord.lon]);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
      setLocation('');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className='container mx-auto p-4'>
        <div className='mb-4'>
          <input 
            type="text" 
            className={`py-3 px-6 w-full text-lg rounded-3xl border-gray-200 placeholder:text-gray-400 focus:outline-none shadow-md ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={searchLocation}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/3'>
            <Weather data={data} theme={theme} />
          </div>
          <div className='w-full md:w-2/3 h-[calc(100vh-150px)]'>
            {coordinates && <WeatherMap coordinates={coordinates} apiKey={API_KEY} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;