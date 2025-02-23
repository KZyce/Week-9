let time = 0;
const pendulumRadius = 100;
const pendulumAmplitude = Math.PI / 4;
const pendulumPeriod = 500;
const flashInterval = 120;
let pendulums = [];

const cols = 5;
const rows = 4;
const spacingX = 160;
const spacingY = 180;

function setup() {
  createCanvas(800, 600);
  noiseSeed(random(1000));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pendulums.push({
        baseX: 100 + col * spacingX,
        baseY: 100 + row * spacingY,
        timeOffset: random(0, 1000),
        noiseOffsetX: random(1000),
        noiseOffsetY: random(1000),
        flashOffset: random(0, flashInterval),
        shapeNoiseOffset: random(1000),  
        color: color(random(100, 255), random(100, 255), random(100, 255)), // Random pendulum color
        flashColor: color(random(100, 255), random(100, 255), random(100, 255)) // Random flash color
      });
    }
  }
}

function pendulumMotion(t, pendulum) {
  let noiseFactor = noise(t * 0.005 + pendulum.noiseOffsetX) * 2 - 1;
  let angle = pendulumAmplitude * Math.sin((t + pendulum.timeOffset) / pendulumPeriod * TWO_PI) * (1 + 0.2 * noiseFactor);

  let x = pendulum.baseX + pendulumRadius * Math.sin(angle);
  let y = pendulum.baseY + pendulumRadius * Math.cos(angle);
  return { x, y };
}

function draw() {
  background(240);

  for (let i = 0; i < pendulums.length; i++) {
    let pendulum = pendulums[i];

    let centerX = pendulum.baseX + (noise(time * 0.002 + pendulum.noiseOffsetX) - 0.5) * 50;
    let centerY = pendulum.baseY + (noise(time * 0.002 + pendulum.noiseOffsetY) - 0.5) * 50;

    stroke(0);
    noFill();
    beginShape();
    for (let angle = -pendulumAmplitude; angle <= pendulumAmplitude; angle += 0.01) {
      let x = centerX + pendulumRadius * Math.sin(angle);
      let y = centerY + pendulumRadius * Math.cos(angle);
      vertex(x, y);
    }
    endShape();

    let pendulumPos = pendulumMotion(time, pendulum);

    // Perlin noise
    let noiseValue = noise(time * 0.01 + pendulum.shapeNoiseOffset);
    let shapeSize = 30 + noiseValue * 15;

    fill(pendulum.color);
    noStroke();
    ellipse(pendulumPos.x, pendulumPos.y, shapeSize, shapeSize);

    // Each pendulum flashes at a different time
    let redShapeVisible = (time + pendulum.flashOffset) % flashInterval < flashInterval / 2;

    let redShapeX = centerX + pendulumRadius * Math.sin(pendulumAmplitude);
    let redShapeY = centerY + pendulumRadius * Math.cos(pendulumAmplitude);

    if (redShapeVisible) {
      fill(pendulum.flashColor);
      noStroke();
      ellipse(redShapeX, redShapeY, shapeSize, shapeSize);
    }
  }

  time++;
}