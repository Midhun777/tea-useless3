// ==========================================================================
// THE REALFIGHTERS CHAI-LOG | Interactive Engine & Audio Synthesizer
// Useless Projects 3.0 • Team realFighters (Zen & Midhun)
// ==========================================================================

// --- High-Quality Procedural Meter Chaya Liquid Pour Sound Synthesizer ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPopSound() {
  // Silent pop
}

// Synthesizes a rich, satisfying stream of hot Kerala meter-chaya splashing into a glass
function playPourSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = 1.15; // Realistic pouring duration
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate warm pink/brown liquid rush noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.06;
      b1 = 0.95 * b1 + white * 0.16;
      b2 = 0.85 * b2 + white * 0.28;
      output[i] = (b0 + b1 + b2) * 0.55;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Resonant bandpass filter: simulates liquid filling the cavity of the glass
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.2, ctx.currentTime);
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + duration * 0.75);
    filter.frequency.linearRampToValueAtTime(850, ctx.currentTime + duration);

    // Highpass filter to eliminate low-end rumble
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(280, ctx.currentTime);

    // Dynamic Volume Envelope: initial stream splash -> steady aeration -> froth settle
    const gainNode = ctx.createGain();
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.38, now + 0.1);
    gainNode.gain.setValueAtTime(0.35, now + 0.75);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(hpFilter);
    hpFilter.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    // Add resonant micro-bubble splashes during the stream
    for (let j = 0; j < 6; j++) {
      const splashDelay = 0.12 + j * 0.16 + Math.random() * 0.05;
      const splashOsc = ctx.createOscillator();
      const splashGain = ctx.createGain();

      const freq = 550 + Math.random() * 450;
      splashOsc.type = 'sine';
      splashOsc.frequency.setValueAtTime(freq, now + splashDelay);
      splashOsc.frequency.exponentialRampToValueAtTime(freq + 350, now + splashDelay + 0.06);

      splashGain.gain.setValueAtTime(0.001, now + splashDelay);
      splashGain.gain.linearRampToValueAtTime(0.09, now + splashDelay + 0.02);
      splashGain.gain.exponentialRampToValueAtTime(0.001, now + splashDelay + 0.06);

      splashOsc.connect(splashGain);
      splashGain.connect(ctx.destination);

      splashOsc.start(now + splashDelay);
      splashOsc.stop(now + splashDelay + 0.07);
    }
  } catch (e) {
    console.warn("Pour audio error:", e);
  }
}

// --- Ambient Chai Steam & Golden Floating Bubbles Canvas ---
const canvas = document.getElementById('ambient-canvas');
let ctx = null;
let steamParticles = [];

function initAmbientCanvas() {
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate warm ambient steam & golden tea droplets
  for (let i = 0; i < 40; i++) {
    steamParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 4 + Math.random() * 12,
      speedY: 0.3 + Math.random() * 0.9,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.12 + Math.random() * 0.35,
      isSteam: Math.random() > 0.4
    });
  }

  animateAmbientCanvas();
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function animateAmbientCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of steamParticles) {
    p.y -= p.speedY;
    p.x += p.speedX;

    if (p.y < -30) {
      p.y = canvas.height + 30;
      p.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

    if (p.isSteam) {
      // Warm rising steam blur
      ctx.fillStyle = `rgba(254, 243, 199, ${p.opacity * 0.5})`;
    } else {
      // Golden tea micro bubble
      ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
    }
    ctx.fill();
  }

  requestAnimationFrame(animateAmbientCanvas);
}

// --- Mini Chaya Glass Interactive Froth Bubbles ---
let currentBubbles = 14;

function spawnMiniBubble(customX, customY) {
  const container = document.getElementById('mini-bubble-box');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'mini-bubble';

  const size = 6 + Math.floor(Math.random() * 10);
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  const left = customX !== undefined ? customX : 8 + Math.random() * 66;
  const top = customY !== undefined ? customY : 38 + Math.random() * 48;

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  bubble.addEventListener('click', (e) => {
    e.stopPropagation();
    popMiniBubble(bubble, e.clientX, e.clientY);
  });

  container.appendChild(bubble);
}

function popMiniBubble(element, clientX, clientY) {
  playPopSound();
  createPopParticles(clientX, clientY);
  element.remove();

  currentBubbles = Math.max(0, currentBubbles - 1);
  updateBubbleDisplay();

  if (currentBubbles <= 2) {
    setTimeout(() => {
      spawnMultipleMiniBubbles(6);
    }, 600);
  }
}

function spawnMultipleMiniBubbles(count) {
  for (let i = 0; i < count; i++) {
    spawnMiniBubble();
  }
  currentBubbles += count;
  updateBubbleDisplay();
}

function updateBubbleDisplay() {
  const display = document.getElementById('bubble-stat-display');
  if (display) {
    display.innerText = currentBubbles;
  }
}

function createPopParticles(x, y) {
  const colors = ['#fef3c7', '#f59e0b', '#fff', '#ea580c'];
  for (let i = 0; i < 7; i++) {
    const p = document.createElement('div');
    p.className = 'pop-particle';
    const size = 3 + Math.random() * 5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 26;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 550);
  }
}

// --- Initialize Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();

  // Populate mini glass bubbles
  for (let i = 0; i < currentBubbles; i++) {
    spawnMiniBubble();
  }
  updateBubbleDisplay();

  // Pour Chaya Button
  const pourBtn = document.getElementById('pour-chaya-btn');
  if (pourBtn) {
    pourBtn.addEventListener('click', (e) => {
      playPourSound();

      // Froth surge animation in the glass
      const liquid = document.querySelector('.mini-tea-liquid');
      if (liquid) {
        liquid.style.transition = 'height 0.35s ease';
        liquid.style.height = '88%';
        setTimeout(() => {
          liquid.style.height = '72%';
        }, 700);
      }

      spawnMultipleMiniBubbles(6);
      createPopParticles(e.clientX, e.clientY);
    });
  }

  // Click on mini glass to add bubble
  const miniGlass = document.getElementById('interactive-mini-glass');
  if (miniGlass) {
    miniGlass.addEventListener('click', (e) => {
      const rect = miniGlass.getBoundingClientRect();
      const x = e.clientX - rect.left - 5;
      const y = e.clientY - rect.top - 5;
      spawnMiniBubble(Math.max(6, Math.min(68, x)), Math.max(34, Math.min(84, y)));
      currentBubbles++;
      updateBubbleDisplay();
      playPopSound();
    });
  }
});
