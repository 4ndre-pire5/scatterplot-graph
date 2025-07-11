import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './App.css';
import Scatterplot from './Scatterplot';

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

function App() {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async() => {
      try {
        const response = await d3.json(DATA_URL);

        const formattedData = response.map(item => ({
          time: item.Time,
          place: item.Place,
          seconds: item.Seconds,
          name: item.Name,
          year: item.Year,
          nationality: item.Nationality,
          doping: item.Doping,
          url: item.URL
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        setError("Não foi possível carregar os dados do gráfico.");
        setLoading(false);
      }  
    };
    fetchData();
  }, []);

  return (
    <>
      <div id='main'>
        <div id='title'>
          <h1>Dopin in Professional Bicycle Racing</h1>
          <h2>35 Fastest times up Alpe d'Huez</h2>
        </div>
        <div id='bar-chart'>
          <Scatterplot data={chartData} width={800} height={500} />
        </div>
        <div id='legend'></div>
        <div id='tooltip' style={{ opacity: 0 }}></div>
      </div>

    </>
  );
}

export default App;
