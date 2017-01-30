
function bitY(b) { return b * 30 + 30; }

function hadamard(ctx, bits) {
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.font = '20px monospace';
  ctx.fillRect(-10, bitY(bits[0]) - 10, 20, 20);
  ctx.strokeRect(-10, bitY(bits[0]) - 10, 20, 20);
  ctx.fillStyle = 'black';
  ctx.fillText('H', -6, (1 + bits[0]) * 30 + 7);
}

function not(ctx, bits) {
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0, bitY(bits[0]) + 10);
  ctx.lineTo(0, bitY(bits[0]) - 10);
  ctx.arc(0, bitY(bits[0]), 10, Math.PI / 2, 5 * Math.PI / 2);
  ctx.stroke();
}

function cnot(ctx, bits) {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, bitY(bits[0]), 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, bitY(bits[1]), 10, 0, Math.PI * 2);

  var minY = Math.min(bitY(bits[0]), bitY(bits[1]) - 10);
  var maxY = Math.max(bitY(bits[0]), bitY(bits[1]) + 10);
  ctx.moveTo(0, minY);
  ctx.lineTo(0, maxY);
  ctx.stroke();
}

Polymer({
  is : 'q-diagram',
  properties : {},
  bits : 3,
  gates : [
    [ cnot, [ 0, 2 ] ],
    [ hadamard, [ 0 ] ],
    [ hadamard, [ 1 ] ],
    [ cnot, [ 0, 1 ] ],
    [ hadamard, [ 0 ] ],
    [ hadamard, [ 1 ] ],
  ],
  attached() {
    console.log("draw");
    this.ctx = this.$.canvas.getContext('2d');
    this.$.canvas.height = 30 * (this.bits + 1);
    this.$.canvas.width = 50 * (this.gates.length + 1);
    this.ctx.translate(.5, .5);
    this.draw();
    this.$.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
  },
  draw() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.$.canvas.width, this.$.canvas.height);

    // Draw main lines
    for (var i = 0; i < this.bits; i++) {
      this.ctx.moveTo(0, 30 * i + 30);
      this.ctx.lineTo(this.$.canvas.width, 30 * i + 30);
    }
    this.ctx.stroke();

    this.ctx.save();
    for (var j = 0; j < this.gates.length; j++) {
      let gate = this.gates[j];
      this.ctx.translate(50, 0);
      gate[0](this.ctx, gate[1]);
      /*this.ctx.strokeStyle = 'black';
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, 100);
      this.ctx.stroke();*/
    }
    this.ctx.restore();
  },
  mouseMove(e) {
    let x = ((e.offsetX + 12.5) / 25 | 0) * 25;
    this.draw();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, 100);
  }
});
