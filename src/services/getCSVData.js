const getCSVData = async url => {
  const data = await fetch(url).then(rsp => rsp.text().then( txt => txt.split(/\r?\n/)));
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

export default getCSVData