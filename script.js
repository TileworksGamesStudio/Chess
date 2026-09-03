/**
 * WIZARD'S CHESS — ARCANE ENGINE & 4TH-WALL SYSTEM
 * Full custom rules, procedural Web Audio synthesizer, canvas debris physics,
 * living stone models & responsive tactile interaction.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PROCEDURAL MAGIC SOUND SYNTHESIZER (WEB AUDIO API)
     No external .mp3 files required. Generated pure analog wizardry.
     ========================================================================== */
  class SoundCaster {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPieceSlide() {
      if (this.isMuted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    }

    playSpellSmash(pieceType) {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;

      // Heavy bass impact rumble
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(220, t);
      osc1.frequency.exponentialRampToValueAtTime(25, t + 0.45);
      gain1.gain.setValueAtTime(0.7, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.5);

      // White-noise explosion for shattered rock
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-4 * (i / bufferSize));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(pieceType === 'q' ? 1800 : 700, t);
      noiseFilter.Q.setValueAtTime(3, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // Arcane high sparkle tone
      const spellOsc = this.ctx.createOscillator();
      const spellGain = this.ctx.createGain();
      spellOsc.type = 'sawtooth';
      spellOsc.frequency.setValueAtTime(800, t);
      spellOsc.frequency.exponentialRampToValueAtTime(120, t + 0.35);

      spellGain.gain.setValueAtTime(0.25, t);
      spellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      spellOsc.connect(spellGain);
      spellGain.connect(this.ctx.destination);
      spellOsc.start(t);
      spellOsc.stop(t + 0.36);
    }

    playCheckChord() {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;
      [330, 440, 520, 660].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.04);
        gain.gain.setValueAtTime(0.2, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + 0.75);
      });
    }

    playDialogueChime() {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  }

  const soundMaster = new SoundCaster();

  /* ==========================================================================
     2. 4TH-WALL BREAKING COMMENTARY & LIVING DIALOGUE ENGINE
     ========================================================================== */
  const DIALOGUE_VAULT = {
    pawn: {
      avatar: '♟️',
      name: 'Vanguard Footman',
      taps: [
        "Hey! Watch the fingertips, Human. You'll smudge my granite armor!",
        "Yes, I know I can only march forward. Stop double-tapping me like a Muggle device.",
        "You're not planning to sacrifice me on turn four again, are you?!",
        "Behind that glass screen, you look awfully nervous."
      ],
      moves: [
        "One step closer into the cauldron of doom.",
        "For Merlin's honor! Don't abandon me out here!",
        "I march because you command it, mortal."
      ],
      captures: [
        "CRUMBLED! That's what you get for trespassing!",
        "Stone daggers to the heart! Next opponent please!",
        "Ha! Did you see that strike from down here?!"
      ],
      slain: [
        "Tell Ron... I tried my best...",
        "I had three turns until retirement! Argh!",
        "You blundered me! I hope you step on a Lego in the muggle realm!"
      ]
    },
    knight: {
      avatar: '♞',
      name: 'Stone Warhorse',
      taps: [
        "NEIGH! Do you even know how the 'L' shape works, mortal?",
        "Don't poke my horse's nose! He bites through glass.",
        "I leap over heads and kingdoms alike. Choose my path wisely.",
        "Your touch is cold. Bring me carrots or make your move."
      ],
      moves: [
        "Galloping through the mystic fog!",
        "A swift leap into the enemy's flanks!",
        "L-formation executed with knightly perfection!"
      ],
      captures: [
        "TRAMPLED INTO DUST! Ride with glory!",
        "My lance shattered their stone backbone!",
        "Send your cavalry, coward! We are untouchable!"
      ],
      slain: [
        "A treacherous ambush! My saddle...",
        "Even Pegasus falls when commanded by an amateur!",
        "You left my flank exposed, you screen-swiping sorcerer!"
      ]
    },
    bishop: {
      avatar: '♝',
      name: 'Arcane Cleric',
      taps: [
        "May Merlin grant you tactical clarity... because your moves are awful.",
        "I walk only diagonally. It is holy geometry, look it up.",
        "I sense great darkness in your next decision. Hesitate!",
        "Don't touch my mitre! It took two centuries to carve."
      ],
      moves: [
        "Sliding along the ley lines of magic.",
        "Diagonal judgment strikes like lightning.",
        "The prophecy foretold this exact coordinate."
      ],
      captures: [
        "INCENDIO! Pulverize the heretic stone!",
        "A cleansing ritual of absolute destruction!",
        "Banished into the dark aether!"
      ],
      slain: [
        "My holy wards... shattered...",
        "I foresaw this death, yet your foolish tap sealed it!",
        "Merlin... forgive this player's clumsy fingers..."
      ]
    },
    rook: {
      avatar: '♜',
      name: 'Citadel Golem',
      taps: [
        "BOOM. BOOM. Keep tapping. I feel nothing.",
        "I AM THE FORTRESS. Move me when you want a bloodbath.",
        "Did you drop your phone? The board shook from here.",
        "Straight lines only. Like a siege ram."
      ],
      moves: [
        "HEAVY FOOTSTEPS SHAKE THE DUNGEON.",
        "The fortress advances across the battlefield.",
        "Clear the file! Citadel rolling through!"
      ],
      captures: [
        "SMASHED TO PEBBLES! NOTHING SURVIVES!",
        "BOMBARDA! Crushed beneath twenty tons of granite!",
        "CLEANUP ON TILE D4! BRING A BROOM!"
      ],
      slain: [
        "HOW... CAN A FORTRESS... CRUMBLE?!",
        "My battlements... breached...",
        "You traded ME for a pawn?! Are you out of your mind?!"
      ]
    },
    queen: {
      avatar: '♛',
      name: 'High Sorceress Queen',
      taps: [
        "Kneel before you tap my sacred tile, mortal.",
        "If you blunder me, I will hex your smartphone battery to 1%.",
        "I am the most lethal creation on this board. Don't waste me.",
        "Yes, darling, I can move anywhere I please. Such is royalty."
      ],
      moves: [
        "The Queen glides where lesser beings fear to walk.",
        "Tremble, for arcane supremacy has arrived.",
        "Every diagonal and rank belongs to my will."
      ],
      captures: [
        "OBLITERATED! You dared stand before the Queen?!",
        "Pure magical fury! Not even dust remains!",
        "A flawless execution. Applaud me, mortal behind the glass!"
      ],
      slain: [
        "NO! IMPOSSIBLE! YOU LET ME DIE?!",
        "A supreme catastrophe! Resign now, you incompetent summoner!",
        "I will haunt your touch screen for eternity!"
      ]
    },
    king: {
      avatar: '♚',
      name: 'The Crowned Monarch',
      taps: [
        "Gently! A King's crown is delicate and heavy!",
        "I only take one step at a time; kings don't run for anyone.",
        "Keep those dark forces away from my royal chamber!",
        "Are you protecting me, or are you secretly rooting for Voldemort?"
      ],
      moves: [
        "A measured royal relocation.",
        "The King assesses the battlefield from high ground.",
        "Stepping back to maintain our strategic dignity."
      ],
      captures: [
        "Royal execution by the King's own scepter!",
        "Even crowned heads must get their hands dirty!",
        "Take that, insolent rebel pebble!"
      ],
      slain: [
        "THE CROWN HAS FALLEN! The realm is lost...",
        "Checkmate?! You had ONE job, mortal!",
        "My kingdom... traded for your reckless offense..."
      ]
    }
  };

  const FOURTH_WALL_RANDOMS = [
    { avatar: '🧙‍♂️', name: 'Albus the Observer', text: "Remember, wizard's chess is completely barbaric compared to regular muggle board games." },
    { avatar: '📱', name: 'Board Spirit', text: "Your screen seems a bit smudged. Wipe it before making another terrible sacrifice." },
    { avatar: '♟️', name: 'White Pawn', text: "Psst! AI is calculating 4 moves ahead. You're just winging it, aren't you?" },
    { avatar: '⚡', name: 'Ancient Runes', text: "The magic within the stone reacts to your touch. Tap with conviction!" },
    { avatar: '🐀', name: 'Dungeon Scab', text: "Squeak! I bet Ron Weasley played this opening much better than you." }
  ];

  /* ==========================================================================
     3. CANVAS PARTICLE FX (STONE DEBRIS, MAGIC SPARKS & SMOKE)
     ========================================================================== */
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.running = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    burst(x, y, colorTheme = 'gold') {
      this.resize();
      const count = 35 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        const isStone = Math.random() > 0.4;
        
        let color = '#ffd700';
        if (colorTheme === 'dark') color = Math.random() > 0.5 ? '#b026ff' : '#4a2574';
        else if (colorTheme === 'red') color = Math.random() > 0.5 ? '#ff3344' : '#880011';
        else if (isStone) color = Math.random() > 0.5 ? '#c5b8a5' : '#4d4352';

        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isStone ? 2 : 0),
          gravity: isStone ? 0.28 : 0.08,
          size: isStone ? (3 + Math.random() * 5) : (2 + Math.random() * 3),
          color: color,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.3,
          isStone: isStone
        });
      }

      if (!this.running) {
        this.running = true;
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);

        if (p.isStone) {
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.8);
        } else {
          this.ctx.fillStyle = p.color;
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = p.color;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.running = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  /* ==========================================================================
     4. SVG CHESS PIECE CARVINGS (DETAILED RUNIC ART)
     ========================================================================== */
  function getPieceSVG(type, color) {
    const isW = color === 'w';
    const fillClass = isW ? 'piece-white' : 'piece-black';

    // Gradients and stone definitions
    const defs = `
      <defs>
        <linearGradient id="white-marble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff8ec" />
          <stop offset="60%" stop-color="#ddd2bf" />
          <stop offset="100%" stop-color="#a69986" />
        </linearGradient>
        <linearGradient id="dark-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#473a52" />
          <stop offset="70%" stop-color="#231b2c" />
          <stop offset="100%" stop-color="#0f0b14" />
        </linearGradient>
      </defs>
    `;

    let glyph = '';

    switch (type) {
      case 'p': // Pawn: Stone Footman with Helm & Runes
        glyph = `
          <path class="stone-base" d="M22 84 L78 84 L72 74 L28 74 Z" />
          <path class="stone-base" d="M32 74 C32 58 40 48 40 38 L60 38 C60 48 68 58 68 74 Z" />
          <circle class="stone-base" cx="50" cy="24" r="14" />
          <circle class="rune-glow" cx="50" cy="24" r="5" />
          <path class="rune-glow" d="M48 46 L52 46 L50 64 Z" />
        `;
        break;
      case 'r': // Rook: Medieval Castle Battlement Golem
        glyph = `
          <path class="stone-base" d="M18 86 L82 86 L76 74 L24 74 Z" />
          <path class="stone-base" d="M28 74 L32 38 L68 38 L72 74 Z" />
          <path class="stone-base" d="M22 38 L78 38 L80 18 L70 18 L70 26 L56 26 L56 18 L44 18 L44 26 L30 26 L30 18 L20 18 Z" />
          <rect class="rune-glow" x="46" y="44" width="8" height="18" rx="3" />
        `;
        break;
      case 'n': // Knight: Armored Warhorse with Glowing Visor
        glyph = `
          <path class="stone-base" d="M20 86 L80 86 L74 74 L26 74 Z" />
          <path class="stone-base" d="M28 74 C28 66 32 50 24 38 C20 32 24 24 34 22 C42 20 48 12 56 12 C66 12 76 20 78 34 C80 50 72 65 72 74 Z" />
          <path class="stone-base" d="M34 22 L46 36 L30 42 Z" />
          <polygon class="rune-glow" points="48,26 56,22 52,30" />
          <circle class="rune-glow" cx="62" cy="28" r="3.5" />
        `;
        break;
      case 'b': // Bishop: Mitre & Enchanted Crosier Staff
        glyph = `
          <path class="stone-base" d="M22 86 L78 86 L72 74 L28 74 Z" />
          <path class="stone-base" d="M32 74 C32 54 42 42 42 34 C36 32 34 26 38 18 C44 10 56 10 62 18 C66 26 64 32 58 34 C58 42 68 54 68 74 Z" />
          <circle class="rune-glow" cx="50" cy="10" r="4" />
          <line x1="50" y1="28" x2="50" y2="48" stroke="currentColor" class="rune-glow" stroke-width="3" />
          <line x1="43" y1="36" x2="57" y2="36" stroke="currentColor" class="rune-glow" stroke-width="3" />
        `;
        break;
      case 'q': // Queen: Crown of Thorns & Sorceress Robe
        glyph = `
          <path class="stone-base" d="M16 88 L84 88 L78 76 L22 76 Z" />
          <path class="stone-base" d="M26 76 C30 52 38 38 34 32 L20 44 L28 22 L40 34 L50 14 L60 34 L72 22 L80 44 L66 32 C62 38 70 52 74 76 Z" />
          <circle class="rune-glow" cx="50" cy="14" r="3.5" />
          <circle class="rune-glow" cx="28" cy="22" r="3" />
          <circle class="rune-glow" cx="72" cy="22" r="3" />
          <polygon class="rune-glow" points="50,44 56,58 44,58" />
        `;
        break;
      case 'k': // King: Royal Crown & Merlin Cross Scepter
        glyph = `
          <path class="stone-base" d="M18 88 L82 88 L76 76 L24 76 Z" />
          <path class="stone-base" d="M26 76 C28 54 36 40 32 30 L40 34 L50 24 L60 34 L68 30 C64 40 72 54 74 76 Z" />
          <!-- Scepter Cross Top -->
          <path class="rune-glow" d="M48 8 L52 8 L52 14 L58 14 L58 18 L52 18 L52 24 L48 24 L48 18 L42 18 L42 14 L48 14 Z" />
          <circle class="rune-glow" cx="50" cy="46" r="6" />
        `;
        break;
    }

    return `
      <div class="piece ${fillClass}" data-type="${type}" data-color="${color}">
        <svg viewBox="0 0 100 100">
          ${defs}
          ${glyph}
        </svg>
      </div>
    `;
  }

  /* ==========================================================================
     5. COMPLETE CHESS ENGINE (RULES, CASTLING, CHECKMATE & AI)
     ========================================================================== */
  class WizardChessEngine {
    constructor() {
      this.reset();
    }

    reset() {
      this.board = this.createInitialBoard();
      this.turn = 'w';
      this.selected = null;
      this.validMoves = [];
      this.moveHistory = [];
      this.kings = { w: { r: 7, c: 4 }, b: { r: 0, c: 4 } };
      this.castling = {
        w: { k: true, q: true },
        b: { k: true, q: true }
      };
      this.captured = { w: [], b: [] };
      this.isGameOver = false;
    }

    createInitialBoard() {
      const b = Array(8).fill(null).map(() => Array(8).fill(null));
      const order = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

      for (let c = 0; c < 8; c++) {
        b[0][c] = { type: order[c], color: 'b', moved: false };
        b[1][c] = { type: 'p', color: 'b', moved: false };
        b[6][c] = { type: 'p', color: 'w', moved: false };
        b[7][c] = { type: order[c], color: 'w', moved: false };
      }
      return b;
    }

    cloneBoard(src) {
      return src.map(row => row.map(cell => (cell ? { ...cell } : null)));
    }

    inBounds(r, c) {
      return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    // Generates raw moves ignoring check
    getRawMoves(r, c, boardState = this.board) {
      const piece = boardState[r][c];
      if (!piece) return [];
      const moves = [];
      const { type, color } = piece;
      const forward = color === 'w' ? -1 : 1;

      if (type === 'p') {
        // Forward 1
        const nr = r + forward;
        if (this.inBounds(nr, c) && !boardState[nr][c]) {
          moves.push({ r: nr, c: c });
          // Forward 2 from home row
          const startRow = color === 'w' ? 6 : 1;
          const nnr = r + forward * 2;
          if (r === startRow && !boardState[nnr][c]) {
            moves.push({ r: nnr, c: c });
          }
        }
        // Diagonal Captures
        for (const dc of [-1, 1]) {
          const nc = c + dc;
          if (this.inBounds(nr, nc)) {
            const target = boardState[nr][nc];
            if (target && target.color !== color) {
              moves.push({ r: nr, c: nc, capture: true });
            }
          }
        }
      } else if (type === 'n') {
        const deltas = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        deltas.forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (this.inBounds(nr, nc)) {
            const target = boardState[nr][nc];
            if (!target) moves.push({ r: nr, c: nc });
            else if (target.color !== color) moves.push({ r: nr, c: nc, capture: true });
          }
        });
      } else if (type === 'b' || type === 'r' || type === 'q') {
        const dirs = [];
        if (type === 'b' || type === 'q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        if (type === 'r' || type === 'q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);

        dirs.forEach(([dr, dc]) => {
          let step = 1;
          while (true) {
            const nr = r + dr * step;
            const nc = c + dc * step;
            if (!this.inBounds(nr, nc)) break;
            const target = boardState[nr][nc];
            if (!target) {
              moves.push({ r: nr, c: nc });
            } else {
              if (target.color !== color) moves.push({ r: nr, c: nc, capture: true });
              break;
            }
            step++;
          }
        });
      } else if (type === 'k') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (this.inBounds(nr, nc)) {
              const target = boardState[nr][nc];
              if (!target) moves.push({ r: nr, c: nc });
              else if (target.color !== color) moves.push({ r: nr, c: nc, capture: true });
            }
          }
        }
        // Castling moves
        if (boardState === this.board && !this.isSquareAttacked(r, c, color === 'w' ? 'b' : 'w', boardState)) {
          if (this.castling[color].k) {
            if (!boardState[r][c + 1] && !boardState[r][c + 2]) {
              if (!this.isSquareAttacked(r, c + 1, color === 'w' ? 'b' : 'w', boardState) &&
                  !this.isSquareAttacked(r, c + 2, color === 'w' ? 'b' : 'w', boardState)) {
                moves.push({ r: r, c: c + 2, castle: 'k' });
              }
            }
          }
          if (this.castling[color].q) {
            if (!boardState[r][c - 1] && !boardState[r][c - 2] && !boardState[r][c - 3]) {
              if (!this.isSquareAttacked(r, c - 1, color === 'w' ? 'b' : 'w', boardState) &&
                  !this.isSquareAttacked(r, c - 2, color === 'w' ? 'b' : 'w', boardState)) {
                moves.push({ r: r, c: c - 2, castle: 'q' });
              }
            }
          }
        }
      }
      return moves;
    }

    isSquareAttacked(r, c, attackerColor, bState) {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const p = bState[row][col];
          if (p && p.color === attackerColor) {
            // For pawns, check diagonals specifically
            if (p.type === 'p') {
              const f = p.color === 'w' ? -1 : 1;
              if (row + f === r && (col - 1 === c || col + 1 === c)) return true;
            } else {
              const m = this.getRawMoves(row, col, bState);
              if (m.some(move => move.r === r && move.c === c)) return true;
            }
          }
        }
      }
      return false;
    }

    isKingInCheck(color, bState = this.board) {
      let kingPos = null;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = bState[r][c];
          if (p && p.type === 'k' && p.color === color) {
            kingPos = { r, c };
            break;
          }
        }
        if (kingPos) break;
      }
      if (!kingPos) return false;
      return this.isSquareAttacked(kingPos.r, kingPos.c, color === 'w' ? 'b' : 'w', bState);
    }

    // Filters moves that would leave king in check
    getLegalMoves(r, c) {
      const piece = this.board[r][c];
      if (!piece || piece.color !== this.turn) return [];

      const raw = this.getRawMoves(r, c, this.board);
      const legals = [];

      for (const mv of raw) {
        const testBoard = this.cloneBoard(this.board);
        testBoard[mv.r][mv.c] = testBoard[r][c];
        testBoard[r][c] = null;

        // Castling rook helper on test board
        if (mv.castle === 'k') {
          testBoard[r][5] = testBoard[r][7];
          testBoard[r][7] = null;
        } else if (mv.castle === 'q') {
          testBoard[r][3] = testBoard[r][0];
          testBoard[r][0] = null;
        }

        if (!this.isKingInCheck(piece.color, testBoard)) {
          legals.push(mv);
        }
      }
      return legals;
    }

    getAllLegalMoves(color) {
      const all = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.board[r][c] && this.board[r][c].color === color) {
            const moves = this.getLegalMoves(r, c);
            moves.forEach(m => all.push({ from: { r, c }, to: m }));
          }
        }
      }
      return all;
    }

    applyMove(from, to) {
      const piece = this.board[from.r][from.c];
      const target = this.board[to.r][to.c];
      let capturedPiece = null;

      if (target) {
        capturedPiece = { ...target };
        this.captured[target.color].push(capturedPiece);
      }

      // Handle Castling Rook Move
      if (to.castle === 'k') {
        this.board[from.r][5] = this.board[from.r][7];
        this.board[from.r][7] = null;
      } else if (to.castle === 'q') {
        this.board[from.r][3] = this.board[from.r][0];
        this.board[from.r][0] = null;
      }

      // Update Castling Flags
      if (piece.type === 'k') {
        this.castling[piece.color].k = false;
        this.castling[piece.color].q = false;
        this.kings[piece.color] = { r: to.r, c: to.c };
      }
      if (piece.type === 'r') {
        if (from.r === 7 && from.c === 7) this.castling.w.k = false;
        if (from.r === 7 && from.c === 0) this.castling.w.q = false;
        if (from.r === 0 && from.c === 7) this.castling.b.k = false;
        if (from.r === 0 && from.c === 0) this.castling.b.q = false;
      }

      // Pawn Promotion to Queen by default
      let promoted = false;
      if (piece.type === 'p' && (to.r === 0 || to.r === 7)) {
        piece.type = 'q';
        promoted = true;
      }

      piece.moved = true;
      this.board[to.r][to.c] = piece;
      this.board[from.r][from.c] = null;

      // Switch turn
      this.turn = this.turn === 'w' ? 'b' : 'w';

      const inCheck = this.isKingInCheck(this.turn);
      const enemyMoves = this.getAllLegalMoves(this.turn);
      const isCheckmate = inCheck && enemyMoves.length === 0;
      const isStalemate = !inCheck && enemyMoves.length === 0;

      if (isCheckmate || isStalemate) {
        this.isGameOver = true;
      }

      return {
        piece,
        capturedPiece,
        inCheck,
        isCheckmate,
        isStalemate,
        promoted
      };
    }

    // AI Evaluator for Dark Wizard solo mode (Minimax + Positional heuristics)
    evaluateBoard(bState) {
      const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
      let score = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = bState[r][c];
          if (p) {
            let val = pieceValues[p.type];
            // Center control incentive
            if ((r === 3 || r === 4) && (c === 3 || c === 4)) val += 20;
            score += p.color === 'b' ? val : -val;
          }
        }
      }
      return score;
    }
  }

  /* ==========================================================================
     6. UI CONTROLLER & ANIMATION ORCHESTRATOR
     ========================================================================== */
  class WizardChessUI {
    constructor() {
      this.engine = new WizardChessEngine();
      this.domBoard = document.getElementById('chessboard');
      this.fxCanvas = document.getElementById('fx-canvas');
      this.particles = new ParticleEngine(this.fxCanvas);
      this.isAiEnabled = true;
      this.isAiThinking = false;

      // Dialogue UI Elements
      this.dialogueBox = document.getElementById('dialogue-parchment');
      this.dialogueAvatar = document.getElementById('dialogue-avatar');
      this.dialogueSpeaker = document.getElementById('dialogue-speaker');
      this.dialogueText = document.getElementById('dialogue-text');

      // Status Panels
      this.phaseText = document.getElementById('game-phase-text');
      this.whiteBadge = document.getElementById('player-white-badge');
      this.blackBadge = document.getElementById('player-black-badge');
      this.graveyardWhite = document.getElementById('graveyard-white');
      this.graveyardBlack = document.getElementById('graveyard-black');

      // Modal
      this.modal = document.getElementById('game-modal');
      this.modalTitle = document.getElementById('modal-title');
      this.modalDesc = document.getElementById('modal-desc');

      this.initEvents();
      this.render();
      this.speakRandomPawnAdvice();
    }

    initEvents() {
      // Perspective toggle
      const btnView = document.getElementById('btn-toggle-view');
      const arena = document.getElementById('board-arena');
      btnView.addEventListener('click', () => {
        arena.classList.toggle('perspective-3d');
        this.speak("Perspective Weaver", "👁️", "The battlefield shifts angles! Behold the ancient architecture.");
        soundMaster.playPieceSlide();
      });

      // AI mode toggle
      const btnAi = document.getElementById('btn-ai-mode');
      const lblAi = document.getElementById('ai-mode-label');
      btnAi.addEventListener('click', () => {
        this.isAiEnabled = !this.isAiEnabled;
        lblAi.textContent = this.isAiEnabled ? 'AI: Dark Wizard' : 'Mode: Pass & Play';
        this.speak(
          "Magical Arbiter",
          "🧙‍♂️",
          this.isAiEnabled ? "The Dark Wizard AI awakens to challenge your intellect!" : "Pass-and-Play duel mode activated between two students."
        );
        soundMaster.playDialogueChime();
        if (this.isAiEnabled && this.engine.turn === 'b') {
          this.triggerAiMove();
        }
      });

      // Taunt / 4th-Wall chatter
      const btnTaunt = document.getElementById('btn-spell-taunt');
      btnTaunt.addEventListener('click', () => {
        const item = FOURTH_WALL_RANDOMS[Math.floor(Math.random() * FOURTH_WALL_RANDOMS.length)];
        this.speak(item.name, item.avatar, item.text);
        soundMaster.playDialogueChime();
      });

      // Restart
      document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
      document.getElementById('modal-restart').addEventListener('click', () => {
        this.modal.classList.add('hidden');
        this.restartGame();
      });

      // Sound mute toggle
      const btnSound = document.getElementById('btn-sound-toggle');
      const soundIcon = document.getElementById('sound-icon');
      btnSound.addEventListener('click', () => {
        soundMaster.isMuted = !soundMaster.isMuted;
        soundIcon.textContent = soundMaster.isMuted ? '🔇' : '🔊';
        if (!soundMaster.isMuted) soundMaster.playDialogueChime();
      });
    }

    restartGame() {
      this.engine.reset();
      this.modal.classList.add('hidden');
      this.graveyardWhite.innerHTML = '';
      this.graveyardBlack.innerHTML = '';
      this.render();
      this.speak("Grand Arbiter", "⚡", "The pieces reform from ancient dust. Make your first deployment!");
      soundMaster.playCheckChord();
    }

    speak(name, avatar, text) {
      this.dialogueSpeaker.textContent = name;
      this.dialogueAvatar.textContent = avatar;
      this.dialogueText.textContent = `"${text}"`;
      this.dialogueBox.style.transform = 'scale(1.02)';
      setTimeout(() => (this.dialogueBox.style.transform = 'scale(1)'), 200);
    }

    speakRandomPawnAdvice() {
      const msgs = DIALOGUE_VAULT.pawn.taps;
      this.speak(DIALOGUE_VAULT.pawn.name, DIALOGUE_VAULT.pawn.avatar, msgs[Math.floor(Math.random() * msgs.length)]);
    }

    render() {
      this.domBoard.innerHTML = '';
      const inCheck = this.engine.isKingInCheck(this.engine.turn);

      // Status indicator
      const turnColor = this.engine.turn === 'w' ? "White's" : "Dark's";
      this.phaseText.textContent = inCheck ? `${turnColor} King is in CHECK!` : `${turnColor} Turn to Cast`;
      this.phaseText.style.color = inCheck ? 'var(--runic-crimson)' : 'var(--runic-gold)';

      this.whiteBadge.style.opacity = this.engine.turn === 'w' ? '1' : '0.45';
      this.blackBadge.style.opacity = this.engine.turn === 'b' ? '1' : '0.45';

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const tile = document.createElement('div');
          tile.className = `tile ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
          tile.dataset.row = r;
          tile.dataset.col = c;

          // Selection
          if (this.engine.selected && this.engine.selected.r === r && this.engine.selected.c === c) {
            tile.classList.add('selected');
          }

          // Valid Moves highlight
          if (this.engine.selected) {
            const isMove = this.engine.validMoves.find(m => m.r === r && m.c === c);
            if (isMove) {
              if (isMove.capture) tile.classList.add('valid-attack');
              else tile.classList.add('valid-move');
            }
          }

          // Piece placement
          const piece = this.engine.board[r][c];
          if (piece) {
            tile.innerHTML = getPieceSVG(piece.type, piece.color);

            // In-check glow on king
            if (piece.type === 'k' && piece.color === this.engine.turn && inCheck) {
              tile.classList.add('in-check');
            }
          }

          tile.addEventListener('click', () => this.handleTileClick(r, c));
          this.domBoard.appendChild(tile);
        }
      }
    }

    handleTileClick(r, c) {
      if (this.engine.isGameOver || (this.isAiThinking && this.engine.turn === 'b')) return;

      const clickedPiece = this.engine.board[r][c];

      // If a piece of the active player is tapped
      if (clickedPiece && clickedPiece.color === this.engine.turn) {
        if (this.engine.selected && this.engine.selected.r === r && this.engine.selected.c === c) {
          // Repeated tap on same piece -> Trigger 4th-wall personality response!
          this.triggerPiecePersonalityTap(clickedPiece.type);
          soundMaster.playDialogueChime();
          return;
        }

        this.engine.selected = { r, c };
        this.engine.validMoves = this.engine.getLegalMoves(r, c);
        soundMaster.playPieceSlide();
        this.render();
        return;
      }

      // If a destination square is clicked while having a selection
      if (this.engine.selected) {
        const move = this.engine.validMoves.find(m => m.r === r && m.c === c);
        if (move) {
          this.executeMove(this.engine.selected, move);
        } else {
          this.engine.selected = null;
          this.engine.validMoves = [];
          this.render();
        }
      }
    }

    triggerPiecePersonalityTap(type) {
      const typeKey = this.getTypeKey(type);
      const quotes = DIALOGUE_VAULT[typeKey].taps;
      const text = quotes[Math.floor(Math.random() * quotes.length)];
      this.speak(DIALOGUE_VAULT[typeKey].name, DIALOGUE_VAULT[typeKey].avatar, text);
    }

    getTypeKey(type) {
      switch (type) {
        case 'p': return 'pawn';
        case 'n': return 'knight';
        case 'b': return 'bishop';
        case 'r': return 'rook';
        case 'q': return 'queen';
        case 'k': return 'king';
      }
    }

    executeMove(from, to) {
      const movingPiece = this.engine.board[from.r][from.c];
      const targetPiece = this.engine.board[to.r][to.c];
      const typeKey = this.getTypeKey(movingPiece.type);

      // 1. Check if attack animation is needed
      if (targetPiece) {
        this.performArcaneAttack(from, to, movingPiece, targetPiece);
      } else {
        // Simple strategic stone slide
        soundMaster.playPieceSlide();
        const res = this.engine.applyMove(from, to);
        this.engine.selected = null;
        this.engine.validMoves = [];
        this.render();
        this.postMoveDialogue(typeKey, res);
        this.checkGameStatus(res);
      }
    }

    performArcaneAttack(from, to, attacker, victim) {
      const fromTile = this.getTileEl(from.r, from.c);
      const toTile = this.getTileEl(to.r, to.c);
      const attackerEl = fromTile.querySelector('.piece');
      const victimEl = toTile.querySelector('.piece');

      if (attackerEl) attackerEl.classList.add('smashing');
      if (victimEl) victimEl.classList.add('dying');

      soundMaster.playSpellSmash(attacker.type);

      // Calculate canvas particle impact coordinates
      const rect = toTile.getBoundingClientRect();
      const boardRect = this.domBoard.getBoundingClientRect();
      const sparkX = rect.left - boardRect.left + rect.width / 2;
      const sparkY = rect.top - boardRect.top + rect.height / 2;

      this.particles.burst(sparkX, sparkY, attacker.color === 'w' ? 'gold' : 'dark');

      // Update Graveyard Shelf
      this.addToGraveyard(victim);

      // Victim commentary
      const victimKey = this.getTypeKey(victim.type);
      const victimQuotes = DIALOGUE_VAULT[victimKey].slain;
      const deathCry = victimQuotes[Math.floor(Math.random() * victimQuotes.length)];
      this.speak(DIALOGUE_VAULT[victimKey].name, DIALOGUE_VAULT[victimKey].avatar, deathCry);

      setTimeout(() => {
        const res = this.engine.applyMove(from, to);
        this.engine.selected = null;
        this.engine.validMoves = [];
        this.render();
        this.checkGameStatus(res);
      }, 550);
    }

    addToGraveyard(piece) {
      const shelf = piece.color === 'w' ? this.graveyardWhite : this.graveyardBlack;
      const icon = document.createElement('div');
      icon.className = 'graveyard-piece';
      icon.innerHTML = getPieceSVG(piece.type, piece.color);
      shelf.appendChild(icon);
    }

    getTileEl(r, c) {
      return this.domBoard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    }

    postMoveDialogue(typeKey, moveResult) {
      if (moveResult.inCheck) {
        soundMaster.playCheckChord();
        this.speak("Royal Herald", "⚠️", "CHECK! The enemy Sovereign is trapped in arcane crosshairs!");
      } else {
        const quotes = DIALOGUE_VAULT[typeKey].moves;
        const text = quotes[Math.floor(Math.random() * quotes.length)];
        this.speak(DIALOGUE_VAULT[typeKey].name, DIALOGUE_VAULT[typeKey].avatar, text);
      }
    }

    checkGameStatus(res) {
      if (res.isCheckmate) {
        soundMaster.playCheckChord();
        const victor = this.engine.turn === 'w' ? 'Dark Council' : 'White Order';
        this.modalTitle.textContent = "CHECKMATE!";
        this.modalDesc.textContent = `The magical battle ends. Glory to the ${victor}!`;
        this.modal.classList.remove('hidden');
        return;
      }

      if (res.isStalemate) {
        this.modalTitle.textContent = "STALEMATE!";
        this.modalDesc.textContent = "No valid spells remain. The duel concludes in an arcane draw!";
        this.modal.classList.remove('hidden');
        return;
      }

      // If AI's turn
      if (this.isAiEnabled && this.engine.turn === 'b' && !this.engine.isGameOver) {
        this.triggerAiMove();
      }
    }

    /* ==========================================================================
       7. THE DARK WIZARD AI BRAIN
       ========================================================================== */
    triggerAiMove() {
      this.isAiThinking = true;
      this.phaseText.textContent = "Dark Wizard is Chanting...";
      this.phaseText.style.color = "var(--runic-crimson)";

      setTimeout(() => {
        const moves = this.engine.getAllLegalMoves('b');
        if (moves.length === 0) {
          this.isAiThinking = false;
          return;
        }

        // Evaluate Best Move (Prioritize captures & positional score)
        let bestMove = moves[0];
        let bestScore = -999999;

        for (const mv of moves) {
          const testBoard = this.engine.cloneBoard(this.engine.board);
          testBoard[mv.to.r][mv.to.c] = testBoard[mv.from.r][mv.from.c];
          testBoard[mv.from.r][mv.from.c] = null;

          let score = this.engine.evaluateBoard(testBoard);
          if (mv.to.capture) score += 50;

          if (score > bestScore) {
            bestScore = score;
            bestMove = mv;
          }
        }

        this.isAiThinking = false;
        this.executeMove(bestMove.from, bestMove.to);
      }, 700 + Math.random() * 500);
    }
  }

  // Ignite the Wizard's Chess Battlefield once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    new WizardChessUI();
  });
})();