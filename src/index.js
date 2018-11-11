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

const baseUrl = './csv_data/'

let selectedName;
let selectedElement;

const csvDataArray = [
 { label: 'Star 1', value: '1237648720693690487'},
 { label: 'Star 2', value: '1237674649928532213'},
 { label: 'Star 3', value: '1237674649928532061'},
 { label: 'Star 4', value: '1237674649928597563'},
 { label: 'Star 5', value: '1237674649928597570'},
]

const elemetCSVData = [
  { label: 'H', value:'H'},
  { label: 'O', value:'O'},
  { label: 'O_I', value:'O_I'},
  { label: 'O_II', value:'O_II'},
  { label: 'O_III', value:'O_III'},
  { label: 'He', value:'He'},
  { label: 'He_II', value:'He_II'},
]

const elementDataSet = {
  'H': {
    csv: 'elem-H.csv',
    csvData: [],
  },
  'O': {
    csv: 'elem-O.csv',
    csvData: [],
  },
  'O_I': {
    csv: 'elem-O_I.csv',
    csvData: [],
  },
  'O_II': {
    csv: 'elem-O_II.csv',
    csvData: [],
  },
  'O_III': {
    csv: 'elem-O_III.csv',
    csvData: [],
  },
  'He': {
    csv: 'elem-He.csv',
    csvData: [],
  },
  'He_II': {
    csv: 'elem-He_II.csv',
    csvData: [],
  },
}

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
const elementSelector = document.querySelector('.element-selector');

const dataInfo = document.querySelector('.data-info');
const dataReference = document.querySelector('.data-reference');

const btnFlux = document.querySelector('.btn-flux');
const btnBestFit = document.querySelector('.btn-best-fit');
const btnFocus = document.querySelector('.btn-focus');

//const btnCorrection = document.querySelector('.btn-correction');

let currentGalaxyData = [];

let chartMode = 0;
let needCorrect = false;
let needFocus = false;

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

/*
btnCorrection.onclick = () => {
  needCorrect = !needCorrect;
  btnCorrection.classList.toggle('active');
  updateGalaxyData();
}
*/

btnFocus.onclick = () => {
  needFocus = !needFocus;
  btnFocus.classList.toggle('active');
  const cat = needFocus ? 'galaxy' : 'radiation';
  galaxyChart.setAxisReference(cat);
  galaxyChart.chartRender();
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
  dataInfo.innerHTML = `
    Subclass: <span class="text-primary">${data.subClass}</span>, 
    T: <span class="text-danger">${data.t}</span> 
    Correct: <span class="text-info">${data.correct}</span>
  `;
  dataReference.href = data.reference;
  setTemperature(data.t);
  updateGalaxyData();
}

dataSelector.onchange = e => {
  if(selectedName !== dataSelector.value){
    selectedName = dataSelector.value;
    setSelectedData(csvDataSet[dataSelector.value])
  }
}

elementSelector.onchange = e => {
  if(selectedElement !== elementSelector.value){
    selectedElement = elementSelector.value;
    setElemetData(elementDataSet[selectedElement])
  }
}

const setElemetData = (element, needUpdate = true) => {
  if(element.csvData.length > 0){
    console.log('setElemetData')
    galaxyChart.updataElementChart(element.csvData);
    if(needUpdate) galaxyChart.chartRender();
  }else{
    getCSVData(`${baseUrl}${element.csv}`, csvData => {
      console.log('getCSVData!!')
      const elementData = [];
      let maxIntensity = 0;

      csvData.forEach((d,i) => {
        if(d.waveLength && d.energyDensity){
          const energyDensity = d.energyDensity*Math.pow(10, 0);
          const waveLength = d.waveLength.replace(' ', '')*Math.pow(10, -9);
          elementData.push({energyDensity, waveLength});
        }
      })
      element.csvData = elementData;
      galaxyChart.updataElementChart(elementData);
      if(needUpdate) galaxyChart.chartRender();
    });
  }
}

const updateData = (progressVal) => {
  const temperature = progressVal*25000 + 2500;
  textT.text(temperature.toFixed(2));
  if(temperature && galaxyChart){
    const energyData = genEnergyDensityDataSet(temperature.toFixed(2))
    galaxyChart.updataRadiationChart(energyData);
    galaxyChart.chartRender();
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
      galaxyData.push({energyDensity: parseInt(d[dataKey]), waveLength: parseInt(d.Wavelength)*Math.pow(10, -10)});
    }
  })
  currentGalaxyData = galaxyData;

  const cat = needFocus ? 'galaxy' : 'radiation';

  galaxyChart.updateGalaxyChart(galaxyData);
  galaxyChart.setAxisReference(cat);
  galaxyChart.chartRender();
}

const appendDataToSelector = (selector, data) =>{
  data.forEach(d => {
    const optionItem = document.createElement("option");
    optionItem.value = d.value;
    optionItem.innerHTML = d.label;
    selector.appendChild(optionItem);
  })
}

appendDataToSelector(dataSelector, csvDataArray);
appendDataToSelector(elementSelector, elemetCSVData);

//elementSelector

console.log(elementSelector.value);

switchMode(0);

selectedElement = elementSelector.value;
selectedName = dataSelector.value;

setElemetData(elementDataSet[selectedElement], false)
setSelectedData(csvDataSet[selectedName]);
