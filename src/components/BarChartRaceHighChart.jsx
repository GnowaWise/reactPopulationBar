import React, { useState, useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { format } from "highcharts";

const BarChartRace = ({ populationCSV }) => {
  const [year, setYear] = useState(1950);
  const [isPlaying, setIsPlaying] = useState(false);
  const [populationData, setPopulationData] = useState([{}]);
  const [worldPopulation, setWorldPopulation] = useState({
    world: 0,
    population: 0,
  });
  // const [displayedPopulation, setDisplayedPopulation] = useState(0);
  const chartRef = useRef(null);

  const nbr = 11;
  const minYear = 1950;
  const maxYear = 2021;

  useEffect(() => {
    const myJSONParse = JSON.parse(
      JSON.stringify(populationCSV).replaceAll("Country name", "countryName")
    );
    getData(year, myJSONParse);
  }, [year, populationCSV]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setYear((prevYear) => {
          if (prevYear >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return prevYear + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  function getData(year, data) {
    let output = data
      .filter(
        (item) =>
          item.Year === `${year}` &&
          !item.countryName.includes("(UN)") &&
          !item.countryName.includes("region") &&
          !item.countryName.includes("countries")
      )
      .map((item) => ({
        name: item.countryName,
        y: Number(item.Population),
      }));

    output.sort((a, b) => b.y - a.y);
    setWorldPopulation({ population: output[0].y });
    setPopulationData(output.slice(1, nbr));
  }

  const getChartOptions = () => ({
    chart: {
      type: "bar",
      animation: {
        duration: 200,
      },
      marginRight: 50,
      events: {
        load: function () {
          this.series[0].data.forEach(function (point, i) {
            point.update({ y: 0 }, false);
          });
          this.redraw({ duration: 0 });

          setTimeout(() => {
            this.series[0].data.forEach(function (point, i) {
              point.update({ y: populationData[i].y }, false);
            });
            this.redraw({ duration: 1000 });
          }, 100);
        },
      },
    },
    title: {
      text: "World population by country",
      align: "left",
    },
    subtitle: {
      useHTML: true,
      text: getSubtitle(),
      floating: true,
      align: "right",
      verticalAlign: "bottom",
      y: -80,
      x: -100,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      opposite: true,
      tickPixelInterval: 150,
      title: {
        text: null,
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        animation: {
          duration: 500,
          defer: 100,
        },
        groupPadding: 0,
        pointPadding: 0.1,
        borderWidth: 0,
        colorByPoint: true,
        dataSorting: {
          enabled: true,
          matchByName: true,
        },
        type: "bar",
        dataLabels: {
          enabled: true,
          // format: "{point.y:.3f}",
          formatter: function () {
            return Highcharts.numberFormat(this.point.y, 0, 3, ",");
          },
        },
      },
    },
    series: [
      {
        name: year.toString(),
        data: populationData,
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 550,
          },
          chartOptions: {
            xAxis: {
              visible: false,
            },
            subtitle: {
              x: 0,
            },
            plotOptions: {
              series: {
                dataLabels: [
                  {
                    enabled: true,
                    y: 8,
                  },
                  {
                    enabled: true,
                    format: "{point.y:.f}",
                    y: -8,
                    style: {
                      fontWeight: "normal",
                      opacity: 0.7,
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const chart = chartRef.current.chart;
      chart.series[0].setData(populationData, true, { duration: 500 });
    }
  }, [populationData]);

  const getSubtitle = () => {
    const population = (worldPopulation.population / 1000000000).toFixed(2);
    return `<span style="font-size: 80px">${year}</span>
            <br>
            <span style="font-size: 22px">
                Total: <b>: ${population}</b> billion
            </span>`;
  };

  const handleSliderChange = (event) => {
    setYear(parseInt(event.target.value));
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setYear(minYear);
    setIsPlaying(false);
  };

  return (
    <div>
      <div style={{ width: "80%", margin: "10px auto" }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={getChartOptions()}
          ref={chartRef}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div style={{ position: "relative", width: "80%", margin: "0 auto" }}>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={handleSliderChange}
            style={{ width: "100%", marginBottom: "30px" }}
          />
          <div
            style={{
              position: "absolute",
              left: `${((year - minYear) / (maxYear - minYear)) * 100}%`,
              top: "50%",
              transform: "translateX(-50%)",
              background: "#007bff",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "16px",
              // fontWeight: "bold"
            }}
          >
            {year}
          </div>
        </div>
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default BarChartRace;
