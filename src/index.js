window.qubit = require("./lib/qubit.js");
window.gates = require("./lib/gates.js");
// require("./lib/experiments.js");
/*
const qubit = require("./lib/qubit.js");
const gates = require("./lib/gates.js");





let s = document.createElement("sp-view");
for (var i = 3; i >= 0; i--) {
  var sp = new qubit.SuperPosition(2);
  sp.state[0] = 0;
  sp.state[i] = 1;
  sp.applyFunction([ 0 ], gates.hadamard);
  sp.applyFunction([ 1, 0 ], gates.cnot);
  sp.applyFunction([ 0 ], gates.not);
  // sp.applyFunction([ 1, 0 ], gates.cnot);
  // sp.applyFunction([ 0, 1 ], gates.cnot);
  // sp.applyFunction([ 1, 0 ], gates.cnot);
  //  sp.applyFunction([ 0, 1 ], gates.cnot);
  // sp.applyFunction([ 0 ], gates.hadamard);
  console.log(sp.state);
}
s.set("sp", sp);
document.body.appendChild(s);
document.body.appendChild(document.createElement("q-diagram"));*/
