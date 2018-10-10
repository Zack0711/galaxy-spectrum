const getCSVData = async (url, cb) => {
  const data = await fetch(url).then(rsp => rsp.text().then( txt => txt.split(/\r?\n/)));
  const csvTitle = data[0].split(',');
  const csvData = []

  data.forEach((d, i) => {
    if(i > 0){
      const dArray = d.split(',');
      const dObj = {};
      for(let i = 0; i < dArray.length; i += 1){
        if(csvTitle[i]) dObj[csvTitle[i]] = dArray[i];
      };
      csvData.push(dObj)
    }
  })
  if(typeof cb === 'function') cb(csvData);
}

export {
  getCSVData,
}