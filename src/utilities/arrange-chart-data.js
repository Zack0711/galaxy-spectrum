import union from 'lodash/union'

const DEFAULT_STATE = {
  spectrum: 0,
  spCount: 0,
  element: 0,
}

const handleSpectrumData = spectrum => {
  const data = {}
  const list = []
  const compensationList = []

  let min = Infinity
  let max = 0

  spectrum.forEach( d => {
    const wavelength = Math.floor(d.Wavelength / 2) * 2
    if(wavelength){
      const dataDensity = d['BestFit'] || 0

      if(!data[wavelength]) {
        data[wavelength] = { ...DEFAULT_STATE, wavelength: wavelength }
        list.push(wavelength)
      }

      const count = data[wavelength].spCount
      const density = data[wavelength].spectrum

      data[wavelength].spCount = count + 1
      data[wavelength].spectrum = (density * count + dataDensity) / (count + 1)

      if(min > wavelength) min = wavelength
      if(max < wavelength) max = wavelength      
    }
  })

  list.forEach( (d, i) => {
    if(d){
      const current = data[d]
      const next = data[list[i+1]]

      const waveInterval = next ? next.wavelength - current.wavelength : 1
      const spectrumDensityInterval = next ? next.spectrum - current.spectrum : 0

      if(waveInterval > 1){
        for(let i = 1; i < waveInterval; i++){
          data[current.wavelength + i] = {
            ...DEFAULT_STATE,
            wavelength: current.wavelength + i,
            spectrum: (current.spectrum + spectrumDensityInterval * i / waveInterval).toFixed(3),            
            spCount: 1,
          }

          compensationList.push(current.wavelength + i)
        }
      }
    }    
  })

  return ({
    list: union(list, compensationList).sort(),
    data,
    min,
    max
  })
}

const handleElementData = element => {
  const data = {}
  const list = []
  const compensationList = []

  element.forEach( d => {
    const wavelength = Math.floor(d.Wavelength / 2) * 2
    const dataDensity = d['energyDensity'] || 0
    if(dataDensity){
      if(!data[wavelength]) {
        data[wavelength] = { 
          wavelength: wavelength,
          density: 0,
          count: 0
        }
        list.push(wavelength)
      }

      const {
        count,
        density,
      } = data[wavelength]

      data[wavelength].count = count + 1
      data[wavelength].density = ((density * count + dataDensity) / (count + 1)).toFixed(3)
    }
  })

  return {list, data}

}

const arrangeChartData = ({spectrum = [], element = [], redshift = 0})  => {
  const chartData = handleSpectrumData(spectrum)
  const elementData = handleElementData(element)
}

export {
  arrangeChartData,
  handleSpectrumData,
  handleElementData,
}