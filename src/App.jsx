import { useState, useEffect } from 'react'
import populationCSV from './assets/population-and-demography.csv'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const myJSON = JSON.stringify(populationCSV)
const myJSONParse = JSON.parse(myJSON.replaceAll('Country name', 'countryName'))
const nbr = 11;

function App() {
  const [input, setInput] = useState(1950);
  const [populationData, setPopulationData] = useState([[
    "world", 0
  ], ["world", 0]]);

  function getData(year) {
    let output = myJSONParse.filter(data => data.Year === `${year}`)
      .filter(data => !data.countryName.includes("(UN)") && !data.countryName.includes("region") && !data.countryName.includes("countries"))
      .map(data => [data.countryName, Number(data.Population)]);
    output.sort((a, b) => b[1] - a[1]);
    setPopulationData([output[0], output.slice(1, nbr)]);
  }

  useEffect(() => {
    getData(input)
  }, [])

  function handleChange(e) {
    var value = e.target.value;
    setInput(value);
    getData(input)
    console.log(populationData[1].map((data) => data[0]))
  }

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Total ${populationData[0][0]} population: ${populationData[0][1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
      },
    },
  };
  const dataset = {
    labels: populationData[1].map((data) => data[0]),
    datasets: [{
      label: 'Population growth by country',
      data: populationData[1].map((data) => data[1]),
      borderColor: ['rgb(255, 153, 153)',
        'rgb(255, 204, 153)',
        'rgb(255, 255, 153)',
        'rgb(153, 255, 153)',
        'rgb(153, 255, 204)',
        'rgb(255, 99, 132)',
        'rgb(153, 255, 204)',
        'rgb(153, 255, 255)',
        'rgb(153, 204, 255)',
        'rgb(153, 153, 255)'],
      backgroundColor: ['rgb(255, 153, 153)',
        'rgb(255, 204, 153, 0.5)',
        'rgb(255, 255, 153, 0.5)',
        'rgb(153, 255, 153, 0.5)',
        'rgb(153, 255, 204, 0.5)',
        'rgb(255, 99, 132, 0.5)',
        'rgb(153, 255, 204, 0.5)',
        'rgb(153, 255, 255, 0.5)',
        'rgb(153, 204, 255, 0.5)',
        'rgb(153, 153, 255, 0.5)'],
      borderWidth: 1
    }]
  }

  return (
    <>
      <section>
        <div>
          <form onChange={handleChange}>
            <label>Enter a year :</label>
            <input type="number" min={1950} max={2021} />

          </form>
          <div >
            <Bar options={options} data={dataset} />
          </div>
        </div>
      </section>
    </>
  )
}

export default App
