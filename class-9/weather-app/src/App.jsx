import { useState } from "react";
import { describeWeatherCode, getWeatherIcon } from "./utils/weatherCode.js";



function App() {
  const [city, setCity] = useState("Dhaka");
  const [cityInput, setCityInput] = useState(city);
  const [latLong, setLatLong] = useState({
    lat: 0,
    long: 0,
  });
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (cityInput) {
      setCity(cityInput);

      setIsLoading(true);
      const result = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1`
      )
        .then((res) => res.json());

      setLatLong({
        lat: result?.results?.[0]?.latitude,
        long: result?.results?.[0]?.longitude,
      });

      getWeather(latLong);
    }
  };

  const getWeather = async (latLong) => {    
     const result = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latLong.lat}&longitude=${latLong.long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min`
      )
        .then((res) => res.json());
        
      setWeather(result);

      setIsLoading(false);

      console.log("result", result);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full p-5">
        <div className="text-[48px] font-bold text-white">Weather App</div>

        {/* Search Input */}
        <div className="w-[600px] border border-gray-600 rounded-md">
          <div className="flex space-x-3 items-center justify-between w-full p-5">
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              type="text"
              placeholder="Search for a city"
              className="w-full p-2 border border-gray-600 rounded-md"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-md w-[150px] cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        <div className="text-white">{isLoading ? "Loading ..." : ""}</div>

        {/* current weather */}
        
        <div className="text-white">
          {weather?.current ? (
            <>
              <div>
                Temperature: {weather?.current?.temperature_2m}°C
              </div>
              <div>
                Humidity: {weather?.current?.relative_humidity_2m}%
              </div>
              <div>
                Wind Speed: {weather?.current?.wind_speed_10m} m/s
              </div>
              <div>
                Apparent Temperature: {weather?.current?.apparent_temperature}°C
              </div>
              <div>
                Weather Code: {weather?.current?.weather_code}
              </div>
              <div>
                {describeWeatherCode(weather?.current?.weather_code)}
              </div>

              <div>
                icon: {getWeatherIcon(weather?.current?.weather_code)}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default App;
