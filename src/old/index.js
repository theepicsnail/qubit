const math = require("mathjs");
const qbit = require("./qbit.js");
window.math = math;
window.qbit = qbit;

var hadamardMatrix = math.multiply([ [ 1, 1 ], [ 1, -1 ] ], 1 / Math.sqrt(2));
function hadamard(bits, system) {
  if (bits.length != 1)
    return console.log("Hadamard takes 1 bit");

  system.applyToBits(bits, (state) => {
    let res = math.multiply(state.state, hadamardMatrix);
    res.forEach((val, idx) => { state.state[idx] = val; });
  });
}

var cnotMatrix =
    [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 0, 1 ], [ 0, 0, 1, 0 ] ];

function cnot(bits, system) {
  if (bits.length != 2)
    return console.log("Cnot takes 2 bits");

  system.applyToBits([ 1, 0 ], (state) => {
    let res = math.multiply(state.state, cnotMatrix);
    res.forEach((val, idx) => { state.state[idx] = val; });
  });
}

function zeroState(bits) {
  var system = new qbit.State(bits);
  system.state[0] = math.complex(1);
  return system;
}

window.zeroState = zeroState;
window.hadamard = hadamard;
window.cnot = cnot;

console.log(window);
console.log(window.qbit);

for (var i = 0; i < 4; i++) {
  console.log("--");
  console.log(i);
  system = zeroState(3);
  hadamard([ 0 ], system);
  hadamard([ 1 ], system);
  cnot([ 0, 1 ], system);
  hadamard([ 0 ], system);
  hadamard([ 1 ], system);
  system.display();
}
