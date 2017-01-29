const SuperPosition = require("./qubit.js").SuperPosition;
const Gates = require("./gates.js");

function entaglement() {
  // Entagle 2 bits.
  // Measure either, we should get 50/50 split.
  // Measure the other, we should get 100% match.

  let firstWas1 = 0;
  let secondMatched = 0;
  let totalRuns = 10000;
  for (let i = 0; i < totalRuns; i++) {
    let s = new SuperPosition(2);
    s.applyFunction([ 0 ], Gates.hadamard);
    s.applyFunction([ 1, 0 ], Gates.cnot);

    let measureBit = 0;
    let checkBit = 1;
    if (Math.random() < .5) {
      measureBit = 1;
      checkBit = 0;
    }

    let m = s.measure(measureBit);
    if (m == 1)
      firstWas1++;
    if (s.measure(checkBit) == m)
      secondMatched++;
  }

  console.log("Expected results:")
  // Whichever bit was first should be 50/50 split. Expect 1 half the time.
  console.log("  First was 1: " + totalRuns / 2);
  // Regardless, the 2nd bit should collapse to match whatever the first was.
  console.log("  Second Matched: " + totalRuns);

  console.log("Actual results:");
  console.log("  First was 1: " + firstWas1);
  console.log("  Second Matched: " + secondMatched);
}
// entaglement();

function hadamardCNot() {
  // Cnot(a,b) operates the same as Cnot(b,a) when wrapped with hadamards.
  // --H--*--H--     --X--
  //      |       ==   |
  // --H--X--H--     --*--

  for (var i = 0; i < 4; i++) {
    var normal = new SuperPosition(2);
    var hadamard = new SuperPosition(2);
    // Setup initial distributions.
    // Does a pass of each 00, 01, 10, 11
    normal.state[0] = 0;
    hadamard.state[0] = 0;
    normal.state[i] = 1;
    hadamard.state[i] = 1;

    hadamard.applyFunction([ 0 ], Gates.hadamard);
    hadamard.applyFunction([ 1 ], Gates.hadamard);
    hadamard.applyFunction([ 0, 1 ], Gates.cnot);
    hadamard.applyFunction([ 0 ], Gates.hadamard);
    hadamard.applyFunction([ 1 ], Gates.hadamard);

    // Note the input bits are reversed.
    normal.applyFunction([ 1, 0 ], Gates.cnot);

    var error = 0;
    for (var i = 0; i < 4; i++) {
      error += Math.pow(hadamard.state[i] - normal.state[i], 2)
    }
    console.log("Error: " + error.toFixed(2));
  }
}

function deutschsProblem() {
  // Given a black box f(x,y) that outputs (x, something). determine if
  // [something] is dependant on x. That is does f(0,?) == f(1,?).
  // Classical computers require evaluating f multiple times.
  // Quantum computers require evaluating f only once.

  for (var i = 0; i < 4; i++) {
    var s = new SuperPosition(2);
    s.applyFunction([ 1 ], Gates.not);
    s.applyFunction([ 0 ], Gates.hadamard);
    s.applyFunction([ 1 ], Gates.hadamard);
    s.applyFunction([ 1, 0 ], deutsch(i));
    s.applyFunction([ 0 ], Gates.hadamard);

    if (i < 2) // First 2 gates don't depend on x, so expect 0.
      console.log("Expect 0, got:", s.measure(0));
    else // Second 2 gates do, so expect 1.
      console.log("Expect 1, got:", s.measure(0));
  }
}

function deutsch(n) {
  // https://courses.cs.washington.edu/courses/cse599d/06wi/lecturenotes3.pdf
  // Page 8.
  return Gates.generalGate([
    [
      // f(x,y) -> (x,y), output 2 does not depend on x
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    ],
    [
      // f(x,y) -> (x,!y), output 2 does not depend on x
      [ 0, 1, 0, 0 ],
      [ 1, 0, 0, 0 ],
      [ 0, 0, 0, 1 ],
      [ 0, 0, 1, 0 ],
    ],
    [
      // f(x,y) -> (x,x^y), output 2 does depend on x
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 0, 1 ],
      [ 0, 0, 1, 0 ],
    ],
    [
      // f(x,y) -> (x, x^(!y)), output 2 does depend on x.
      [ 0, 1, 0, 0 ],
      [ 1, 0, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    ],
  ][n]);
}
entaglement();
hadamardCNot();
deutschsProblem();
