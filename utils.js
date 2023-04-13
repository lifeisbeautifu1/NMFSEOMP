function createNDimArray(dimensions) {
  if (dimensions.length > 0) {
    var dim = dimensions[0];
    var rest = dimensions.slice(1);
    var newArray = new Array();
    for (var i = 0; i < dim; i++) {
      newArray[i] = createNDimArray(rest);
    }
    return newArray;
  } else {
    return undefined;
  }
}

module.exports = createNDimArray;
