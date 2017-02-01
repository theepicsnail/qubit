const gates = {};
function generalGate(matrix) {
  return function(state) {
    math.multiply(state, matrix).forEach((v, i) => { state[i] = v; });
  };
};

gates['h'] = gates['hadamard'] = {
  argc : 1,
  func : generalGate(math.divide(
      [
        [ 1, 1 ], //
        [ 1, -1 ]
      ],
      Math.sqrt(2)))
};

gates['cnot'] = {
  argc : 2,
  func : generalGate([
    // applyFunction([target, control], cnot);

    [ 1, 0, 0, 0 ], //
    [ 0, 1, 0, 0 ], //
    [ 0, 0, 0, 1 ], //
    [ 0, 0, 1, 0 ]
  ])
}

gates['not'] = {
  argc : 1,
  func : generalGate([
    [ 0, 1 ], //
    [ 1, 0 ]
  ])
}

gates['swap'] = {
  argc : 2,
  func : generalGate([
    [ 1, 0, 0, 0 ], //
    [ 0, 0, 1, 0 ], //
    [ 0, 1, 0, 0 ], //
    [ 0, 0, 0, 1 ]
  ])
}

gates['cswap'] = {
  argc : 3,
  func : generalGate([
    [ 1, 0, 0, 0, 0, 0, 0, 0 ], //
    [ 0, 1, 0, 0, 0, 0, 0, 0 ], //
    [ 0, 0, 1, 0, 0, 0, 0, 0 ], //
    [ 0, 0, 0, 1, 0, 0, 0, 0 ], //
    [ 0, 0, 0, 0, 1, 0, 0, 0 ], //
    [ 0, 0, 0, 0, 0, 0, 1, 0 ], //
    [ 0, 0, 0, 0, 0, 1, 0, 0 ], //
    [ 0, 0, 0, 0, 0, 0, 0, 1 ]  //
  ])
}
