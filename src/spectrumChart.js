import * as d3 from "d3";
import 'd3-selection-multi';

const margin = {top: 20, right: 20, bottom: 30, left: 150};

class SpectrumChart {
  constructor(element) {
    this.galaxyData = [];
    this.radiationData = [];
    this.elementData = [];
    this.axisReference = [];

    this.svg = d3.select(element);
    this.contentWidth = this.svg.attr('width') - margin.left - margin.right;
    this.contentHeight = this.svg.attr('height') - margin.top - margin.bottom;
    this.g = this.svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.xRange =  d3.scaleLinear().rangeRound([0, this.contentWidth]);
    this.yRange =  d3.scaleLinear().rangeRound([this.contentHeight, 0]);

    this.yGRange =  d3.scaleLinear().rangeRound([this.contentHeight, 0]);
    this.yBRange =  d3.scaleLinear().rangeRound([this.contentHeight, 0]);
    this.yERange =  d3.scaleLinear().rangeRound([this.contentHeight, 0]);

    this.line = d3.line().x(d => this.xRange(d.waveLength)).y(d => this.yRange(d.energyDensity));

    this.gLine = d3.line().x(d => this.xRange(d.waveLength)).y(d => this.yGRange(d.energyDensity));
    this.bLine = d3.line().x(d => this.xRange(d.waveLength)).y(d => this.yBRange(d.energyDensity));

    this.eLine = d3.line().x(d => this.xRange(d.waveLength)).y(d => this.yERange(d.energyDensity));

    this.updateGalaxyChart = this.updateGalaxyChart.bind(this);
    this.updataElementChart = this.updataElementChart.bind(this);

    this.xAxis = this.g.append('g');
    this.yAxis = this.g.append('g');

    this.yGAxis = this.g.append('g');
    this.yBAxis = this.g.append('g');
    this.yEAxis = this.g.append('g');

    this.galaxyChart = this.g.append('path');
    this.radiationChart = this.g.append('path');
    this.elementChart = this.g.append('g');

    this.xAxis.attrs({
      class: 'x-axis',
      transform: `translate(0,${this.contentHeight})`,
    })

    this.yGAxis.attr('class', 'y-g-axis');
    this.yBAxis.attr('class', 'y-b-axis');

    this.yEAxis.attrs({
      class: 'y-e-axis',
      transform: `translate(${this.contentWidth}, 0)`,      
    });

    this.galaxyChart.attr('class', 'galaxy-data');
    this.radiationChart.attr('class', 'line-data');
    this.elementChart.attr('class', 'element-data')
  }

  updateGalaxyChart(data) {
    this.galaxyData = data;

    //this.xRange.domain(d3.extent(this.galaxyData, d => d.waveLength ));
    //this.xAxis.call(d3.axisBottom(this.xRange));

    this.yGRange.domain(d3.extent(this.galaxyData, d => d.energyDensity ));
    this.yGAxis.call(d3.axisLeft(this.yGRange).ticks(0));

    //this.chartRender();
  }

  updataRadiationChart(data) {
    this.radiationData = data;
    this.yBRange.domain(d3.extent(this.radiationData, d => d.energyDensity ));
    this.yBAxis.call(d3.axisLeft(this.yBRange).ticks(0));
    //this.chartRender();
  }

  updataElementChart(data) {
    this.elementData = data;
    //this.yERange.domain(d3.extent(this.arrangeData(this.elementData), d => d.energyDensity ));
    //this.yEAxis.call(d3.axisRight(this.yERange).ticks(0));
    //this.chartRender();
  }

  arrangeData(data) {
    if(this.axisReference.length > 0){
      const minWave = this.axisReference[0].waveLength;
      const maxWave = this.axisReference[this.axisReference.length - 1].waveLength;
      return data.filter(d => d.waveLength >= minWave && d.waveLength <= maxWave);        
    }
    return data;    
  }

  setAxisReference(cat){
    switch(cat){
      case 'galaxy':
        this.axisReference = this.galaxyData;
        break;
      case 'radiation':
        this.axisReference = this.radiationData;
        break;
      default:
        this.axisReference = this.radiationData;
    }
  }

  chartRender() {
    //this.axisReference = this.galaxyData;
    //this.axisReference = this.radiationData;
    this.xRange.domain(d3.extent(this.axisReference, d => d.waveLength ));
    this.xAxis.call(d3.axisBottom(this.xRange));

    this.yERange.domain(d3.extent(this.arrangeData(this.elementData), d => d.energyDensity ));

    const chartData = (stroke, line) => ({
      fill: 'none',
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      'stroke-width': 1,
      d: line,
      stroke,
    })

    this.galaxyChart.datum(this.arrangeData(this.galaxyData)).attrs(chartData('red', this.gLine));
    this.radiationChart.datum(this.arrangeData(this.radiationData)).attrs(chartData('steelblue', this.bLine));  

//    this.elementChart.datum(this.elementData).attrs(chartData('grey', this.eLine));

    const elementBar = this.elementChart.selectAll('.bar').data(this.arrangeData(this.elementData));

    elementBar.enter().append("rect").attrs({
      class: 'bar',
      x: d => this.xRange(d.waveLength),
      y: d => this.yERange(d.energyDensity),
      fill: 'grey',
      width: 0.5,
      height: d => this.contentHeight - this.yERange(d.energyDensity),
    });

    elementBar.attrs({
      x: d => this.xRange(d.waveLength) || 0,
      y: d => this.yERange(d.energyDensity) || 0,
      width: 0.5,
      height: d => ( this.contentHeight - this.yERange(d.energyDensity)) || 0,
    });

    elementBar.exit().remove();
  }

}
export default SpectrumChart;
