import './styles/main.scss';

var svg = d3.select('svg'),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr('width') - margin.left - margin.right,
    height = svg.attr('height') - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line()
    .x(d => x(d.waveLength))
    .y(d => y(d.energyDensity));

const dragstarted = function(d) {
  d3.select(this).raise().classed('active', true);
}

const updateProgressBar = (val, label) => {
  progressBar.attr('style', `width:${val*100}%;`);
}

const dragged = function(d) {
  if(d3.event.x < 0) d.x = 0;
  else if(d3.event.x > limitWidth) d.x = limitWidth;
  else d.x = d3.event.x;

  const progressVal = ( d.x / limitWidth )
  const temperature = progressVal*5000;

  d3.select(this).attr('style', `transform: translate(${d.x}px,0px)`);
  updateProgressBar(progressVal.toFixed(4));

  textT.text(temperature.toFixed(2));
  if(temperature) updateChart(generateData(temperature.toFixed(2)));

}

const dragended = function(d) {
  d3.select(this).classed('active', false);
}

const dragEvent = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended);

const dragBtn = d3.select('.drag-btn');
const progress = d3.select('.value-bg');
const progressBar = d3.select('.value-bar');
const textT = d3.select('.text-t');
const limitWidth = progress.node().getBoundingClientRect().width;

dragBtn.datum({x: 0, y:0}).call(dragEvent)

const h = 6.626069934 * Math.pow(10, -32);
const k = 1.38064852 * Math.pow(10, -23);
const c = 2.99792458 * Math.pow(10, 8);

const countEnergyDensity = (waveLength, T) => {
  const I = 2 * h * Math.pow(c, 2) / ( Math.pow(waveLength, 5)*( Math.pow(Math.E, h * c / (waveLength * k * T)) - 1 ));
  return I;
}

const generateData = (T, start = 0, end = 0.0005, num = 200) => {
  const limitW = (h * c ) / ( k * T )
//  const interval = (limitW - start) / num;
  const interval = (end - start) / num;
  let data = [];
  let waveLength = start + interval;

  for(let i = 0; i < num; i += 1){
    const energyDensity = countEnergyDensity(waveLength, T);
    data.push({energyDensity, waveLength})
    waveLength += interval;    
  }
  return data;
}

const spectrumData = generateData(3000);

const drawLineData = () => {

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)

  g.append('g')
    .attr('class', 'y-axis')
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Energy Density');

  g.append('path').attr('class', 'line-data')
}

const updateChart = (data) => {
  x.domain(d3.extent(data, d => d.waveLength ));
  y.domain(d3.extent(data, d => d.energyDensity ));

  g.select('.x-axis').call(d3.axisBottom(x))
  g.select('.y-axis').call(d3.axisLeft(y))
  g.select('.line-data')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1)
    .attr('d', line);
}

drawLineData();
updateChart(spectrumData);
