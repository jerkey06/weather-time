import { useState } from 'react'
import weatherIcon from './assets/weather-icon.svg'
import './App.css'

function App() {
  const [temperature, setTemperature] = useState(0)
  const [location, setLocation] = useState('')

  const fetchWeatherData = () => {
    // Simulating API call to fetch weather data
    setTimeout(() => {
      setTemperature(25)
      setLocation('New York')
    }, 2000)
  }

  return (
    <>
      <div>
        <img src={weatherIcon} className="logo" alt="Weather icon" />
      </div>
      <h1>Weather Time</h1>
      <div className="card">
        <button onClick={fetchWeatherData}>Get Weather</button>
        <p>
          Temperature in {location}: {temperature}°C
        </p>
      </div>
      <p className="read-the-docs">
        Click the button to fetch weather data
      </p>
    </>
  )
}

export default App
