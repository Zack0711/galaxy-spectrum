const csvParse = txt => {
  const data = txt.split(/\r?\n/)
  const csvTitle = data.shift().split(',');

  return data.map( d => {
    const dArray = d.split(',');
    const dObj = {};
    for(let i = 0; i < dArray.length; i += 1){
      if(csvTitle[i]) dObj[csvTitle[i]] = parseFloat(dArray[i]);
    };
    return dObj  
  })
}

const arrayParse = arr => {
  const keys = arr.shift()
  const data = arr.filter( d => Boolean(d[0]&&d[1]) ).map( d => ({
    Wavelength: Number(d[0].replace(/\s/g, ''))*10,
    energyDensity: Number(d[1].replace(/bl|\*$/, ''))
  }))
  const result = []

  data.forEach( d => {
    result.push({ Wavelength: d.Wavelength-1, energyDensity: 0})
    result.push(d)
    result.push({ Wavelength: d.Wavelength+1, energyDensity: 0})
  })
  return result
}

export {
  csvParse,
  arrayParse,
}