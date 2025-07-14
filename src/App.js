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

  if (loading) {
    return <div id='main'><h2>Carregando dados do gráfico...</h2></div>;
  }

  if (error) {
    return <div id='main'><h2>Erro: {error}</h2></div>;
  }

  if (chartData.length === 0) {
    return <div id='main'><h2>Nenhum dado disponível para o gráfico</h2></div>;
  }


  return (
    <>
      <div id='main'>
        <div id='title'>
          <h1>Dopin in Professional Bicycle Racing</h1>
          <h2>35 Fastest times up Alpe d'Huez</h2>
        </div>
        <div id='bar-chart'>
          <Scatterplot data={chartData} width={900} height={600} />
        </div>
        <div id='legend'>
          <div class='legend-item'>
            <span>Riders with doping allegations</span>
            <div id='doping-positive'></div>
          </div>
          <div class='legend-item'>
            <span>No doping allegation</span>
            <div id='doping-negative'></div>
          </div>
        </div>
        <div id='tooltip' style={{ opacity: 0 }}></div>
      </div>

    </>
  );
}

export default App;
