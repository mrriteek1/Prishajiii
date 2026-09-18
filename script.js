/* ==========================================================================
   PRISHA'S SPECIAL GALLERY - INTERACTION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Fullscreen Loader Dismissal
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });
  // Fallback in case load event already completed
  setTimeout(() => loader.classList.add('hidden'), 2000);


  // 2. Romantic Quotes Data & Carousel
  const quotes = [
    { text: "In your smile, I see something more beautiful than the stars.", author: "Always Thinking of You" },
    { text: "Every day spent knowing you is my favorite day. So today is my new favorite.", author: "For Prisha" },
    { text: "You bring colors to my world that no artist could ever paint.", author: "With Pure Love" },
    { text: "Some people make the world brighter just by being in it. You are one of them.", author: "Forever Grateful" }
  ];

  const quoteSlider = document.getElementById('quoteSlider');
  const quoteDots = document.getElementById('quoteDots');
  let currentQuoteIndex = 0;

  // Build Quote elements
  quotes.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = `quote-item ${idx === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <p class="quote-text">“${q.text}”</p>
      <span class="quote-author">— ${q.author}</span>
    `;
    quoteSlider.appendChild(item);

    const dot = document.createElement('div');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => switchQuote(idx));
    quoteDots.appendChild(dot);
  });

  function switchQuote(nextIndex) {
    const items = quoteSlider.querySelectorAll('.quote-item');
    const dots = quoteDots.querySelectorAll('.dot');

    items[currentQuoteIndex].classList.remove('active');
    dots[currentQuoteIndex].classList.remove('active');

    currentQuoteIndex = nextIndex;

    items[currentQuoteIndex].classList.add('active');
    dots[currentQuoteIndex].classList.add('active');
  }

  setInterval(() => {
    const next = (currentQuoteIndex + 1) % quotes.length;
    switchQuote(next);
  }, 5000);


  // 3. Floating Hearts & Sparkles Canvas Animation
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.5 + 0.6;
      this.speedX = Math.sin(Math.random() * 4) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.type = Math.random() > 0.45 ? 'heart' : 'sparkle';
      this.color = Math.random() > 0.5 ? '#ff6584' : '#b28bfb';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        // Sparkle / Star shape
        ctx.fillStyle = '#ffb3c6';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((18 + i * 90) * Math.PI / 180) * this.size * 0.5,
                     -Math.sin((18 + i * 90) * Math.PI / 180) * this.size * 0.5);
          ctx.lineTo(Math.cos((54 + i * 90) * Math.PI / 180) * this.size * 0.2,
                     -Math.sin((54 + i * 90) * Math.PI / 180) * this.size * 0.2);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Generate particles based on screen width
  const count = window.innerWidth < 768 ? 20 : 45;
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // Distribute on start
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // 4. Modal Lightbox Logic (Zoom effect on View Card)
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  document.querySelectorAll('.open-modal-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.greeting-card');
      const imgSource = card.querySelector('img').src;
      const title = card.getAttribute('data-title') || 'Prisha’s Greeting';

      modalImg.src = imgSource;
      modalTitle.textContent = title;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });


  // 5. Romantic Ambient Music Synth (Web Audio API)
  // Generates a soft, dreamy music-box chord progression without requiring an MP3
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = musicToggle.querySelector('.music-label');
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  // Romantic Pentatonic Chord progression (Notes in Hz: C, E, G, A, B, D)
  const notes = [261.63, 329.63, 392.00, 440.00, 493.88, 523.25, 659.25, 783.99];

  function playTone(freq, time, duration = 1.4) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  function startMelody() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    musicToggle.classList.add('playing');
    musicLabel.textContent = "Pause Melody";

    // Play initial chime
    playTone(notes[0], audioCtx.currentTime);
    playTone(notes[2], audioCtx.currentTime + 0.2);

    let step = 0;
    synthInterval = setInterval(() => {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      const harmony = notes[(step % 4) * 2];

      playTone(randomNote, now, 1.6);
      if (Math.random() > 0.4) {
        playTone(harmony, now + 0.35, 1.8);
      }
      step++;
    }, 700);
  }

  function pauseMelody() {
    isPlaying = false;
    musicToggle.classList.remove('playing');
    musicLabel.textContent = "Play Melody";
    clearInterval(synthInterval);
  }

  musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
      startMelody();
    } else {
      pauseMelody();
    }
  });

});

