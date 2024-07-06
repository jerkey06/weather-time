import React from "react";

const Weather = ({ data, theme }) => {
    if (!data.weather) return null;

    return (
        <div className="justify-center items-center h-full p-4">
            <div className={`w-full max-w-[500px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg rounded-xl p-6`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-semibold">{data.name}, {data.sys.country}</p>
                        <p className="text-lg">{data.weather[0].description}</p>
                    </div>
                    <img
                        src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                        alt="weather icon"
                        className="w-[100px]"
                    />
                </div>
                <div className="mt-4">
                    <h1 className="text-6xl font-bold">{data.main.temp.toFixed(0)}°C</h1>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p>Sensacion termica</p>
                        <p className="font-semibold">{data.main.feels_like.toFixed()}°C</p>
                    </div>
                    <div>
                        <p>Humedad</p>
                        <p className="font-semibold">{data.main.humidity}%</p>
                    </div>
                    <div>
                        <p>Viento</p>
                        <p className="font-semibold">{data.wind.speed.toFixed()} km/h</p>
                    </div>
                    <div>
                        <p>Presión</p>
                        <p className="font-semibold">{data.main.pressure} hPa</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
