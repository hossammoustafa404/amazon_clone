const exclude = (object, items) => {
  let obj = {};
  Object.keys(object).forEach((key) => {
    if (!items.includes(key)) {
      obj[key] = object[key];
    }
  });
  return obj;
};

module.exports = exclude;
