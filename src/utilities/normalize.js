const normalizingList = dataList => {
  const data = {};
  const list = dataList.map( d => {
    data[d.id] = d;
    return d.id;
  });
  return {data, list}
}

export {
	normalizingList,
}