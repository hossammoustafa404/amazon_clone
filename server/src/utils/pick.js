const pick = (object, arr) =>
  arr.reduce((obj, item) => {
    if (Object.prototype.hasOwnProperty.call(object, item)) {
      obj[item] = object[item];
    }
    return obj;
  }, {});

module.exports = pick;
