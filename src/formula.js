const h = 6.626069934 * Math.pow(10, -34);
const k = 1.38064852 * Math.pow(10, -23);
const c = 2.99792458 * Math.pow(10, 8);

const countEnergyDensity = (waveLength, T) => {
  const I = 2 * h * Math.pow(c, 2) / ( Math.pow(waveLength, 5)*( Math.pow(Math.E, h * c / (waveLength * k * T)) - 1 ));
  return I;
}

const genEnergyDensityDataSet = (T, start = 0, end = 0.0005, num = 200) => {
  const limitW = (h * c ) / ( k * T )
  const interval = (limitW - start) / num;
  let data = [];
  let waveLength = start + interval;

  for(let i = 0; i < num; i += 1){
    const energyDensity = countEnergyDensity(waveLength, T);
    data.push({energyDensity, waveLength})
    waveLength += interval;    
  }
  return data;
}

export {
  genEnergyDensityDataSet,
}