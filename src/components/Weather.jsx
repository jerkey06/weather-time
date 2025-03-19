import React from "react";

const Weather = ({ data, theme, loading }) => {
    if (loading || !data.weather) {
        return null;
    }

    const formatTime = (timestamp, timezone) => {
        const date = new Date((timestamp + timezone) * 1000);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getWindDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg rounded-xl p-6 transition-all duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-2xl font-semibold">{data.name}, {data.sys.country}</p>
                    <p className="text-lg capitalize">{data.weather[0].description}</p>
                </div>
                <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    className="w-[100px]"
                />
            </div>
            <div className="mt-4">
                <h1 className="text-6xl font-bold">{data.main.temp.toFixed(0)}°C</h1>
                <p className="text-sm">Máx: {data.main.temp_max.toFixed(0)}°C | Mín: {data.main.temp_min.toFixed(0)}°C</p>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">Amanecer</p>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">🌅</span>
                        <p>{formatTime(data.sys.sunrise, data.timezone)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">Atardecer</p>
                    <div className="flex items-center">
                        <span className="text-orange-500 mr-1">🌇</span>
                        <p>{formatTime(data.sys.sunset, data.timezone)}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">Humedad</p>
                    <p>{data.main.humidity}%</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">Viento</p>
                    <p>{data.wind.speed} m/s {getWindDirection(data.wind.deg)}</p>
                </div>
            </div>
        </div>
    );
};

export default Weather;
