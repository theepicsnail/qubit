require("./experiments.js");
/*
function setBits(bitPositions, input) {
  // Rewrite input by putting bit [i] into position bitPositions[i]
  let res = 0;
  for (var i = 0; i < bitPositions.length; i++) {
    res |= ((input >> i) & 1) << bitPositions[i];
  }
  return res;
}

const SuperPosition = exports.SuperPosition = class {
  constructor(bits) {
    this.bits = bits;
    this.N = 1 << bits;
    this.state = new Array(this.N).fill(0);
    this.state[0] = 1;
  }

  applyFunction(bits, func) {
    let subState = new Array(1 << bits.length);

    // Bits that are not part of the input to the function.
    let constantBits = [];
    for (var i = 0; i < this.bits; i++) {
      if (bits.indexOf(i) == -1)
        constantBits.push(i);
    }

    // For each combination of the constant bits, apply the function.
    let applications = 1 << constantBits.length;
    for (var i = 0; i < applications; i++) {
      let fixedBits = setBits(constantBits, i);

      for (var j = 0; j < subState.length; j++) {
        let subStateBits = setBits(bits, j);
        subState[j] = this.state[fixedBits | subStateBits];
      }

      func(subState);

      for (var j = 0; j < subState.length; j++) {
        let subStateBits = setBits(bits, j);
        this.state[fixedBits | subStateBits] = subState[j];
      }
    }
  }

  measure(bit) {
    var p1 = 0; // probability of a 1.
    this.state.forEach((val, i) => {
      if ((i >> bit) & 1)
        p1 += val * val;
    });
    var result = Math.random() < p1 ? 1 : 0;

    let factor = p1;
    if (result == 0)
      factor = 1 - p1;
    factor = Math.sqrt(factor);

    // zero out the states we can't be in now.
    // normalize the others.
    this.state.forEach((val, i) => {
      if (((i >> bit) & 1) == result) {
        this.state[i] /= factor;
      } else {
        this.state[i] = 0;
      }
    });

    return result;
  }
}

const math = require("mathjs");
window.math = math;
function generalGate(matrix) {
  return function(state) {
    math.multiply(state, matrix).forEach((v, i) => { state[i] = v; });
  };
}

const cnot = generalGate([
  [ 1, 0, 0, 0 ], //
  [ 0, 1, 0, 0 ], //
  [ 0, 0, 0, 1 ], //
  [ 0, 0, 1, 0 ]
]);

const not = generalGate([
  [ 0, 1 ], //
  [ 1, 0 ]
]);

const hadamard = generalGate(math.divide(
    [
      [ 1, 1 ], //
      [ 1, -1 ]
    ],
    Math.sqrt(2)));

function deutsch(n) {
  // https://courses.cs.washington.edu/courses/cse599d/06wi/lecturenotes3.pdf
  // Page 8.
  return generalGate([
    [
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    ],
    [
      [ 0, 1, 0, 0 ],
      [ 1, 0, 0, 0 ],
      [ 0, 0, 0, 1 ],
      [ 0, 0, 1, 0 ],
    ],
    [
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 0, 1 ],
      [ 0, 0, 1, 0 ],
    ],
    [
      [ 0, 1, 0, 0 ],
      [ 1, 0, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    ],
  ][n]);
}

var s = new SuperPosition(2);
s.applyFunction([ 0 ], hadamard);
s.applyFunction([ 1 ], hadamard);
s.applyFunction([ 0, 1 ], cnot);
console.log(s.state);
console.log(s.measure(0));
console.log(s.state);

/*
for (var i = 0; i < 4; i++) {
  var s = new SuperPosition(2);
  s.state[0] = 0;
  s.state[i] = 1;
  // s.applyFunction([ 0 ], hadamard);
  // s.applyFunction([ 1 ], hadamard);
  s.applyFunction([ 1, 0 ], cnot);
  // s.applyFunction([ 0 ], hadamard);
  // s.applyFunction([ 1 ], hadamard);
  console.log(s.state);
}*/

/*
for (var i = 0; i < 4; i++) {
  console.group(i);
  var s = new SuperPosition(2);
  console.log("t=0", s.state);
  s.applyFunction([ 1 ], not);
  console.log("t=1", s.state);
  s.applyFunction([ 0 ], hadamard);
  s.applyFunction([ 1 ], hadamard);
  console.log("t=2", s.state);
  s.applyFunction([ 1, 0 ], deutsch(i));
  console.log("t=3", s.state);
  s.applyFunction([ 0 ], hadamard);
  console.log("t=4", s.state);
  console.log("Measure:", s.measure(0));
  console.log("t=5", s.state);
  console.groupEnd();
}*/
