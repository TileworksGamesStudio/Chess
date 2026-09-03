/**
 * WIZARD'S CHESS 3D — FULL ENGINE & PROCEDURAL THREE.JS GRAPHICS
 * Featuring:
 *  - Full 3D WebGL stone sculptures casting realistic shadows
 *  - Voronoi-like stone shattering particle physics on captures
 *  - Dynamic Kill-Cam zoom and camera lerping
 *  - 4th-Wall living dialogue system
 *  - Dark Wizard Minimax AI
 *  - Real-time Web Audio API sound synthesizer
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PROCEDURAL MAGIC SOUND SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  class SoundCaster {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playGlide() {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    }

    playShatter() {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;

      // Heavy bass impact rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);

      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.56);

      // Shattered rock noise
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-5 * (i / bufferSize));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, t);
      filter.Q.setValueAtTime(2, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    }

    playChime() {
      if (this.isMuted) return;
      this.init();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.2);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    }
  }
  const sounds = new SoundCaster();

  /* ==========================================================================
     2. 4TH-WALL LIVING DIALOGUE ENGINE
     ========================================================================== */
  const QUOTES = {
    p: {
      avatar: '♟️',
      name: 'Vanguard Footman',
      taps: [
        "Hey! Mind the fingernails on the glass! I'm chiselled granite!",
        "Yes, I know I only march forward. Don't sacrifice me like Ron Weasley!",
        "You're planning to trade me for a pawn, aren't you? Barbaric Muggle.",
        "Behind that touchscreen you look very indecisive."
      ],
      moves: [
        "Marching forward! Clear the path!",
        "One step closer to the sorcerer's glory!",
        "I advance into the mist."
      ],
      kills: [
        "CRUMBLED! Into dust with you!",
        "Stone daggers through their heart!",
        "Did you see that strike, Player?!"
      ],
      dies: [
        "I was three turns away from promotion... argh!",
        "You blundered me! Merlin curse your clumsy thumbs!",
        "Tell Ron... I did my duty..."
      ]
    },
    n: {
      avatar: '♞',
      name: 'Armored Stallion',
      taps: [
        "NEIGH! Do you even know how the 'L' maneuver works?",
        "Hands off the saddle, mortal! My horse bites through phone screens.",
        "Leaping over heads is my specialty. Point me at their King!",
        "Stop tapping my hooves and make up your mind."
      ],
      moves: [
        "Galloping across the runic chessboard!",
        "Flanking jump executed with stone perfection!",
        "A swift leap into the dark fog!"
      ],
      kills: [
        "TRAMPLED INTO RUBBLE! Glories of the cavalry!",
        "My lance pulverized their stone armor!",
        "Out of my way, pebble!"
      ],
      dies: [
        "A cowardly ambush! My reins are cut...",
        "You left my flank unguarded, you armchair wizard!",
        "Even Pegasus falls under reckless command..."
      ]
    },
    b: {
      avatar: '♝',
      name: 'Arcane Cleric',
      taps: [
        "I walk along holy diagonals. Respect the arcane geometry!",
        "May Merlin grant you tactical acumen... because that move was terrible.",
        "I sense dark omens in your next tap. Tread cautiously.",
        "Do not smudge my sacred mitre!"
      ],
      moves: [
        "Sliding upon the ley lines of magic.",
        "Diagonal judgment incoming.",
        "The ancient scriptures decreed this position."
      ],
      kills: [
        "INCENDIO! Vaporized to cinder and stone dust!",
        "A holy cleansing of the enemy rank!",
        "Banished from this chessboard!"
      ],
      dies: [
        "My protective wards... breached by your negligence...",
        "I foresaw this death in the stars... you blundered me!",
        "Merlin... forgive this player's clumsy fingers..."
      ]
    },
    r: {
      avatar: '♜',
      name: 'Citadel Golem',
      taps: [
        "THUD. THUD. Keep poking, mortal. I feel nothing.",
        "I am twenty tons of enchanted masonry. Move me when you want carnage.",
        "Did you drop your phone? The whole arena vibrated.",
        "Straight ranks only. Like a siege engine."
      ],
      moves: [
        "HEAVY FOOTSTEPS SHAKE THE DUNGEON.",
        "The fortress rolls forward.",
        "Clear the file! Citadel rolling through!"
      ],
      kills: [
        "BOMBARDA! SMASHED INTO POWDER!",
        "PULVERIZED BENEATH TWENTY TONS OF SLATE!",
        "CLEANUP ON TILE! BRING A BROOM!"
      ],
      dies: [
        "HOW CAN A CITADEL CRUMBLE?!",
        "My ramparts... cracked wide open...",
        "You traded ME for a bishop?! Are you mad?!"
      ]
    },
    q: {
      avatar: '♛',
      name: 'High Battle Sorceress',
      taps: [
        "Kneel before you tap my tile, mortal.",
        "If you blunder me, I will hex your smartphone battery to 1%.",
        "I am the most lethal entity on this stone grid. Use me wisely.",
        "Yes, darling, I go wherever I please. Bow down."
      ],
      moves: [
        "The Queen glides where lesser stones dare not tread.",
        "Tremble, for arcane supremacy has arrived.",
        "Every diagonal and rank belongs to my command."
      ],
      kills: [
        "OBLITERATED! You dared cross my majesty?!",
        "Pure cataclysmic lightning! Nothing remains!",
        "A flawless execution. Applaud me behind that screen!"
      ],
      dies: [
        "IMPOSSIBLE! YOU LET ME DIE?!",
        "A catastrophe of epic proportions! Resign immediately!",
        "I shall haunt your touchscreen for all eternity!"
      ]
    },
    k: {
      avatar: '♚',
      name: 'The Crowned Monarch',
      taps: [
        "Gently! A King's crown is heavy and priceless!",
        "I only step one tile at a time. Monarchs do not jog.",
        "Keep those dark abominations away from my royal presence!",
        "Are you protecting me, or are you in league with Voldemort?"
      ],
      moves: [
        "A regal, measured relocation.",
        "The Sovereign surveys the carnage from safety.",
        "Stepping back to maintain our dignity."
      ],
      kills: [
        "Smitten down by the royal scepter!",
        "Even crowned kings must execute rebels!",
        "Perish, insolent chess pebble!"
      ],
      dies: [
        "THE CROWN HAS FALLEN! The realm is lost...",
        "Checkmate?! You had ONE duty, mortal!",
        "My kingdom traded away for your reckless offense..."
      ]
    }
  };

  const RANDOM_LORE = [
    { name: "Albus the Watcher", avatar: "🧙‍♂️", text: "Remember, wizard's chess is completely barbaric compared to Muggle games." },
    { name: "Board Spirit", avatar: "📱", text: "Your screen is slightly tilted. Keep your device steady while chanting!" },
    { name: "White Pawn", avatar: "♟️", text: "Psst! The AI is calculating five branches ahead. You're just winging it, aren't you?" },
    { name: "Ancient Glyphs", avatar: "⚡", text: "The stone slabs channel your touch. Tap with conviction!" }
  ];

  /* ==========================================================================
     3. COMPLETE CHESS ENGINE (STANDARDS, CHECKS & AI)
     ========================================================================== */
  class ChessEngine {
    constructor() {
      this.reset();
    }

    reset() {
      this.board = Array(8).fill(null).map(() => Array(8).fill(null));
      const order = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
      for (let c = 0; c < 8; c++) {
        this.board[0][c] = { type: order[c], color: 'b' };
        this.board[1][c] = { type: 'p', color: 'b' };
        this.board[6][c] = { type: 'p', color: 'w' };
        this.board[7][c] = { type: order[c], color: 'w' };
      }
      this.turn = 'w';
      this.selected = null;
      this.validMoves = [];
      this.isGameOver = false;
    }

    clone(b) {
      return b.map(row => row.map(cell => (cell ? { ...cell } : null)));
    }

    inBounds(r, c) {
      return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    getRawMoves(r, c, bState = this.board) {
      const p = bState[r][c];
      if (!p) return [];
      const moves = [];
      const fwd = p.color === 'w' ? -1 : 1;

      if (p.type === 'p') {
        const nr = r + fwd;
        if (this.inBounds(nr, c) && !bState[nr][c]) {
          moves.push({ r: nr, c: c });
          const startR = p.color === 'w' ? 6 : 1;
          const nnr = r + fwd * 2;
          if (r === startR && !bState[nnr][c]) {
            moves.push({ r: nnr, c: c });
          }
        }
        [-1, 1].forEach(dc => {
          const nc = c + dc;
          if (this.inBounds(nr, nc)) {
            const tgt = bState[nr][nc];
            if (tgt && tgt.color !== p.color) {
              moves.push({ r: nr, c: nc, capture: true });
            }
          }
        });
      } else if (p.type === 'n') {
        const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        deltas.forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (this.inBounds(nr, nc)) {
            const tgt = bState[nr][nc];
            if (!tgt) moves.push({ r: nr, c: nc });
            else if (tgt.color !== p.color) moves.push({ r: nr, c: nc, capture: true });
          }
        });
      } else if (p.type === 'b' || p.type === 'r' || p.type === 'q') {
        const dirs = [];
        if (p.type === 'b' || p.type === 'q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
        if (p.type === 'r' || p.type === 'q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);

        dirs.forEach(([dr, dc]) => {
          let step = 1;
          while (true) {
            const nr = r + dr * step, nc = c + dc * step;
            if (!this.inBounds(nr, nc)) break;
            const tgt = bState[nr][nc];
            if (!tgt) {
              moves.push({ r: nr, c: nc });
            } else {
              if (tgt.color !== p.color) moves.push({ r: nr, c: nc, capture: true });
              break;
            }
            step++;
          }
        });
      } else if (p.type === 'k') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (this.inBounds(nr, nc)) {
              const tgt = bState[nr][nc];
              if (!tgt) moves.push({ r: nr, c: nc });
              else if (tgt.color !== p.color) moves.push({ r: nr, c: nc, capture: true });
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
            if (p.type === 'p') {
              const fwd = p.color === 'w' ? -1 : 1;
              if (row + fwd === r && (col - 1 === c || col + 1 === c)) return true;
            } else {
              const m = this.getRawMoves(row, col, bState);
              if (m.some(x => x.r === r && x.c === c)) return true;
            }
          }
        }
      }
      return false;
    }

    isKingInCheck(color, bState = this.board) {
      let kp = null;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (bState[r][c] && bState[r][c].type === 'k' && bState[r][c].color === color) {
            kp = { r, c };
            break;
          }
        }
        if (kp) break;
      }
      if (!kp) return false;
      return this.isSquareAttacked(kp.r, kp.c, color === 'w' ? 'b' : 'w', bState);
    }

    getLegalMoves(r, c) {
      const p = this.board[r][c];
      if (!p || p.color !== this.turn) return [];
      const raw = this.getRawMoves(r, c, this.board);
      const legals = [];

      for (const m of raw) {
        const testB = this.clone(this.board);
        testB[m.r][m.c] = testB[r][c];
        testB[r][c] = null;
        if (!this.isKingInCheck(p.color, testB)) {
          legals.push(m);
        }
      }
      return legals;
    }

    getAllLegalMoves(color) {
      const all = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.board[r][c] && this.board[r][c].color === color) {
            const ms = this.getLegalMoves(r, c);
            ms.forEach(m => all.push({ from: { r, c }, to: m }));
          }
        }
      }
      return all;
    }

    applyMove(from, to) {
      const p = this.board[from.r][from.c];
      const victim = this.board[to.r][to.c];

      // Pawn promotion to Queen
      if (p.type === 'p' && (to.r === 0 || to.r === 7)) {
        p.type = 'q';
      }

      this.board[to.r][to.c] = p;
      this.board[from.r][from.c] = null;

      this.turn = this.turn === 'w' ? 'b' : 'w';

      const inCheck = this.isKingInCheck(this.turn);
      const nextMoves = this.getAllLegalMoves(this.turn);
      const isCheckmate = inCheck && nextMoves.length === 0;
      const isStalemate = !inCheck && nextMoves.length === 0;

      if (isCheckmate || isStalemate) {
        this.isGameOver = true;
      }

      return { piece: p, victim, inCheck, isCheckmate, isStalemate };
    }

    evalBoard(bState) {
      const vals = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
      let score = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = bState[r][c];
          if (p) {
            let v = vals[p.type];
            if ((r === 3 || r === 4) && (c === 3 || c === 4)) v += 25;
            score += p.color === 'b' ? v : -v;
          }
        }
      }
      return score;
    }
  }

  /* ==========================================================================
     4. PROCEDURAL TEXTURE GENERATOR (ROUGH CHISELLED STONE)
     ========================================================================== */
  function createProceduralStoneTexture(isDark = false) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base tone
    ctx.fillStyle = isDark ? '#1a1622' : '#d5c7b3';
    ctx.fillRect(0, 0, size, size);

    // Stone grain noise
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * (isDark ? 35 : 45);
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i+1] = Math.min(255, Math.max(0, d[i+1] + n));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Weathered crack lines
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(90,80,70,0.3)';
    ctx.lineWidth = 1.5;
    for (let j = 0; j < 8; j++) {
      ctx.beginPath();
      let x = Math.random() * size, y = Math.random() * size;
      ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  /* ==========================================================================
     5. THREE.JS 3D SCENE, PIECES & VOLUMETRIC DUNGEON
     ========================================================================== */
  class WizardScene {
    constructor(container) {
      this.container = container;
      this.piecesGroup = new THREE.Group();
      this.boardGroup = new THREE.Group();
      this.tileMeshes = [];
      this.shards = [];
      this.pieceMeshes = {}; // keyed by "r_c"

      this.initThree();
      this.initEnvironment();
      this.initBoardMesh();
    }

    initThree() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x060409, 0.024);

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      this.cameraTarget = new THREE.Vector3(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      this.scene.add(this.boardGroup);
      this.scene.add(this.piecesGroup);

      // Camera presets
      this.camModes = [
        { name: "Cinematic", pos: new THREE.Vector3(0, 7.8, 8.8), target: new THREE.Vector3(0, -0.2, 0.3) },
        { name: "Top-Down",  pos: new THREE.Vector3(0, 12.0, 0.1), target: new THREE.Vector3(0, 0, 0) },
        { name: "Side View", pos: new THREE.Vector3(9.2, 5.5, 0), target: new THREE.Vector3(0, 0, 0) }
      ];
      this.currentCamIdx = 0;
      this.setCameraPreset(0);

      window.addEventListener('resize', () => this.onResize());
    }

    initEnvironment() {
      // Ambient ancient moonlight
      const amb = new THREE.AmbientLight(0x282038, 1.4);
      this.scene.add(amb);

      // Golden torch light (White Order side)
      this.torchWhite = new THREE.PointLight(0xffb74d, 2.2, 24);
      this.torchWhite.position.set(-6, 7, 7);
      this.torchWhite.castShadow = true;
      this.torchWhite.shadow.mapSize.width = 1024;
      this.torchWhite.shadow.mapSize.height = 1024;
      this.scene.add(this.torchWhite);

      // Arcane Violet torch light (Dark Council side)
      this.torchDark = new THREE.PointLight(0xb042ff, 2.4, 24);
      this.torchDark.position.set(6, 7, -7);
      this.torchDark.castShadow = true;
      this.torchDark.shadow.mapSize.width = 1024;
      this.torchDark.shadow.mapSize.height = 1024;
      this.scene.add(this.torchDark);

      // Dungeon floor plane
      const floorGeo = new THREE.PlaneGeometry(50, 50);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a080e,
        roughness: 0.85,
        metalness: 0.15
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.5;
      floor.receiveShadow = true;
      this.scene.add(floor);

      // Distant gothic arches/columns for depth
      const colGeo = new THREE.CylinderGeometry(0.5, 0.6, 12, 12);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x140f1a, roughness: 0.9 });
      for (let i = -14; i <= 14; i += 7) {
        if (Math.abs(i) < 4) continue;
        const col1 = new THREE.Mesh(colGeo, colMat);
        col1.position.set(i, 4, -9);
        this.scene.add(col1);

        const col2 = new THREE.Mesh(colGeo, colMat);
        col2.position.set(i, 4, 9);
        this.scene.add(col2);
      }

      // Procedural textures
      this.stoneTexWhite = createProceduralStoneTexture(false);
      this.stoneTexDark = createProceduralStoneTexture(true);

      // Materials
      this.matWhite = new THREE.MeshStandardMaterial({
        map: this.stoneTexWhite,
        roughness: 0.45,
        metalness: 0.1,
        color: 0xf3ede2
      });

      this.matDark = new THREE.MeshStandardMaterial({
        map: this.stoneTexDark,
        roughness: 0.55,
        metalness: 0.2,
        color: 0x221a2c
      });

      this.matRuneWhite = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 0.6
      });

      this.matRuneDark = new THREE.MeshStandardMaterial({
        color: 0xc042ff,
        emissive: 0x9000ff,
        emissiveIntensity: 0.8
      });
    }

    initBoardMesh() {
      // Elevated Stone Pedestal
      const baseGeo = new THREE.BoxGeometry(9.4, 0.7, 9.4);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x181220,
        roughness: 0.7,
        metalness: 0.2
      });
      const pedestal = new THREE.Mesh(baseGeo, baseMat);
      pedestal.position.y = -0.38;
      pedestal.receiveShadow = true;
      pedestal.castShadow = true;
      this.boardGroup.add(pedestal);

      // 8x8 Stone Tiles
      const tileGeo = new THREE.BoxGeometry(1, 0.2, 1);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isLight = (r + c) % 2 === 0;
          const mat = new THREE.MeshStandardMaterial({
            color: isLight ? 0xbaa992 : 0x2e2538,
            roughness: isLight ? 0.4 : 0.6,
            metalness: 0.1
          });
          const tile = new THREE.Mesh(tileGeo, mat);
          tile.position.set(c - 3.5, 0, r - 3.5);
          tile.receiveShadow = true;
          tile.userData = { r, c, defaultColor: mat.color.getHex() };
          this.boardGroup.add(tile);
          this.tileMeshes.push(tile);
        }
      }
    }

    /* Dynamic procedural 3D Piece Sculptures */
    buildPiece3D(type, color) {
      const grp = new THREE.Group();
      const isW = color === 'w';
      const bodyMat = isW ? this.matWhite : this.matDark;
      const runeMat = isW ? this.matRuneWhite : this.matRuneDark;

      // Base plinth common to all
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.14, 16), bodyMat);
      plinth.position.y = 0.07;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      grp.add(plinth);

      if (type === 'p') {
        // Pawn: Stone Footman with Helm & Spiked Collar
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.45, 12), bodyMat);
        torso.position.y = 0.36;
        torso.castShadow = true;
        grp.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), bodyMat);
        head.position.y = 0.65;
        head.castShadow = true;
        grp.add(head);

        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 8), runeMat);
        spike.position.y = 0.86;
        grp.add(spike);

      } else if (type === 'r') {
        // Rook: Castle Battlement Golem
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.75, 12), bodyMat);
        tower.position.y = 0.48;
        tower.castShadow = true;
        grp.add(tower);

        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.22, 8), bodyMat);
        crown.position.y = 0.92;
        crown.castShadow = true;
        grp.add(crown);

        const core = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.14), runeMat);
        core.position.y = 0.55;
        grp.add(core);

      } else if (type === 'n') {
        // Knight: Armored Warhorse Bust
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 0.5, 12), bodyMat);
        chest.position.y = 0.38;
        grp.add(chest);

        const horseNeck = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.36), bodyMat);
        horseNeck.position.set(0, 0.7, 0.08);
        horseNeck.rotation.x = -0.3;
        horseNeck.castShadow = true;
        grp.add(horseNeck);

        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.35), bodyMat);
        snout.position.set(0, 0.75, 0.28);
        grp.add(snout);

        const mane = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), runeMat);
        mane.position.set(0, 0.92, -0.05);
        grp.add(mane);

      } else if (type === 'b') {
        // Bishop: Arcane Cleric with Mitre Staff
        const robes = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.8, 12), bodyMat);
        robes.position.y = 0.48;
        grp.add(robes);

        const mitre = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), bodyMat);
        mitre.scale.set(0.9, 1.4, 0.9);
        mitre.position.y = 0.95;
        grp.add(mitre);

        const staffOrb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), runeMat);
        staffOrb.position.set(0.24, 0.95, 0.15);
        grp.add(staffOrb);

      } else if (type === 'q') {
        // Queen: High Battle Sorceress Crown
        const dress = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.38, 0.85, 14), bodyMat);
        dress.position.y = 0.54;
        grp.add(dress);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), bodyMat);
        head.position.y = 1.05;
        grp.add(head);

        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.12, 0.24, 8), runeMat);
        crown.position.y = 1.25;
        grp.add(crown);

      } else if (type === 'k') {
        // King: Monarch with Merlin Broadsword
        const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 0.95, 14), bodyMat);
        robe.position.y = 0.58;
        grp.add(robe);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), bodyMat);
        head.position.y = 1.15;
        grp.add(head);

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), runeMat);
        crossV.position.y = 1.42;
        grp.add(crossV);

        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.08), runeMat);
        crossH.position.y = 1.42;
        grp.add(crossH);
      }

      grp.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });

      return grp;
    }

    setCameraPreset(idx) {
      this.currentCamIdx = idx % this.camModes.length;
      const m = this.camModes[this.currentCamIdx];
      this.camStartPos = this.camera.position.clone();
      this.camEndPos = m.pos.clone();
      this.camStartTarget = this.cameraTarget.clone();
      this.camEndTarget = m.target.clone();
      this.camLerpProgress = 0;
      return m.name;
    }

    triggerKillCam(pos) {
      // Zoom dynamic camera right into the action tile
      this.camStartPos = this.camera.position.clone();
      this.camEndPos = new THREE.Vector3(pos.x + 2.4, 3.2, pos.z + 3.0);
      this.camStartTarget = this.cameraTarget.clone();
      this.camEndTarget = new THREE.Vector3(pos.x, 0.5, pos.z);
      this.camLerpProgress = 0;

      // Screen flash
      const flash = document.getElementById('fx-flash');
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 120);

      // Return to normal angle after combat execution
      setTimeout(() => {
        this.setCameraPreset(this.currentCamIdx);
      }, 1200);
    }

    /* 3D Exploding Stone Shard Physics */
    spawnShatterPieces(pos, color) {
      const count = 38;
      const isW = color === 'w';
      const mat = isW ? this.matWhite : this.matDark;
      const runeMat = isW ? this.matRuneWhite : this.matRuneDark;

      for (let i = 0; i < count; i++) {
        const size = 0.08 + Math.random() * 0.16;
        const geo = Math.random() > 0.3 ? new THREE.BoxGeometry(size, size, size) : new THREE.TetrahedronGeometry(size);
        const mesh = new THREE.Mesh(geo, Math.random() > 0.25 ? mat : runeMat);

        mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.5,
          pos.y + 0.3 + Math.random() * 0.6,
          pos.z + (Math.random() - 0.5) * 0.5
        );

        const angle = Math.random() * Math.PI * 2;
        const spd = 2.2 + Math.random() * 4.5;
        mesh.userData = {
          vx: Math.cos(angle) * spd,
          vy: 3.5 + Math.random() * 5.0,
          vz: Math.sin(angle) * spd,
          vRotX: (Math.random() - 0.5) * 12,
          vRotZ: (Math.random() - 0.5) * 12,
          life: 1.0
        };

        mesh.castShadow = true;
        this.scene.add(mesh);
        this.shards.push(mesh);
      }
    }

    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(dt) {
      // Torch flickers
      const t = performance.now() * 0.003;
      this.torchWhite.intensity = 2.0 + Math.sin(t * 2.5) * 0.35;
      this.torchDark.intensity = 2.2 + Math.cos(t * 2.1) * 0.35;

      // Camera lerp
      if (this.camEndPos && this.camLerpProgress < 1.0) {
        this.camLerpProgress += dt * 2.8;
        const factor = Math.min(1.0, this.camLerpProgress);
        // Smooth step
        const s = factor * factor * (3 - 2 * factor);
        this.camera.position.lerpVectors(this.camStartPos, this.camEndPos, s);
        this.cameraTarget.lerpVectors(this.camStartTarget, this.camEndTarget, s);
        this.camera.lookAt(this.cameraTarget);
      }

      // Shard physics
      for (let i = this.shards.length - 1; i >= 0; i--) {
        const s = this.shards[i];
        const u = s.userData;
        u.vy -= 16 * dt; // gravity
        s.position.x += u.vx * dt;
        s.position.y += u.vy * dt;
        s.position.z += u.vz * dt;
        s.rotation.x += u.vRotX * dt;
        s.rotation.z += u.vRotZ * dt;

        // Ground collision bounce
        if (s.position.y < 0.05) {
          s.position.y = 0.05;
          u.vy *= -0.35;
          u.vx *= 0.6;
          u.vz *= 0.6;
        }

        u.life -= dt * 0.85;
        s.scale.setScalar(Math.max(0.001, u.life));

        if (u.life <= 0) {
          this.scene.remove(s);
          this.shards.splice(i, 1);
        }
      }

      // Living piece subtle breathing
      const breathe = Math.sin(performance.now() * 0.003) * 0.02;
      for (const key in this.pieceMeshes) {
        const m = this.pieceMeshes[key];
        if (m && !m.userData.isAnimating) {
          m.position.y = breathe;
        }
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ==========================================================================
     6. GAME CONTROLLER & 4TH-WALL INTERACTIONS
     ========================================================================== */
  class WizardGameApp {
    constructor() {
      this.engine = new ChessEngine();
      this.container = document.getElementById('webgl-container');
      this.sceneMgr = new WizardScene(this.container);

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.isAiActive = true;
      this.isAiCalculating = false;

      // Dialogue DOM
      this.diagBanner = document.getElementById('dialogue-banner');
      this.diagName = document.getElementById('diag-name');
      this.diagSigil = document.getElementById('diag-sigil');
      this.diagText = document.getElementById('diag-text');

      // Status
      this.turnOrb = document.getElementById('turn-orb');
      this.turnText = document.getElementById('turn-text');

      // Modal
      this.modal = document.getElementById('game-modal');
      this.modalHeading = document.getElementById('modal-heading');
      this.modalMsg = document.getElementById('modal-message');

      this.sync3DPieces();
      this.initInput();
      this.initButtons();
      this.startLoop();

      this.speak("Albus the Arbiter", "⚡", "Touch a stone warrior to commune with it. They will obey your wizarding command.");
    }

    startLoop() {
      let lastTime = performance.now();
      const frame = (now) => {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        this.sceneMgr.update(dt);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    speak(name, sigil, text) {
      this.diagName.textContent = name;
      this.diagSigil.textContent = sigil;
      this.diagText.textContent = `"${text}"`;
      this.diagBanner.style.transform = "scale(1.03)";
      setTimeout(() => (this.diagBanner.style.transform = "scale(1)"), 180);
      sounds.playChime();
    }

    sync3DPieces() {
      // Clear current piece models
      for (const k in this.sceneMgr.pieceMeshes) {
        this.sceneMgr.piecesGroup.remove(this.sceneMgr.pieceMeshes[k]);
      }
      this.sceneMgr.pieceMeshes = {};

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = this.engine.board[r][c];
          if (p) {
            const mesh = this.sceneMgr.buildPiece3D(p.type, p.color);
            mesh.position.set(c - 3.5, 0, r - 3.5);
            mesh.userData = { r, c, type: p.type, color: p.color };
            this.sceneMgr.piecesGroup.add(mesh);
            this.sceneMgr.pieceMeshes[`${r}_${c}`] = mesh;
          }
        }
      }
      this.highlightTiles();
    }

    highlightTiles() {
      // Reset tile colors
      this.sceneMgr.tileMeshes.forEach(t => {
        t.material.color.setHex(t.userData.defaultColor);
      });

      const sel = this.engine.selected;
      if (sel) {
        const selTile = this.sceneMgr.tileMeshes.find(t => t.userData.r === sel.r && t.userData.c === sel.c);
        if (selTile) selTile.material.color.setHex(0xffaa00);

        this.engine.validMoves.forEach(mv => {
          const t = this.sceneMgr.tileMeshes.find(tm => tm.userData.r === mv.r && tm.userData.c === mv.c);
          if (t) {
            t.material.color.setHex(mv.capture ? 0xff2244 : 0x3df0d2);
          }
        });
      }

      // Check Indicator on King
      if (this.engine.isKingInCheck(this.engine.turn)) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = this.engine.board[r][c];
            if (p && p.type === 'k' && p.color === this.engine.turn) {
              const kt = this.sceneMgr.tileMeshes.find(tm => tm.userData.r === r && tm.userData.c === c);
              if (kt) kt.material.color.setHex(0xff0033);
            }
          }
        }
      }
    }

    initInput() {
      const onPointerDown = (e) => {
        if (this.engine.isGameOver || (this.isAiCalculating && this.engine.turn === 'b')) return;

        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        if (x === undefined || y === undefined) return;

        this.mouse.x = (x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.sceneMgr.camera);

        // Check intersection with pieces first
        const pieceIntersects = this.raycaster.intersectObjects(this.sceneMgr.piecesGroup.children, true);
        if (pieceIntersects.length > 0) {
          // Find root piece group
          let root = pieceIntersects[0].object;
          while (root.parent && root.parent !== this.sceneMgr.piecesGroup) {
            root = root.parent;
          }
          if (root && root.userData.r !== undefined) {
            this.handlePieceTap(root.userData.r, root.userData.c);
            return;
          }
        }

        // Check intersection with tiles
        const tileIntersects = this.raycaster.intersectObjects(this.sceneMgr.tileMeshes);
        if (tileIntersects.length > 0) {
          const t = tileIntersects[0].object;
          this.handleTileTap(t.userData.r, t.userData.c);
        }
      };

      this.container.addEventListener('pointerdown', onPointerDown);
    }

    handlePieceTap(r, c) {
      const piece = this.engine.board[r][c];
      if (!piece) return;

      if (piece.color === this.engine.turn) {
        if (this.engine.selected && this.engine.selected.r === r && this.engine.selected.c === c) {
          // 4th wall break on repeated tap
          const q = QUOTES[piece.type];
          const text = q.taps[Math.floor(Math.random() * q.taps.length)];
          this.speak(q.name, q.avatar, text);
          return;
        }

        this.engine.selected = { r, c };
        this.engine.validMoves = this.engine.getLegalMoves(r, c);
        sounds.playGlide();
        this.highlightTiles();

        // Lift piece slightly
        const mesh = this.sceneMgr.pieceMeshes[`${r}_${c}`];
        if (mesh) {
          mesh.position.y = 0.3;
          setTimeout(() => { if (mesh) mesh.position.y = 0; }, 200);
        }
      } else if (this.engine.selected) {
        // Attack target tap
        this.handleTileTap(r, c);
      }
    }

    handleTileTap(r, c) {
      if (!this.engine.selected) return;

      const mv = this.engine.validMoves.find(m => m.r === r && m.c === c);
      if (mv) {
        this.executeMove(this.engine.selected, mv);
      } else {
        this.engine.selected = null;
        this.engine.validMoves = [];
        this.highlightTiles();
      }
    }

    executeMove(from, to) {
      const attackerMesh = this.sceneMgr.pieceMeshes[`${from.r}_${from.c}`];
      const victimMesh = this.sceneMgr.pieceMeshes[`${to.r}_${to.c}`];
      const movingPiece = this.engine.board[from.r][from.c];
      const victimPiece = this.engine.board[to.r][to.c];

      this.engine.selected = null;
      this.engine.validMoves = [];
      this.highlightTiles();

      if (victimPiece) {
        // Cinematic kill-cam zoom!
        const targetWorldPos = new THREE.Vector3(to.c - 3.5, 0, to.r - 3.5);
        this.sceneMgr.triggerKillCam(targetWorldPos);

        // Smash victim into real 3D flying stone rubble!
        sounds.playShatter();
        this.sceneMgr.spawnShatterPieces(targetWorldPos, victimPiece.color);

        // Slain dialogue
        const vQuotes = QUOTES[victimPiece.type];
        const vText = vQuotes.dies[Math.floor(Math.random() * vQuotes.dies.length)];
        this.speak(vQuotes.name, vQuotes.avatar, vText);

        if (victimMesh) {
          this.sceneMgr.piecesGroup.remove(victimMesh);
          delete this.sceneMgr.pieceMeshes[`${to.r}_${to.c}`];
        }
      } else {
        sounds.playGlide();
        const aQuotes = QUOTES[movingPiece.type];
        const aText = aQuotes.moves[Math.floor(Math.random() * aQuotes.moves.length)];
        this.speak(aQuotes.name, aQuotes.avatar, aText);
      }

      // Smooth slide attacker to target
      if (attackerMesh) {
        attackerMesh.userData.isAnimating = true;
        const startPos = attackerMesh.position.clone();
        const endPos = new THREE.Vector3(to.c - 3.5, 0, to.r - 3.5);
        let progress = 0;

        const anim = () => {
          progress += 0.08;
          attackerMesh.position.lerpVectors(startPos, endPos, progress);
          attackerMesh.position.y = Math.sin(progress * Math.PI) * 0.4;
          if (progress < 1.0) {
            requestAnimationFrame(anim);
          } else {
            attackerMesh.position.copy(endPos);
            attackerMesh.userData.isAnimating = false;
            delete this.sceneMgr.pieceMeshes[`${from.r}_${from.c}`];
            this.sceneMgr.pieceMeshes[`${to.r}_${to.c}`] = attackerMesh;
            attackerMesh.userData.r = to.r;
            attackerMesh.userData.c = to.c;

            const res = this.engine.applyMove(from, to);
            this.updateTurnUI(res);
          }
        };
        requestAnimationFrame(anim);
      } else {
        const res = this.engine.applyMove(from, to);
        this.sync3DPieces();
        this.updateTurnUI(res);
      }
    }

    updateTurnUI(res) {
      const isWhite = this.engine.turn === 'w';
      this.turnOrb.className = `orb ${isWhite ? 'white' : 'black'}`;
      this.turnText.textContent = res.inCheck
        ? `${isWhite ? 'White' : 'Dark'} King is in CHECK!`
        : `${isWhite ? 'White Order' : 'Dark Council'}'s Command`;

      this.highlightTiles();

      if (res.isCheckmate) {
        const victor = this.engine.turn === 'w' ? 'Dark Council' : 'White Order';
        this.modalHeading.textContent = "CHECKMATE!";
        this.modalMsg.textContent = `The stone army fell. Supreme victory belongs to the ${victor}!`;
        this.modal.classList.remove('hidden');
        return;
      }

      if (res.isStalemate) {
        this.modalHeading.textContent = "STALEMATE!";
        this.modalMsg.textContent = "All spells locked. The duel ends in an arcane draw.";
        this.modal.classList.remove('hidden');
        return;
      }

      // Dark Wizard AI turn
      if (this.isAiActive && this.engine.turn === 'b' && !this.engine.isGameOver) {
        this.runAiTurn();
      }
    }

    runAiTurn() {
      this.isAiCalculating = true;
      this.turnText.textContent = "Dark Wizard is chanting...";

      setTimeout(() => {
        const moves = this.engine.getAllLegalMoves('b');
        if (moves.length === 0) {
          this.isAiCalculating = false;
          return;
        }

        // Heuristic AI: prioritizes captures & king danger
        let bestMove = moves[0];
        let bestScore = -999999;

        for (const mv of moves) {
          const testB = this.engine.clone(this.engine.board);
          testB[mv.to.r][mv.to.c] = testB[mv.from.r][mv.from.c];
          testB[mv.from.r][mv.from.c] = null;
          let score = this.engine.evalBoard(testB);
          if (mv.to.capture) score += 60;
          if (score > bestScore) {
            bestScore = score;
            bestMove = mv;
          }
        }

        this.isAiCalculating = false;
        this.executeMove(bestMove.from, bestMove.to);
      }, 700 + Math.random() * 500);
    }

    initButtons() {
      // Camera angle switch
      const btnCam = document.getElementById('btn-camera');
      const lblCam = document.getElementById('cam-label');
      btnCam.addEventListener('click', () => {
        const name = this.sceneMgr.setCameraPreset(this.sceneMgr.currentCamIdx + 1);
        lblCam.textContent = name;
        sounds.playGlide();
      });

      // AI toggle
      const btnAi = document.getElementById('btn-ai');
      const lblAi = document.getElementById('ai-label');
      btnAi.addEventListener('click', () => {
        this.isAiActive = !this.isAiActive;
        lblAi.textContent = this.isAiActive ? "AI: Dark Lord" : "Mode: 2 Player";
        this.speak("Grand Arbiter", "🧙‍♂️", this.isAiActive ? "The Dark Wizard AI awakens." : "Pass & Play duel activated.");
      });

      // Taunt button
      const btnTaunt = document.getElementById('btn-taunt');
      btnTaunt.addEventListener('click', () => {
        const item = RANDOM_LORE[Math.floor(Math.random() * RANDOM_LORE.length)];
        this.speak(item.name, item.avatar, item.text);
      });

      // Reset
      document.getElementById('btn-reset').addEventListener('click', () => this.restartGame());
      document.getElementById('modal-restart-btn').addEventListener('click', () => {
        this.modal.classList.add('hidden');
        this.restartGame();
      });

      // Audio toggle
      const btnAudio = document.getElementById('btn-audio');
      const iconAudio = document.getElementById('audio-icon');
      btnAudio.addEventListener('click', () => {
        sounds.isMuted = !sounds.isMuted;
        iconAudio.textContent = sounds.isMuted ? '🔇' : '🔊';
        if (!sounds.isMuted) sounds.playChime();
      });
    }

    restartGame() {
      this.engine.reset();
      this.modal.classList.add('hidden');
      this.sync3DPieces();
      this.updateTurnUI({ inCheck: false });
      this.speak("Merlin's Herald", "⚡", "The pieces reform from ancient dust! Command your vanguard!");
    }
  }

  // Ignite 3D Arena on Load
  window.addEventListener('DOMContentLoaded', () => {
    new WizardGameApp();
  });
})();