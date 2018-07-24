import './styles/main.scss';



var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line()
    .x(d => x(d.waveLength))
    .y(d => y(d.energyDensity));

const countEnergyDensity = (waveLength, T) => {
  const h = 6.626069934 * Math.pow(10, -32);
  const k = 1.38064852 * Math.pow(10, -23);
  const c = 2.99792458 * Math.pow(10, 8);
  const I = 2 * h * Math.pow(c, 2) / ( Math.pow(waveLength, 5)*( Math.pow(Math.E, h * c / (waveLength * k * T)) - 1 ));
  return I;
}

const generateData = (T, start = 0, end = 0.0005, num = 200) => {

  const interval = (end - start)/num;
  let data = [];
  let waveLength = start + interval;

  for(let i = 0; i < num; i++){
    const energyDensity = countEnergyDensity(waveLength, T);
    data.push({energyDensity, waveLength})
    waveLength += interval;    
  }
  return data;
}

const dataList = [
  generateData(1000),
  generateData(2000),
  generateData(3000),
  generateData(4000),
  generateData(5000)
]


const drawLineData = (dataList) => {
  x.domain(d3.extent(dataList[4], function(d) { return d.waveLength; }));
  y.domain(d3.extent(dataList[4], function(d) { return d.energyDensity; }));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Energy Density");

  for(const data of dataList){
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1)
      .attr("d", line);
  }
}

//console.log(data);
drawLineData(dataList);
/*
d3.tsv("data.tsv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;

  console.log(data)

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
});
*/
