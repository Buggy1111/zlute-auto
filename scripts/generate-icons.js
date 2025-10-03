/* eslint-disable @typescript-eslint/no-require-imports */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Neon yellow colors
const BG_COLOR = '#0B0F14';
const ACCENT_COLOR = '#FFE81A';
const GLOW_COLOR = 'rgba(255, 232, 26, 0.6)';

function drawCar(ctx, size) {
  const scale = size / 100;

  // Center positioning
  const centerX = size / 2;
  const centerY = size / 2;
  const carWidth = 60 * scale;
  const carHeight = 30 * scale;

  ctx.save();
  ctx.translate(centerX, centerY);

  // Neon glow effect
  ctx.shadowColor = GLOW_COLOR;
  ctx.shadowBlur = 15 * scale;
  ctx.strokeStyle = ACCENT_COLOR;
  ctx.fillStyle = ACCENT_COLOR;
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw simple car shape
  ctx.beginPath();

  // Car body (rectangle with rounded corners)
  const x = -carWidth / 2;
  const y = -carHeight / 2;
  const radius = 4 * scale;

  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + carWidth - radius, y);
  ctx.quadraticCurveTo(x + carWidth, y, x + carWidth, y + radius);
  ctx.lineTo(x + carWidth, y + carHeight - radius);
  ctx.quadraticCurveTo(x + carWidth, y + carHeight, x + carWidth - radius, y + carHeight);
  ctx.lineTo(x + radius, y + carHeight);
  ctx.quadraticCurveTo(x, y + carHeight, x, y + carHeight - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  // Windshield
  ctx.beginPath();
  ctx.moveTo(-10 * scale, -carHeight / 2 + 5 * scale);
  ctx.lineTo(-5 * scale, -carHeight / 2);
  ctx.lineTo(5 * scale, -carHeight / 2);
  ctx.lineTo(10 * scale, -carHeight / 2 + 5 * scale);
  ctx.closePath();
  ctx.strokeStyle = BG_COLOR;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Wheels
  const wheelRadius = 5 * scale;
  const wheelY = carHeight / 2;

  // Left wheel
  ctx.beginPath();
  ctx.arc(-carWidth / 3, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fillStyle = BG_COLOR;
  ctx.fill();
  ctx.strokeStyle = ACCENT_COLOR;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Right wheel
  ctx.beginPath();
  ctx.arc(carWidth / 3, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, size, size);

  // Draw car
  drawCar(ctx, size);

  // Save
  const buffer = canvas.toBuffer('image/png');
  const publicDir = path.join(__dirname, '..', 'public');
  const outputPath = path.join(publicDir, filename);

  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${filename} (${size}x${size})`);
}

// Generate favicon (32x32 for .ico compatibility)
generateIcon(32, 'favicon-32x32.png');

// Generate PWA icons
generateIcon(192, 'icon-192x192.png');
generateIcon(512, 'icon-512x512.png');

// Create apple-touch-icon
generateIcon(180, 'apple-touch-icon.png');

console.log('\n✨ All icons generated successfully!');
