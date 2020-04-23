import React, { useState, useEffect } from "react";
import axios from "axios";

import CountryDetail from "./components/CountryDetail";

const App = () => {
  const [countryKeyword, updateCountryKeyword] = useState("");
  const [filteredCountries, updateFilteredCountries] = useState([]);
  const [countries, updateCountries] = useState([]);

  const hook = () => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      updateCountries(response.data);
    });
  };

  useEffect(hook, []);

  const onCountryChange = (e) => {
    const targetCountry = e.target.value;
    updateCountryKeyword(targetCountry);
    filterCountries(targetCountry);
  };

  const filterCountries = (targetCountry) => {
    const filtered = countries.filter((country) => {
      return country.name
        .toLocaleLowerCase()
        .includes(targetCountry.toLocaleLowerCase());
    });
    updateFilteredCountries(filtered);
  };

  const onSelectCountry = (country) => {
    filterCountries(country);
  };

  const renderCountry = () => {
    if (countryKeyword === "") {
      return;
    } else if (filteredCountries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    } else if (filteredCountries.length === 1) {
      const targetCountry = filteredCountries[0];
      return <CountryDetail targetCountry={targetCountry} />;
    } else {
      return filteredCountries.map((country) => (
        <div key={country.alpha3Code}>
          {country.name}
          <button onClick={() => onSelectCountry(country.name)}>show</button>
        </div>
      ));
    }
  };

  return (
    <div>
      <div>
        find countreis{" "}
        <input value={countryKeyword} onChange={onCountryChange} />
      </div>
      <div>{renderCountry()}</div>
    </div>
  );
};

export default App;
