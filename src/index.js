import './styles/main.scss';

import * as d3 from 'd3';

import DragBar from './dragBar';
import SpectrumChart from './spectrumChart'

import {
  genEnergyDensityDataSet,
} from './formula';

import {
  getCSVData,
} from './utilities';

const baseUrl = '/csv_data/'

let selectedName

const csvDataArray = [
 { label: 'Star 1', value: '1237648720693690487'},
 { label: 'Star 2', value: '1237674649928532213'},
 { label: 'Star 3', value: '1237674649928532061'},
 { label: 'Star 4', value: '1237674649928597563'},
 { label: 'Star 5', value: '1237674649928597570'},
]

const csvDataSet = {
  '1237674649928597570': {
    csv: 'csvSpectrum_1237674649928597570.csv',
    csvData: [],
    subClass: 'K1',
    t: 4580,
    redshift: 0.000,
    correct: 1.3,
    reference: 'http://skyserver.sdss.org/dr12/en/tools/quicklook/summary.aspx?id=1237674649928597570',    
  },
  '1237674649928597563': {
    csv: 'csvSpectrum_1237674649928597563.csv',
    csvData: [],
    subClass: 'F5',
    t: 6700,
    redshift: 0.000,
    correct: 7.6,
    reference: 'http://skyserver.sdss.org/dr12/en/tools/quicklook/summary.aspx?id=1237674649928597563',    
  },
  '1237674649928532061': {
    csv: 'csvSpectrum_1237674649928532061.csv',
    csvData: [],
    subClass: 'K3',
    t: 4800,
    redshift: 0.000,
    correct: 0.26,
    reference: 'http://skyserver.sdss.org/dr12/en/tools/quicklook/Summary.aspx?id=1237674649928532061',
  },
  '1237674649928532213': {
    csv: 'csvSpectrum_1237674649928532213.csv',
    csvData: [],
    subClass: 'K3',
    t: 4800,
    redshift: 0.000,
    correct: 4.3,
    reference: 'http://skyserver.sdss.org/dr12/en/tools/quicklook/Summary.aspx?id=1237674649928532213',
  },
  '1237648720693690487': {
    csv: 'csvSpectrum_1237648720693690487.csv',
    subClass: 'F3/F5V (30743)',
    csvData: [],
    t: 6850,
    redshift: 0.001,
    correct: 6.4,
    reference: 'http://skyserver.sdss.org/dr12/en/tools/quicklook/Summary.aspx?id=1237648720693690487',
  }
}

const textT = d3.select('.text-t');
const dataSelector = document.querySelector('.data-selector');
const dataInfo = document.querySelector('.data-info');
const dataReference = document.querySelector('.data-reference');

const btnFlux = document.querySelector('.btn-flux');
const btnBestFit = document.querySelector('.btn-best-fit');
const btnCorrection = document.querySelector('.btn-correction');

let chartMode = 0;
let needCorrect = false;

const switchMode = mode => {
  btnFlux.classList.remove('active');
  btnBestFit.classList.remove('active');
  chartMode = mode;
  switch(mode){
    case 0 :
      btnFlux.classList.add('active');
      break;
    case 1 :
      btnBestFit.classList.add('active');
      break;
  }
}

btnFlux.onclick = () => {
  if(!btnFlux.classList.contains('avtive')){
    switchMode(0);
    updateGalaxyData();
  }
}

btnBestFit.onclick = () => {
  if(!btnBestFit.classList.contains('avtive')){
    switchMode(1);
    updateGalaxyData();
  }
}

btnCorrection.onclick = () => {
  needCorrect = !needCorrect;
  btnCorrection.classList.toggle('active');
  updateGalaxyData();
}

const setTemperature = t => {
  const tRatio = (t-2500) / 25000;
  temperatureController.set(tRatio);
}

const updateGalaxyData = () => {
  const selectedData = csvDataSet[dataSelector.value];
  if(selectedData.csvData.length > 0){
    updateGalaxyChart(selectedData.csvData);
  }else{
    getCSVData(`${baseUrl}${selectedData.csv}`, csvData => {
      selectedData.csvData = csvData;
      updateGalaxyChart(csvData);
    });
  }  
}

const setSelectedData = data => {
  dataInfo.innerHTML = `Subclass: <span class="text-primary">${data.subClass}</span>, T: <span class="text-danger">${data.t}</span> Correct: <span class="text-info">${data.correct}</span>`;
  dataReference.href = data.reference;
  setTemperature(data.t);
  updateGalaxyData();
}

dataSelector.onchange = e => {
  if(selectedName !== dataSelector.value){
    console.log(dataSelector.value, csvDataSet[dataSelector.value])
    selectedName = dataSelector.value;
    setSelectedData(csvDataSet[dataSelector.value])
  }
}

const updateData = (progressVal) => {
  const temperature = progressVal*25000 + 2500;
  textT.text(temperature.toFixed(2));
  if(temperature && galaxyChart){
    const energyData = genEnergyDensityDataSet(temperature.toFixed(2))
    galaxyChart.setAxisReference(energyData);
    galaxyChart.updataRadiationChart(energyData);
  }
}

const galaxyChart = new SpectrumChart(document.querySelector('svg'));
const temperatureController = new DragBar(document.getElementById('temperature-controller'), updateData);

const updateGalaxyChart = data => {
  const galaxyData =[];
  const dataKey = chartMode === 0 ? 'Flux' : 'BestFit';
  const dataCorrection = needCorrect ? csvDataSet[dataSelector.value].correct || 1 : 1;

  data.forEach((d,i) => {
    if( i % 3 === 0){
      galaxyData.push({energyDensity: parseInt(d[dataKey])*Math.pow(10, 11)*dataCorrection, waveLength: parseInt(d.Wavelength)*Math.pow(10, -10)});
    }
  })
  galaxyChart.updateGalaxyChart(galaxyData);
}

/*
const updataElementChart = data => {
  const elementData = [];
  data.forEach(d => {
    if(d['"Ritz Wavelength Vac (nm)"']){
      elementData.push({waveLength: Number(d['"Ritz Wavelength Vac (nm)"'])/1000000000, energyDensity: Number(d['"Aki (s-1)"'])*100})
    }
  })
  console.log(elementData)
  galaxyChart.updataElementChart(elementData);
}
*/

//getCSVData('/csv_data/csvSpectrum_2917.csv', updateGalaxyChart);
//getCSVData('/csv_data/H.csv', updataElementChart);



csvDataArray.forEach(d => {
  const optionItem = document.createElement("option");
  optionItem.value = d.value;
  optionItem.innerHTML = d.label;
  dataSelector.appendChild(optionItem);
})
switchMode(0);
selectedName = dataSelector.value;
setSelectedData(csvDataSet[dataSelector.value]);