function setBits(bitPositions, input) {
  // Rewrite input by putting bit [i] into position bitPositions[i]
  let res = 0;
  for (var i = 0; i < bitPositions.length; i++) {
    res |= ((input >> i) & 1) << bitPositions[i];
  }
  return res;
}

class SuperPosition {
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
