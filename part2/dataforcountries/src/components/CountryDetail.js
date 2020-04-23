import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryDetail = ({ targetCountry }) => {
  const [weatherData, updateWeatherData] = useState(null);

  const hook = () => {
    axios
      .get("http://api.weatherstack.com/current", {
        params: {
          access_key: process.env.REACT_APP_WEATHER_API_KEY,
          query: targetCountry.capital,
        },
      })
      .then((response) => {
        updateWeatherData(response.data);
      });
  };

  useEffect(hook, []);

  if (!weatherData) {
    return null;
  }
  return (
    <div>
      <h2>{targetCountry.name}</h2>
      <div>capital {targetCountry.capital}</div>
      <div>population {targetCountry.population}</div>
      <h3>languages</h3>
      <ul>
        {targetCountry.languages.map((language) => (
          <li key={language.iso639_2}>{language.name}</li>
        ))}
      </ul>
      <img
        src={targetCountry.flag}
        alt={`flag of ${targetCountry.name}`}
        className="flag"
      />
      <h3>Weather in {weatherData.location.name}</h3>
      <div>temperature: {weatherData.current.temperature} Celcius</div>
      <img src={weatherData.current.weather_icons} alt="Weather Icon" />
      <div>
        wind: {weatherData.current.wind_speed} mph direction{" "}
        {weatherData.current.wind_dir}
      </div>
    </div>
  );
};

export default CountryDetail;
