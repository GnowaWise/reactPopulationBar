// import { useState, useEffect } from 'react'
// import populationCSV from './assets/population-and-demography.csv'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );



// const myJSON = JSON.stringify(populationCSV)
// const myJSONParse = JSON.parse(myJSON.replaceAll('Country name', 'countryName'))
// const nbr = 11;

// function App() {
//   const [year, setYear] = useState(1950);
//   const [intervalId, setIntervalId] = useState(null);
//   const [populationData, setPopulationData] = useState([[
//     "world", 0
//   ], ["world", 0]]);

//   function getData(year) {
//     //console.log(year);
//     let output = myJSONParse.filter(data => data.Year === `${year}`)
//       .filter(data => !data.countryName.includes("(UN)") && !data.countryName.includes("region") && !data.countryName.includes("countries"))
//       .map(data => [data.countryName, Number(data.Population)]);
//     output.sort((a, b) => b[1] - a[1]);
//     setPopulationData([output[0], output.slice(1, nbr)]);
//   }

//   const startIncrementing = () => {
//     if (!intervalId) {
//       const id = setInterval(() => {
//         setYear((prevYear) => {
//           const currentYear = prevYear + 1;
//           if (prevYear <= 2021) {
//             getData(currentYear)
//             return currentYear;
//           } else {
//             clearInterval(id);
//             return prevYear;
//           }
//         });

//       }, 1000); // Increment every 1 second
//       setIntervalId(id);

//     }
//   };

//   const stopIncrementing = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//       // getData(year);
//     }
//   };

//   const reset = () => {
//     setYear(1950);
//     getData(year);
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//       // getData(year);
//     }
//   }

//   useEffect(() => {
//     getData(year)
//   }, [])

//   // function handleChange(e) {
//   //   var value = e.target.value;
//   //   setInput(value);
//   //   getData(input)
//   //   console.log(populationData[1].map((data) => data[0]))
//   // }
//   var speed = 1000;

//   const options = {
//     animation: {
//       duration: speed * 1,
//       easing: 'linear'
//     },
//     indexAxis: 'y',
//     yAxis: {
//       // Lock the scale minimum at 0 and use 10% padding (of data) for max. 
//       scale_range: { padding: 0.1, min: 0 },
//       // on top. 
//       orientation: 'opposite',
//       // Dont make room for tick labels overflow. The chart level margin_right: 30, setting will ensure there is enough space for them. 
//       overflow: 'hidden'
//     },
//     xAxis: {
//       // Hide x axis ticks (vertical axis on horizontal chart) 
//       defaultTick_enabled: false,
//       scale: { invert: true },
//       alternateGridFill: 'none'
//     },
//     elements: {
//       bar: {
//         borderWidth: 1,
//       },
//     },
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'right',
//       },
//       title: {
//         display: true,
//         text: `Total ${populationData[0][0]} Population in year ${year} : ${populationData[0][1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
//       },
//       datalabels: {
//         // Position of the labels 
//         // (start, end, center, etc.)
//         anchor: 'center',
//         // Alignment of the labels 
//         // (start, end, center, etc.)
//         align: 'center',
//         // Color of the labels
//         color: 'black',
//         font: {
//           weight: 'bold',
//         },
//         formatter: function (value, context) {
//           // Display the actual data value
//           return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
//         }
//       },
//     },

//   };
//   const dataset = {
//     labels: populationData[1].map((data) => data[0]),
//     datasets: [{
//       label: 'Population growth',
//       data: populationData[1].map((data) => data[1]),
//       borderColor: ['rgb(255, 153, 153)',
//         'rgb(255, 204, 153)',
//         'rgb(255, 255, 153)',
//         'rgb(153, 255, 153)',
//         'rgb(153, 255, 204)',
//         'rgb(255, 99, 132)',
//         'rgb(153, 255, 204)',
//         'rgb(153, 255, 255)',
//         'rgb(153, 204, 255)',
//         'rgb(153, 153, 255)'],
//       backgroundColor: ['rgb(255, 153, 153, 0.5)',
//         'rgb(255, 204, 153, 0.5)',
//         'rgb(255, 255, 153, 0.5)',
//         'rgb(153, 255, 153, 0.5)',
//         'rgb(153, 255, 204, 0.5)',
//         'rgb(255, 99, 132, 0.5)',
//         'rgb(153, 255, 204, 0.5)',
//         'rgb(153, 255, 255, 0.5)',
//         'rgb(153, 204, 255, 0.5)',
//         'rgb(153, 153, 255, 0.5)'],
//       borderWidth: 1
//     }]
//   }

//   return (
//     <div>
//       <div style={{ width: '80%', margin: '0 auto' }}>
//         <Bar options={options} data={data} />
//       </div>
//       <div style={{ textAlign: 'center', marginTop: '20px' }}>
//         <button onClick={startIncrementing}>Start</button>
//         <button onClick={stopIncrementing}>Stop</button>
//         <button onClick={reset}>Reset</button>
//       </div>
//     </div>
//   )
// }

// export default App

// import BarChartRace from './components/BarChartRace';
import BarChartRace from './components/BarChartRaceHighChart';
import populationCSV from './assets/population-and-demography.csv';

function App() {
  return (
    <div className="App">
      <BarChartRace populationCSV={populationCSV} />
    </div>
  );
}

export default App;
