import './styles/main.scss';

import DragBar from './dragBar';
import SpectrumChart from './spectrumChart'

import {
  genEnergyDensityDataSet,
} from './formula';

const textT = d3.select('.text-t');

const updateData = (progressVal) => {
  const temperature = progressVal*5000;
  textT.text(temperature.toFixed(2));
  if(temperature && galaxyChart){
    galaxyChart.updataRadiationChart(genEnergyDensityDataSet(temperature.toFixed(2)));
  }
}

const galaxyChart = new SpectrumChart(document.querySelector('svg'));
const temperatureController = new DragBar(document.getElementById('temperature-controller'), updateData);

d3.csv("/csv_data/3843_csvSpectrum.csv", function(data) {
  const galaxyData =[];
  data.forEach((d,i) => {
    if( i % 2 === 0){
      galaxyData.push({energyDensity: parseInt(d.BestFit)/10, waveLength: parseInt(d.Wavelength)/10000000 });
    }
  })

  galaxyChart.updateGalaxyChart(galaxyData);
  temperatureController.set(0.15);
});
