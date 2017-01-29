const math = require("mathjs");

const generalGate = exports.generalGate = function(matrix) {
  return function(state) {
    math.multiply(state, matrix).forEach((v, i) => { state[i] = v; });
  };
};

exports.cnot = generalGate([
  [ 1, 0, 0, 0 ], //
  [ 0, 1, 0, 0 ], //
  [ 0, 0, 0, 1 ], //
  [ 0, 0, 1, 0 ]
]);

exports.not = generalGate([
  [ 0, 1 ], //
  [ 1, 0 ]
]);

exports.hadamard = generalGate(math.divide(
    [
      [ 1, 1 ], //
      [ 1, -1 ]
    ],
    Math.sqrt(2)));
