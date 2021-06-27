import React, { useEffect, useState } from "react";
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core"
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCounty] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    fetch ("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCounty(countryCode);

    const url = countryCode ==='worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    fetch(url)
    .then(response => response.json())
    .then(data => {
      setCounty(countryCode);
      setCountryInfo(data);
    })
    console.log(countryCode)
    console.log("Country Info >>> ", countryInfo)
  }
  // console.log(countryCode)
  // console.log("Country Info >>> ", countryInfo)

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          {/*Header */}
          {/*Title + Select input dropdown field */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select varient="outlined" 
              onChange={onCountryChange}
              value={country}>
              {/*Loop through all the countries and show a drop down list*/}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          {/*InfoBoxs title="Coronavirus cases"*/}
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          {/*InfoBoxs title="Coronavirus recoveries"*/}
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          {/*InfoBoxs title="Coronavirus deaths"*/}
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

        {/*Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType}
        />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          {/*Table */}
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          {/*Graph */}
          <LineGraph />
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
