/**
 * Celebration animation utility - flowers burst on screen
 */

const FLOWERS = ['🌸', '🌺', '🌷', '🌹', '🌻', '💐', '🌼', '🪻', '🪷', '🌱'];

/**
 * Create a single floating flower element
 */
function createFlower() {
  const flower = document.createElement('div');
  flower.className = 'celebration-flower';
  flower.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

  // Random starting position across the top
  const startX = Math.random() * 100;
  flower.style.left = `${startX}%`;

  // Random size
  const size = 20 + Math.random() * 30;
  flower.style.fontSize = `${size}px`;

  // Random animation duration
  const duration = 1.5 + Math.random() * 2;
  flower.style.animationDuration = `${duration}s`;

  // Random horizontal drift
  const drift = -50 + Math.random() * 100;
  flower.style.setProperty('--drift', `${drift}px`);

  // Random rotation
  const rotation = Math.random() * 720 - 360;
  flower.style.setProperty('--rotation', `${rotation}deg`);

  // Random delay for staggered effect
  const delay = Math.random() * 0.3;
  flower.style.animationDelay = `${delay}s`;

  return flower;
}

/**
 * Trigger flower celebration animation
 * @param {number} count - Number of flowers to spawn (default 50)
 */
export function celebrateWithFlowers(count = 50) {
  // Create container
  const container = document.createElement('div');
  container.className = 'celebration-container';
  document.body.appendChild(container);

  // Spawn flowers
  for (let i = 0; i < count; i++) {
    const flower = createFlower();
    container.appendChild(flower);
  }

  // Clean up after animation completes
  setTimeout(() => {
    container.remove();
  }, 4000);
}
