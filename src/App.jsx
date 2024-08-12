import { useState } from 'react'
import Papa from 'papaparse'
import populationCSV from './assets/population-and-demography.csv'

// const csv = `${populationCSV}`;

const csvPop = Papa.parse(populationCSV, {
  // complete: function (data) {
  //   console.log(data);
  // },
  delimiter: "\t", newline: "\n", header: true
})
console.log(csvPop)

function App() {

  return (
    <>
      <section>
        <div>
          Test 
          {csvPop.data}
        </div>
      </section>
    </>
  )
}

export default App
