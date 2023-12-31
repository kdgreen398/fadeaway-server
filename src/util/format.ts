function snakeToCamelString(str: string) {
  return str.toLowerCase().replace(/_([a-z0-9])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

export function snakeToCamelCaseObj(obj: { [key: string]: any }) {
  const transformedObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamelString(key);
      transformedObj[camelKey] = obj[key];
    }
  }
  return transformedObj;
}

