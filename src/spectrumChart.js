import * as d3 from "d3";

const margin = {top: 20, right: 20, bottom: 30, left: 50};

class SpectrumChart {
  constructor(element) {
    this.galaxyData = [];
    this.radiationData = [];

    this.svg = d3.select(element);
    this.contentWidth = this.svg.attr('width') - margin.left - margin.right;
    this.contentHeight = this.svg.attr('height') - margin.top - margin.bottom;
    this.g = this.svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.xRange =  d3.scaleLinear().rangeRound([0, this.contentWidth]);
    this.yRange =  d3.scaleLinear().rangeRound([this.contentHeight, 0]);

    this.line = d3.line()
      .x(d => this.xRange(d.waveLength))
      .y(d => this.yRange(d.energyDensity));

    this.updateGalaxyChart = this.updateGalaxyChart.bind(this);

    this.xAxis = this.g.append('g');
    this.yAxis = this.g.append('g');

    this.galaxyChart = this.g.append('path');
    this.radiationChart = this.g.append('path');

    this.xAxis.attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.contentHeight})`);

    this.yAxis.attr('class', 'y-axis')
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Energy Density');

    this.galaxyChart.attr('class', 'galaxy-data');
    this.radiationChart.attr('class', 'line-data');
  }

  updateGalaxyChart(data) {
    this.galaxyData = data;
    this.xRange.domain(d3.extent(this.galaxyData, d => d.waveLength ));
    this.yRange.domain(d3.extent(this.galaxyData, d => d.energyDensity ));

    this.xAxis.call(d3.axisBottom(this.xRange));
    this.yAxis.call(d3.axisLeft(this.yRange));

    this.galaxyChart.datum(this.galaxyData)
                  .attr('fill', 'none')
                  .attr('stroke', 'red')
                  .attr('stroke-linejoin', 'round')
                  .attr('stroke-linecap', 'round')
                  .attr('stroke-width', 1)
                  .attr('d', this.line);
  }

  updataRadiationChart(data) {
    this.radiationData = data;
    this.radiationChart.datum(this.radiationData)
                  .attr('fill', 'none')
                  .attr('stroke', 'steelblue')
                  .attr('stroke-linejoin', 'round')
                  .attr('stroke-linecap', 'round')
                  .attr('stroke-width', 1)
                  .attr('d', this.line);
  }
}
export default SpectrumChart;
