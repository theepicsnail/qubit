// https://www.youtube.com/watch?v=X2q1PuI2RFI

function getSubstateId(stateIdx, subStateBits) {
  // Given a state index, and an array of bit selectors, compute the
  // substate index.
  // This is effectively a bit selector that constructs a new number
  // by selecting the bits (specified in the subStateBits array)
  // and putting them in order from right to left (so they line up
  // with the physical array).
  //
  // subStateIdx bits:DCBA
  // subStateBits: [3,1]
  // will classify everything
  //  3210    31
  //  0_0_ -> 00
  //  0_1_ -> 01
  // ...
  //
  // Changing the order of the subStateBits will change the order of output.
  //
  // subStateIdx bits:DCBA
  // subStateBits: [1,3]
  // will classify everything
  //  3210    13
  //  0_0_ -> 00
  //  0_1_ -> 10
  // ...

  // Some more examples:
  // stateIdx, 	subStateBits, result
  // 0000				[1,0] 00
  // 0011				[1,0] 11
  // 0001				[1,0] 01
  // 0010				[1,0] 10
  // 0010				[0,1] 01
  let out = 0;
  let len = subStateBits.length - 1;
  subStateBits.forEach(
      (b, i) => { out |= ((stateIdx >> b) & 1) << (len - i); });
  return out;
}

(function testGetSubstateId() {
  function assertEq(a, b, c) {
    if (!(a === b))
      throw new Error("Expected " + a + " == " + b + (c ? ": " + c : ""));
  }
  assertEq(getSubstateId(1, [ 2, 1 ]), 0);

  assertEq(getSubstateId(0, [ 1, 0 ]), 0);
  assertEq(getSubstateId(1, [ 1, 0 ]), 1);
  assertEq(getSubstateId(2, [ 1, 0 ]), 2);
  assertEq(getSubstateId(3, [ 1, 0 ]), 3);
  assertEq(getSubstateId(4, [ 1, 0 ]), 0);

  assertEq(getSubstateId(4, [ 0, 1 ]), 0);
  assertEq(getSubstateId(3, [ 0, 1 ]), 3);
  assertEq(getSubstateId(2, [ 0, 1 ]), 1);
  assertEq(getSubstateId(1, [ 0, 1 ]), 2);
  assertEq(getSubstateId(0, [ 0, 1 ]), 0);

})();

function partitionIdsByBits(nBits, selectorBits) {

  // Group by all the non-selected bits.
  // The selected bits will have all 2^len(selectorBits) combinations with
  //   the other bits all constant.
  // Each list in the returned list will have a different value for the
  //   non-selected bits.

  //  partitionIdsByBits(2, [0]) -> [[00, 01], [10, 11]]

  // partitionIdsByBits(3, [1,2]) -> [
  // [000, 010, 100, 110],
  // [001, 011, 101, 111]]

  // partitionIdsByBits(3, [1]) -> [
  // [000, 010],
  // [001, 011],
  // [100, 110],
  // [101, 111]]

  // We're gonna be grouping by non-selector bits. So build the selector for
  // the non-selector bits.
  let bucketingBits = [];
  for (var i = 0; i < nBits; i++) {
    if (selectorBits.indexOf(i) == -1)
      bucketingBits.unshift(i);
  }

  // For how ever many combinations of non-selector bits, we have that many
  // resulting buckets.
  let resultsLen = Math.pow(2, bucketingBits.length);
  let results = new Array(resultsLen);
  for (var i = 0; i < resultsLen; i++)
    results[i] = [];

  // For each of the possible combinations, group them by the non-selector bits.
  let N = Math.pow(2, nBits);
  for (var i = 0; i < N; i++) {
    let bucket = getSubstateId(i, bucketingBits);
    results[bucket].push(i);
  }

  return results;
}

(function testpartitionIdsByBits() {
  function assertEq(a, b) {
    function check(a, b) {
      if (typeof(a) == "number")
        return a == b;
      if (a.length != b.length)
        return false;
      for (var i = 0; i < a.length; i++) {
        if (!check(a[i], b[i]))
          return false;
      }
      return true;
    }
    if (!check(a, b))
      throw new Error("Expected " + a + " == " + b);
  }
  assertEq(partitionIdsByBits(2, [ 0 ]), //
           [ [ 0b00, 0b01 ], [ 0b10, 0b11 ] ]);

  assertEq(partitionIdsByBits(3, [ 1, 2 ]), //
           [ [ 0b000, 0b010, 0b100, 0b110 ], [ 0b001, 0b011, 0b101, 0b111 ] ])

  assertEq(partitionIdsByBits(3, [ 1 ]), [
    [ 0b000, 0b010 ], //
    [ 0b001, 0b011 ], //
    [ 0b100, 0b110 ], //
    [ 0b101, 0b111 ]  //
  ]);

})();

const State = exports.State = class {
  /*
  Stores a superposition of {bits} bits as a 2^n (a).
  */
  constructor(bits) {
    this.bits = bits;
    let N = Math.pow(2, bits);
    this.state = new Array(N).fill(0).map((v) => math.complex(v));
    // state[0]|0000> +
    // state[1]|0001> +
    // state[2]|0010> +
    // state[3]|0011> + ...
  }

  applyToBits(selectedBits, func) {
    // Select bits from this state to apply to func.
    // func is called with a state of length 2^bits.length.
    // that is applyToBits([0,1], foo) is called with a length 4 vector
    // applyToBits([0], foo) is called with a lenght 2 vector.
    //
    // Note order matters in the bits array.
    //
    // The state that's passed to func is the normalized sum of all the
    // states that contribute to the selected space.
    // That is bits = [0] means 000 + 010 + 100 + 110 will go into state[0]
    //                      and 001 + 011 + 101 + 111 will go into state[1]

    // Construct the state we'll apply the function to.
    let subState = new State(selectedBits.length);
    let partitions = partitionIdsByBits(this.bits, selectedBits);
    partitions.forEach((ids) => {
      ids.forEach((stateBit, subStateArrayIdx) => {
        subState.state[subStateArrayIdx] = this.state[stateBit];
      });

      func(subState);

      ids.forEach((stateBit, subStateArrayIdx) => {
        this.state[stateBit] = subState.state[subStateArrayIdx];
      });

      // insert the resulting state back into the superposition.

    });
  }

  display() {
    var pad = Array(this.bits + 1).join("0");
    this.state.forEach((val, idx) => {
      var v = idx.toString(2);
      var b = (pad + v).substring(v.length);
      console.log(b, val);
    })
  }

  getMagnitude() {
    // Just your normal sqrt(sum(v^2 for v in vector))
    let sum = 0;
    this.state.forEach((v) => {
      let mag = v.abs();
      sum += mag * mag;
    });
    return math.sqrt(sum);
  }

  normalize() {
    // Normal v -> v/|v| normalization.
    let mag = this.getMagnitude();
    this.state = this.state.map((v) => v.div(mag));
  }
}
