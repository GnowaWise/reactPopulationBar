import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChartRace = ({ populationCSV }) => {
  const [year, setYear] = useState(1950);
  const [intervalId, setIntervalId] = useState(null);
  const [populationData, setPopulationData] = useState([]);
  const [previousPopulationData, setPreviousPopulationData] = useState([]);
  const [sortedCountries, setSortedCountries] = useState([]);
  const [animatedPopulations, setAnimatedPopulations] = useState([]);
  const [countryColors, setCountryColors] = useState({});
  const [worldPopulation, setWorldPopulation] = useState([{world: 0,population: 0}]);
  const animationRef = useRef(null);
  const chartRef = useRef(null);

  const nbr = 10;
  const minYear = 1950;
  const maxYear = 2021;

  const colorMap = {
    'A': '#FF6B6B', 'B': '#4ECDC4', 'C': '#45B7D1', 'D': '#FFA07A',
    'E': '#7FDBFF', 'F': '#FF85A2', 'G': '#66CC66', 'H': '#FFD700',
    'I': '#FF69B4', 'J': '#20B2AA', 'K': '#8A2BE2', 'L': '#00CED1',
    'M': '#FF7F50', 'N': '#9370DB', 'O': '#32CD32', 'P': '#FF1493',
    'Q': '#00FA9A', 'R': '#F08080', 'S': '#1E90FF', 'T': '#FF6347',
    'U': '#7B68EE', 'V': '#00FF7F', 'W': '#FF4500', 'X': '#DA70D6',
    'Y': '#FFD700', 'Z': '#40E0D0'
  };

  useEffect(() => {
    const myJSONParse = JSON.parse(JSON.stringify(populationCSV).replaceAll('Country name', 'countryName'));
    getData(year, myJSONParse);
  }, [year, populationCSV]);

  useEffect(() => {
    if (populationData.length > 0) {
      animatePopulations();
    }
  }, [populationData]);

  function getData(year, data) {
    let output = data
      .filter(item => item.Year === `${year}` && !item.countryName.includes("(UN)") && !item.countryName.includes("region") && !item.countryName.includes("countries"))
      .map(item => ({ country: item.countryName, population: Number(item.Population), color: colorMap[item.countryName[0].toUpperCase()] || '#CCCCCC' }));

    output.sort((a, b) => b.population - a.population);
    setPreviousPopulationData(populationData);
    setPopulationData(output.slice(1, nbr));
    setSortedCountries(output.slice(1, nbr).map(item => item.country));
    setAnimatedPopulations(output.slice(1, nbr).map(item => ({ ...item, animatedPopulation: item.population })));
    setWorldPopulation(output.slice(0, 1));

    const newCountryColors = {};
    output.slice(0, nbr).forEach(item => {
      newCountryColors[item.country] = item.color;
    });
    setCountryColors(newCountryColors);
  }

  const animatePopulations = () => {
    let start;
    const duration = 1000;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      const newAnimatedPopulations = populationData.map((item, index) => {
        const prevPopulation = previousPopulationData[index]?.population || 0;
        const diff = item.population - prevPopulation;
        const animatedPopulation = prevPopulation + diff * progress;
        return { ...item, animatedPopulation };
      });

      setAnimatedPopulations(newAnimatedPopulations);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  const startIncrementing = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setYear(prevYear => {
          const nextYear = prevYear + 1;
          return nextYear <= maxYear ? nextYear : (clearInterval(id), prevYear);
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopIncrementing = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const reset = () => {
    setYear(minYear);
    setPreviousPopulationData([]);
    stopIncrementing();
  };

  const handleSliderChange = (event) => {
    const newYear = parseInt(event.target.value);
    setYear(newYear);
    stopIncrementing(); // Stop auto-increment when manually changing the year
  };

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Population by Country in ${year} (${worldPopulation[0].country} Population is ${worldPopulation[0].population.toLocaleString()})`,
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        formatter: (value, context) => {
          const animatedValue = animatedPopulations[context.dataIndex]?.animatedPopulation || 0;
          return Math.round(animatedValue).toLocaleString();
        },
        font: {
          weight: 'bold',
        },
        color: 'black',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        type: 'category',
        labels: sortedCountries,
      },
    },
    animation: {
      duration: 500,
    },
  };

  const data = {
    labels: sortedCountries,
    datasets: [{
      data: animatedPopulations.map(item => item.animatedPopulation),
      backgroundColor: sortedCountries.map(country => countryColors[country]),
    }],
  };

  return (
    <div>
      <div style={{ width: '80%', margin: '10px auto' }}>
        <Bar options={options} data={data} ref={chartRef} />
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ position: 'relative', width: '80%', margin: '0 auto' }}>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={handleSliderChange}
            style={{ width: '100%', marginBottom: '30px' }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${((year - minYear) / (maxYear - minYear)) * 100}%`,
              top: '100%',
              transform: 'translateX(-50%)',
              background: '#007bff',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            {year}
          </div>
        </div>
        <button onClick={startIncrementing}>Start</button>
        <button onClick={stopIncrementing}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default BarChartRace;