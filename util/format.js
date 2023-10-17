function snakeToCamelString(str) {
  return str.toLowerCase().replace(/_([a-z0-9])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

function snakeToCamelCaseObj(obj) {
  const transformedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamelString(key);
      transformedObj[camelKey] = obj[key];
    }
  }
  return transformedObj;
}

module.exports = {
  snakeToCamelCaseObj,
};
