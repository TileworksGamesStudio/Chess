/**
 * WIZARD'S CHESS: THE GRAND DUEL
 * A complete 3D magical chess experience with procedural Three.js geometry,
 * GSAP combat choreography, Web Audio API sound synthesis, and Minimax AI.
 */

// ==========================================
// 1. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================
class MagicSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.ctx) {
      this.ctx = new AudioContextClass();
    }
  }

  ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSelect() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playStoneMove() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(65, this.ctx.currentTime + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.42);
  }

  playSpellCast() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playShatterExplosion() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, this.ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.5);
    subGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start();
    subOsc.stop(this.ctx.currentTime + 0.6);

    // Stone shatter noise burst
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSource.start();
  }

  playVictoryChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 1.3);
    });
  }
}

const soundEngine = new MagicSoundEngine();

// ==========================================
// 2. PROCEDURAL 3D PIECE GENERATOR
// ==========================================
class PieceMeshBuilder {
  constructor() {
    // Ivory / White Lumos Material
    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xede8dc,
      roughness: 0.25,
      metalness: 0.15,
      bumpScale: 0.05
    });

    // Obsidian / Black Nox Material
    this.blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1622,
      roughness: 0.35,
      metalness: 0.4,
      bumpScale: 0.08
    });

    // Glowing accents
    this.whiteRuneMat = new THREE.MeshStandardMaterial({
      color: 0x81d4fa,
      emissive: 0x29b6f6,
      emissiveIntensity: 0.75,
      roughness: 0.1
    });

    this.blackRuneMat = new THREE.MeshStandardMaterial({
      color: 0xff4081,
      emissive: 0xf50057,
      emissiveIntensity: 0.75,
      roughness: 0.1
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.3
    });
  }

  createPedestal(material, runeMat) {
    const group = new THREE.Group();
    // Stepped plinth
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.15, 16);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.075;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Glowing Leyline Inset
    const runeRingGeo = new THREE.TorusGeometry(0.36, 0.02, 8, 24);
    const ring = new THREE.Mesh(runeRingGeo, runeMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    group.add(ring);

    return group;
  }

  createPawn(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Footman body armor
    const bodyGeo = new THREE.ConeGeometry(0.25, 0.6, 12);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.y = 0.42;
    body.castShadow = true;
    group.add(body);

    // Shield
    const shieldGeo = new THREE.BoxGeometry(0.12, 0.32, 0.04);
    const shield = new THREE.Mesh(shieldGeo, this.goldTrimMat);
    shield.position.set(0.2, 0.45, 0.12);
    shield.rotation.y = -Math.PI / 6;
    group.add(shield);

    // Spiked War Helmet
    const headGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 0.75;
    head.castShadow = true;
    group.add(head);

    return group;
  }

  createRook(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Castle Bastion Column
    const colGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.75, 12);
    const col = new THREE.Mesh(colGeo, mat);
    col.position.y = 0.52;
    col.castShadow = true;
    group.add(col);

    // Turret Crenellations
    const turretGeo = new THREE.CylinderGeometry(0.36, 0.28, 0.3, 8);
    const turret = new THREE.Mesh(turretGeo, mat);
    turret.position.y = 0.95;
    turret.castShadow = true;
    group.add(turret);

    // Inner Arcane Brazier
    const crystalGeo = new THREE.OctahedronGeometry(0.12);
    const crystal = new THREE.Mesh(crystalGeo, runeMat);
    crystal.position.y = 1.12;
    group.add(crystal);

    return group;
  }

  createKnight(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // War Steed Torso
    const torsoGeo = new THREE.CylinderGeometry(0.18, 0.3, 0.55, 8);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.set(0, 0.42, -0.05);
    torso.rotation.x = Math.PI / 10;
    torso.castShadow = true;
    group.add(torso);

    // Arching Pegasus/Horse Neck & Head
    const headGeo = new THREE.BoxGeometry(0.2, 0.35, 0.4);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, 0.75, 0.1);
    head.rotation.x = -Math.PI / 5;
    head.castShadow = true;
    group.add(head);

    // Horn / Spiked Mane
    const hornGeo = new THREE.ConeGeometry(0.06, 0.3, 6);
    const horn = new THREE.Mesh(hornGeo, this.goldTrimMat);
    horn.position.set(0, 0.95, 0.2);
    horn.rotation.x = Math.PI / 4;
    group.add(horn);

    return group;
  }

  createBishop(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Cloaked Sorcerer Body
    const robeGeo = new THREE.CylinderGeometry(0.15, 0.32, 0.85, 10);
    const robe = new THREE.Mesh(robeGeo, mat);
    robe.position.y = 0.55;
    robe.castShadow = true;
    group.add(robe);

    // Pointed Sorcerer Mitre / Hood
    const hoodGeo = new THREE.ConeGeometry(0.22, 0.45, 10);
    const hood = new THREE.Mesh(hoodGeo, mat);
    hood.position.y = 1.05;
    hood.castShadow = true;
    group.add(hood);

    // Sorcerer's Wand
    const wandGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.6, 6);
    const wand = new THREE.Mesh(wandGeo, this.goldTrimMat);
    wand.position.set(0.22, 0.65, 0.12);
    wand.rotation.z = -Math.PI / 8;
    group.add(wand);

    // Wand Tip Arcane Sphere
    const tipGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const tip = new THREE.Mesh(tipGeo, runeMat);
    tip.position.set(0.33, 0.9, 0.12);
    group.add(tip);

    return group;
  }

  createQueen(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Royal Gown
    const gownGeo = new THREE.CylinderGeometry(0.16, 0.35, 1.0, 14);
    const gown = new THREE.Mesh(gownGeo, mat);
    gown.position.y = 0.65;
    gown.castShadow = true;
    group.add(gown);

    // Gilded Collar
    const collarGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 16);
    const collar = new THREE.Mesh(collarGeo, this.goldTrimMat);
    collar.position.y = 1.15;
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

    // Crown of Radiance
    const crownGeo = new THREE.CylinderGeometry(0.25, 0.14, 0.22, 8);
    const crown = new THREE.Mesh(crownGeo, this.goldTrimMat);
    crown.position.y = 1.28;
    group.add(crown);

    // Floating Arcane Core
    const coreGeo = new THREE.OctahedronGeometry(0.08);
    const core = new THREE.Mesh(coreGeo, runeMat);
    core.position.y = 1.45;
    core.name = "floatingCore";
    group.add(core);

    return group;
  }

  createKing(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Heavy Royal Armor
    const armorGeo = new THREE.CylinderGeometry(0.22, 0.36, 1.1, 12);
    const armor = new THREE.Mesh(armorGeo, mat);
    armor.position.y = 0.7;
    armor.castShadow = true;
    group.add(armor);

    // High Arch Cross Crown
    const crownGeo = new THREE.CylinderGeometry(0.26, 0.2, 0.3, 6);
    const crown = new THREE.Mesh(crownGeo, this.goldTrimMat);
    crown.position.y = 1.35;
    group.add(crown);

    // Royal Greatsword
    const swordBladeGeo = new THREE.BoxGeometry(0.06, 0.75, 0.02);
    const blade = new THREE.Mesh(swordBladeGeo, this.goldTrimMat);
    blade.position.set(0.24, 0.45, 0.18);
    blade.rotation.x = Math.PI / 18;
    group.add(blade);

    // King's Crest Ruby/Sapphire
    const crestGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const crest = new THREE.Mesh(crestGeo, runeMat);
    crest.position.y = 1.55;
    group.add(crest);

    return group;
  }

  buildPiece(type, color) {
    let pieceGroup;
    switch (type.toLowerCase()) {
      case 'p': pieceGroup = this.createPawn(color); break;
      case 'r': pieceGroup = this.createRook(color); break;
      case 'n': pieceGroup = this.createKnight(color); break;
      case 'b': pieceGroup = this.createBishop(color); break;
      case 'q': pieceGroup = this.createQueen(color); break;
      case 'k': pieceGroup = this.createKing(color); break;
      default: pieceGroup = this.createPawn(color);
    }
    pieceGroup.userData = { type: type.toLowerCase(), color: color };
    return pieceGroup;
  }
}

// ==========================================
// 3. COMPLETE CHESS LOGIC ENGINE
// ==========================================
class ChessEngine {
  constructor() {
    this.reset();
  }

  reset() {
    // 8x8 matrix representation: lowercase = black, uppercase = white
    this.board = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    this.turn = 'w'; // 'w' or 'b'
    this.history = [];
  }

  cloneBoard(board) {
    return board.map(row => [...row]);
  }

  isPieceWhite(piece) {
    if (!piece) return false;
    return piece === piece.toUpperCase();
  }

  getPieceColor(piece) {
    if (!piece) return null;
    return this.isPieceWhite(piece) ? 'w' : 'b';
  }

  isValidPos(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  getRawMoves(r, c, board = this.board) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = this.getPieceColor(piece);
    const type = piece.toLowerCase();
    const moves = [];

    const addMove = (tr, tc) => {
      if (!this.isValidPos(tr, tc)) return false;
      const target = board[tr][tc];
      if (!target) {
        moves.push({ from: { r, c }, to: { r: tr, c: tc } });
        return true; // continue ray
      }
      if (this.getPieceColor(target) !== color) {
        moves.push({ from: { r, c }, to: { r: tr, c: tc }, capture: target });
      }
      return false; // blocked
    };

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // 1 step forward
      if (this.isValidPos(r + dir, c) && !board[r + dir][c]) {
        moves.push({ from: { r, c }, to: { r: r + dir, c } });
        // 2 steps forward
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push({ from: { r, c }, to: { r: r + 2 * dir, c } });
        }
      }
      // Diagonal captures
      [-1, 1].forEach(dc => {
        const tr = r + dir;
        const tc = c + dc;
        if (this.isValidPos(tr, tc) && board[tr][tc] && this.getPieceColor(board[tr][tc]) !== color) {
          moves.push({ from: { r, c }, to: { r: tr, c: tc }, capture: board[tr][tc] });
        }
      });
    }

    if (type === 'r' || type === 'q') {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addMove(r + dr * step, c + dc * step)) step++;
      });
    }

    if (type === 'b' || type === 'q') {
      const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addMove(r + dr * step, c + dc * step)) step++;
      });
    }

    if (type === 'n') {
      const jumps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      jumps.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    if (type === 'k') {
      const steps = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      steps.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    return moves;
  }

  findKing(color, board = this.board) {
    const targetKing = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === targetKing) return { r, c };
      }
    }
    return null;
  }

  isCheck(color, board = this.board) {
    const kingPos = this.findKing(color, board);
    if (!kingPos) return false;
    const opponent = color === 'w' ? 'b' : 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.getPieceColor(board[r][c]) === opponent) {
          const raw = this.getRawMoves(r, c, board);
          if (raw.some(m => m.to.r === kingPos.r && m.to.c === kingPos.c)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getLegalMoves(r, c) {
    const piece = this.board[r][c];
    if (!piece || this.getPieceColor(piece) !== this.turn) return [];

    const rawMoves = this.getRawMoves(r, c, this.board);
    const legalMoves = [];

    rawMoves.forEach(move => {
      // Simulate move
      const nextBoard = this.cloneBoard(this.board);
      nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
      nextBoard[move.from.r][move.from.c] = null;

      // Handle pawn promotion simply to Queen
      if (piece.toLowerCase() === 'p' && (move.to.r === 0 || move.to.r === 7)) {
        nextBoard[move.to.r][move.to.c] = this.isPieceWhite(piece) ? 'Q' : 'q';
      }

      if (!this.isCheck(this.turn, nextBoard)) {
        legalMoves.push(move);
      }
    });

    return legalMoves;
  }

  getAllLegalMoves(color = this.turn) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.getPieceColor(this.board[r][c]) === color) {
          // Temporarily set turn to test legal moves
          const prevTurn = this.turn;
          this.turn = color;
          const pieceMoves = this.getLegalMoves(r, c);
          this.turn = prevTurn;
          moves.push(...pieceMoves);
        }
      }
    }
    return moves;
  }

  makeMove(move) {
    const piece = this.board[move.from.r][move.from.c];
    const captured = this.board[move.to.r][move.to.c];

    this.history.push({
      board: this.cloneBoard(this.board),
      move,
      turn: this.turn
    });

    this.board[move.to.r][move.to.c] = piece;
    this.board[move.from.r][move.from.c] = null;

    // Pawn Promotion
    let promoted = false;
    if (piece.toLowerCase() === 'p' && (move.to.r === 0 || move.to.r === 7)) {
      this.board[move.to.r][move.to.c] = this.isPieceWhite(piece) ? 'Q' : 'q';
      promoted = true;
    }

    this.turn = this.turn === 'w' ? 'b' : 'w';

    const inCheck = this.isCheck(this.turn);
    const hasMoves = this.getAllLegalMoves(this.turn).length > 0;
    const isCheckmate = inCheck && !hasMoves;
    const isStalemate = !inCheck && !hasMoves;

    return {
      captured,
      promoted,
      inCheck,
      isCheckmate,
      isStalemate
    };
  }

  undo() {
    if (this.history.length === 0) return null;
    const last = this.history.pop();
    this.board = last.board;
    this.turn = last.turn;
    return last;
  }
}

// ==========================================
// 4. CHESS AI: THE SPECTRAL ARCHMAGE
// ==========================================
class WizardAI {
  constructor(engine) {
    this.engine = engine;
    this.pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  }

  evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const val = this.pieceValues[piece.toLowerCase()] || 0;
        // Positional bonus: encourage center control
        const centerBonus = (3.5 - Math.abs(3.5 - r)) + (3.5 - Math.abs(3.5 - c));
        const total = val + centerBonus * 4;
        score += piece === piece.toUpperCase() ? -total : total; // Black maximizes score
      }
    }
    return score;
  }

  minimax(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return { score: this.evaluateBoard(board) };
    }

    const currentTurn = isMaximizing ? 'b' : 'w';
    this.engine.turn = currentTurn;
    const legalMoves = this.engine.getAllLegalMoves(currentTurn);

    if (legalMoves.length === 0) {
      if (this.engine.isCheck(currentTurn, board)) {
        return { score: isMaximizing ? -99999 + (3 - depth) : 99999 - (3 - depth) };
      }
      return { score: 0 }; // Stalemate
    }

    let bestMove = legalMoves[0];

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        const nextBoard = this.engine.cloneBoard(board);
        nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
        nextBoard[move.from.r][move.from.c] = null;

        const evalResult = this.minimax(nextBoard, depth - 1, alpha, beta, false);
        if (evalResult.score > maxEval) {
          maxEval = evalResult.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evalResult.score);
        if (beta <= alpha) break;
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        const nextBoard = this.engine.cloneBoard(board);
        nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
        nextBoard[move.from.r][move.from.c] = null;

        const evalResult = this.minimax(nextBoard, depth - 1, alpha, beta, true);
        if (evalResult.score < minEval) {
          minEval = evalResult.score;
          bestMove = move;
        }
        beta = Math.min(beta, evalResult.score);
        if (beta <= alpha) break;
      }
      return { score: minEval, move: bestMove };
    }
  }

  getBestMove(depth = 2) {
    const origTurn = this.engine.turn;
    const result = this.minimax(this.engine.board, depth, -Infinity, Infinity, true);
    this.engine.turn = origTurn;
    return result.move;
  }
}

// ==========================================
// 5. MASTER 3D SCENE & INTERACTION CONTROLLER
// ==========================================
class WizardChessApp {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.engine = new ChessEngine();
    this.ai = new WizardAI(this.engine);
    this.builder = new PieceMeshBuilder();

    this.pieceMeshes = {}; // keyed by "r,c"
    this.squareHighlights = [];
    this.floatingCandles = [];
    this.dustParticles = null;
    this.debrisParticles = [];

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.isAnimatingCombat = false;

    this.initThree();
    this.buildAtmosphere();
    this.buildChessboard();
    this.syncBoardToMeshes();
    this.bindEvents();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0710, 0.045);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8.5, 9.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below floor
    this.controls.minDistance = 4;
    this.controls.maxDistance = 22;
    this.controls.target.set(0, 0.3, 0);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  buildAtmosphere() {
    // Ambient room illumination
    const ambientLight = new THREE.AmbientLight(0x2d1f3d, 1.2);
    this.scene.add(ambientLight);

    // Moonlight shaft through vaulted gothic windows
    const moonDirLight = new THREE.DirectionalLight(0xa6c8ff, 1.5);
    moonDirLight.position.set(-6, 14, 8);
    moonDirLight.castShadow = true;
    moonDirLight.shadow.mapSize.width = 2048;
    moonDirLight.shadow.mapSize.height = 2048;
    moonDirLight.shadow.camera.near = 0.5;
    moonDirLight.shadow.camera.far = 30;
    moonDirLight.shadow.camera.left = -6;
    moonDirLight.shadow.camera.right = 6;
    moonDirLight.shadow.camera.top = 6;
    moonDirLight.shadow.camera.bottom = -6;
    moonDirLight.shadow.bias = -0.0005;
    this.scene.add(moonDirLight);

    // Warm board center glow
    const centerBrazier = new THREE.PointLight(0xffa834, 1.2, 12, 1.8);
    centerBrazier.position.set(0, 3.5, 0);
    this.scene.add(centerBrazier);

    // Suspended Floating Candles with flickering point lights
    const candleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfff6d6, roughness: 0.3 });
    const flameGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });

    for (let i = 0; i < 36; i++) {
      const candleGroup = new THREE.Group();
      const candleMesh = new THREE.Mesh(candleGeo, candleMat);
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.25;
      candleGroup.add(candleMesh);
      candleGroup.add(flameMesh);

      // Distribute in a ring-vault pattern
      const angle = (i / 36) * Math.PI * 2;
      const radius = 4.2 + (i % 3) * 1.5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.8;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.8;
      const y = 3.2 + Math.sin(i) * 1.5;

      candleGroup.position.set(x, y, z);

      if (i % 6 === 0) {
        const candleLight = new THREE.PointLight(0xff9922, 0.6, 5);
        candleLight.position.y = 0.3;
        candleGroup.add(candleLight);
      }

      this.scene.add(candleGroup);
      this.floatingCandles.push({
        group: candleGroup,
        baseY: y,
        speed: 1.0 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Drifting magical dust motes
    const dustCount = 220;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = Math.random() * 8 + 0.2;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xeedfb8,
      size: 0.055,
      transparent: true,
      opacity: 0.6
    });
    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  buildChessboard() {
    const boardGroup = new THREE.Group();

    // Checkered Board Base
    const squareSize = 1.0;
    this.boardSquareMeshes = [];

    const lightSquareMat = new THREE.MeshStandardMaterial({
      color: 0xd9ceb2,
      roughness: 0.3,
      metalness: 0.1
    });

    const darkSquareMat = new THREE.MeshStandardMaterial({
      color: 0x1f192b,
      roughness: 0.4,
      metalness: 0.2
    });

    const squareGeo = new THREE.BoxGeometry(squareSize, 0.3, squareSize);

    for (let r = 0; r < 8; r++) {
      this.boardSquareMeshes[r] = [];
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        const mat = isDark ? darkSquareMat : lightSquareMat;
        const tile = new THREE.Mesh(squareGeo, mat);
        // Center the 8x8 grid around (0, 0, 0)
        const x = (c - 3.5) * squareSize;
        const z = (r - 3.5) * squareSize;
        tile.position.set(x, 0.15, z);
        tile.receiveShadow = true;
        tile.userData = { r, c };
        boardGroup.add(tile);
        this.boardSquareMeshes[r][c] = tile;
      }
    }

    // Carved Stone Outer Frame with Gilded Filigree
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f0b17,
      roughness: 0.5,
      metalness: 0.3
    });
    const outerFrameGeo = new THREE.BoxGeometry(9.2, 0.26, 9.2);
    const outerFrame = new THREE.Mesh(outerFrameGeo, frameMat);
    outerFrame.position.y = 0.1;
    outerFrame.receiveShadow = true;
    boardGroup.add(outerFrame);

    // Glowing Leyline Perimeter
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x99782d,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2
    });
    const rimGeo = new THREE.BoxGeometry(8.25, 0.32, 8.25);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.12;
    boardGroup.add(rimMesh);

    this.scene.add(boardGroup);
  }

  // Convert row, col to Three.js world space coordinates
  gridToWorld(r, c) {
    return new THREE.Vector3((c - 3.5) * 1.0, 0.3, (r - 3.5) * 1.0);
  }

  syncBoardToMeshes() {
    // Clear existing piece meshes
    Object.values(this.pieceMeshes).forEach(mesh => this.scene.remove(mesh));
    this.pieceMeshes = {};

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.engine.board[r][c];
        if (piece) {
          const color = this.engine.isPieceWhite(piece) ? 'w' : 'b';
          const mesh = this.builder.buildPiece(piece, color);
          const worldPos = this.gridToWorld(r, c);
          mesh.position.copy(worldPos);

          // Face the opponent
          if (color === 'w') {
            mesh.rotation.y = 0;
          } else {
            mesh.rotation.y = Math.PI;
          }

          mesh.userData.grid = { r, c };
          this.scene.add(mesh);
          this.pieceMeshes[`${r},${c}`] = mesh;
        }
      }
    }
  }

  // Visual Rune Rings for Move Targets
  showLegalMoveHighlights(moves) {
    this.clearHighlights();
    const ringGeo = new THREE.RingGeometry(0.18, 0.38, 20);
    ringGeo.rotateX(-Math.PI / 2);

    moves.forEach(m => {
      const isCapture = !!this.engine.board[m.to.r][m.to.c];
      const mat = new THREE.MeshBasicMaterial({
        color: isCapture ? 0xff3366 : 0x4fc3f7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const highlightMesh = new THREE.Mesh(ringGeo, mat);
      const pos = this.gridToWorld(m.to.r, m.to.c);
      highlightMesh.position.set(pos.x, 0.315, pos.z);
      this.scene.add(highlightMesh);
      this.squareHighlights.push(highlightMesh);

      // GSAP Pulsing Ring
      gsap.to(highlightMesh.scale, {
        x: 1.15,
        z: 1.15,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });
  }

  clearHighlights() {
    this.squareHighlights.forEach(h => this.scene.remove(h));
    this.squareHighlights = [];
  }

  // ==========================================
  // 6. KINETIC COMBAT ANIMATION & SHATTER VFX
  // ==========================================
  triggerShatterExplosion(position, color) {
    soundEngine.playShatterExplosion();

    // Camera shake effect
    const origCamPos = this.camera.position.clone();
    gsap.to(this.camera.position, {
      x: origCamPos.x + (Math.random() - 0.5) * 0.4,
      y: origCamPos.y + (Math.random() - 0.5) * 0.4,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        this.camera.position.copy(origCamPos);
      }
    });

    // Flash screen effect
    const flashEl = document.getElementById('flash-overlay');
    flashEl.style.opacity = '0.5';
    gsap.to(flashEl, { opacity: 0, duration: 0.35 });

    // Spawn physics-simulated debris stone fragments
    const fragMat = color === 'w' ? this.builder.whiteMaterial : this.builder.blackMaterial;
    const shardCount = 20;

    for (let i = 0; i < shardCount; i++) {
      const geo = new THREE.DodecahedronGeometry(0.06 + Math.random() * 0.08);
      const shard = new THREE.Mesh(geo, fragMat);
      shard.position.copy(position);
      shard.position.y += 0.2;
      this.scene.add(shard);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 3.5,
        Math.random() * 4.0 + 1.5,
        (Math.random() - 0.5) * 3.5
      );

      this.debrisParticles.push({
        mesh: shard,
        velocity,
        gravity: -9.8,
        life: 1.2
      });
    }
  }

  executeMoveWithAnimation(move, onComplete) {
    this.isAnimatingCombat = true;
    const attackerMesh = this.pieceMeshes[`${move.from.r},${move.from.c}`];
    const defenderMesh = this.pieceMeshes[`${move.to.r},${move.to.c}`];
    const targetPos = this.gridToWorld(move.to.r, move.to.c);

    // Look at target
    attackerMesh.lookAt(targetPos.x, attackerMesh.position.y, targetPos.z);

    const isCombat = !!defenderMesh;

    if (isCombat) {
      // Dynamic Duel Combat Choreography
      soundEngine.playSpellCast();
      this.logChronicle(
        `${attackerMesh.userData.color === 'w' ? 'Lumos' : 'Nox'} ${attackerMesh.userData.type.toUpperCase()} casts Stupefy on ${defenderMesh.userData.type.toUpperCase()}!`,
        'spell-cast'
      );

      const timeline = gsap.timeline();

      // 1. Attacker windup / hover
      timeline.to(attackerMesh.position, {
        y: 0.9,
        duration: 0.3,
        ease: "power2.out"
      });

      // 2. Spell projectile energy beam
      timeline.add(() => {
        const spellBolt = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 8),
          new THREE.MeshBasicMaterial({ color: attackerMesh.userData.color === 'w' ? 0x80d8ff : 0xff1744 })
        );
        spellBolt.position.copy(attackerMesh.position);
        this.scene.add(spellBolt);

        gsap.to(spellBolt.position, {
          x: targetPos.x,
          y: targetPos.y + 0.5,
          z: targetPos.z,
          duration: 0.22,
          ease: "power1.in",
          onComplete: () => {
            this.scene.remove(spellBolt);
            // Shatter defender
            this.triggerShatterExplosion(targetPos, defenderMesh.userData.color);
            this.scene.remove(defenderMesh);
          }
        });
      });

      // 3. Attacker strides to claim square
      timeline.to(attackerMesh.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.5,
        delay: 0.25,
        ease: "power3.inOut",
        onComplete: () => {
          this.finalizeMoveState(move, onComplete);
        }
      });
    } else {
      // Standard Slide Movement
      soundEngine.playStoneMove();
      gsap.to(attackerMesh.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          this.finalizeMoveState(move, onComplete);
        }
      });
    }
  }

  finalizeMoveState(move, onComplete) {
    const result = this.engine.makeMove(move);

    // Update meshes lookup table
    const movingPiece = this.pieceMeshes[`${move.from.r},${move.from.c}`];
    delete this.pieceMeshes[`${move.from.r},${move.from.c}`];
    this.pieceMeshes[`${move.to.r},${move.to.c}`] = movingPiece;
    movingPiece.userData.grid = { r: move.to.r, c: move.to.c };

    // Handle Captured piece display
    if (result.captured) {
      this.addGravePiece(result.captured);
      this.logChronicle(
        `Piece shattered into dust! The square is claimed.`,
        'spell-shatter'
      );
    }

    // Pawn Promotion replacement
    if (result.promoted) {
      this.scene.remove(movingPiece);
      const color = movingPiece.userData.color;
      const queenMesh = this.builder.buildPiece('q', color);
      queenMesh.position.copy(this.gridToWorld(move.to.r, move.to.c));
      queenMesh.userData.grid = { r: move.to.r, c: move.to.c };
      this.scene.add(queenMesh);
      this.pieceMeshes[`${move.to.r},${move.to.c}`] = queenMesh;
      this.logChronicle(`Pawn ascended through ancient transfiguration into a Queen!`, 'system-message');
    }

    this.updateTurnUI();

    if (result.isCheckmate) {
      soundEngine.playVictoryChime();
      const winner = this.engine.turn === 'w' ? 'Nox Legion' : 'Lumos Order';
      this.showGameOverModal(`CHECKMATE!`, `${winner} reigns victorious in the Grand Duel.`);
    } else if (result.inCheck) {
      this.logChronicle(`The King is under siege! CHECK!`, 'spell-shatter');
    }

    this.isAnimatingCombat = false;
    if (onComplete) onComplete();
  }

  // ==========================================
  // 7. INPUT & TURN INTERACTION
  // ==========================================
  bindEvents() {
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));

    // UI Buttons
    document.getElementById('btn-undo').addEventListener('click', () => this.handleUndo());
    document.getElementById('btn-restart').addEventListener('click', () => this.handleReset());
    document.getElementById('modal-btn-restart').addEventListener('click', () => {
      document.getElementById('game-modal').classList.add('modal-hidden');
      this.handleReset();
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      soundEngine.muted = !soundEngine.muted;
      soundBtn.textContent = soundEngine.muted ? 'Sound: OFF' : 'Sound: ON';
      if (!soundEngine.muted) soundEngine.playSelect();
    });

    // Camera presets
    document.getElementById('btn-cam-reset').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 0, y: 8.5, z: 9.5, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0.3, 0);
    });

    document.getElementById('btn-cam-tactical').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 0, y: 12.5, z: 0.1, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0, 0);
    });

    document.getElementById('btn-cam-duel').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 3.5, y: 3.2, z: 5.5, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0.5, 0);
    });
  }

  onPointerDown(e) {
    if (this.isAnimatingCombat) return;

    soundEngine.ensureContext();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length === 0) return;

    // Find clicked chess piece or board square
    let hitPiece = null;
    let hitSquare = null;

    for (let hit of intersects) {
      let curr = hit.object;
      while (curr && curr !== this.scene) {
        if (curr.userData && curr.userData.grid) {
          hitPiece = curr;
          break;
        }
        if (curr.userData && curr.userData.r !== undefined) {
          hitSquare = curr.userData;
          break;
        }
        curr = curr.parent;
      }
      if (hitPiece || hitSquare) break;
    }

    const clickedRow = hitPiece ? hitPiece.userData.grid.r : (hitSquare ? hitSquare.r : null);
    const clickedCol = hitPiece ? hitPiece.userData.grid.c : (hitSquare ? hitSquare.c : null);

    if (clickedRow === null || clickedCol === null) {
      this.deselect();
      return;
    }

    // If already selected, check if clicked position is a legal move
    if (this.selectedSquare) {
      const matchMove = this.legalMovesForSelected.find(
        m => m.to.r === clickedRow && m.to.c === clickedCol
      );

      if (matchMove) {
        this.clearHighlights();
        this.deselect();
        this.executeMoveWithAnimation(matchMove, () => {
          this.checkAIMove();
        });
        return;
      }
    }

    // Otherwise, select piece if it matches current turn
    const targetPieceCode = this.engine.board[clickedRow][clickedCol];
    if (targetPieceCode && this.engine.getPieceColor(targetPieceCode) === this.engine.turn) {
      this.selectedSquare = { r: clickedRow, c: clickedCol };
      soundEngine.playSelect();
      this.legalMovesForSelected = this.engine.getLegalMoves(clickedRow, clickedCol);
      this.showLegalMoveHighlights(this.legalMovesForSelected);
    } else {
      this.deselect();
    }
  }

  deselect() {
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.clearHighlights();
  }

  checkAIMove() {
    const diff = document.getElementById('ai-difficulty').value;
    if (diff === 'pvp') return; // Local 2 Player
    if (this.engine.turn !== 'b') return;

    const depth = parseInt(diff, 10) || 2;

    this.logChronicle("The Archmage weaves a counter-curse...", "system-message");

    setTimeout(() => {
      const aiMove = this.ai.getBestMove(depth);
      if (aiMove) {
        this.executeMoveWithAnimation(aiMove, () => {
          // Player's turn again
        });
      }
    }, 450);
  }

  handleUndo() {
    if (this.isAnimatingCombat) return;
    const undone = this.engine.undo();
    if (undone) {
      // If vs AI, undo twice so it is player's turn
      const diff = document.getElementById('ai-difficulty').value;
      if (diff !== 'pvp' && this.engine.turn === 'b') {
        this.engine.undo();
      }
      this.syncBoardToMeshes();
      this.updateTurnUI();
      this.logChronicle("Time turns back! The incantation is undone.", "system-message");
    }
  }

  handleReset() {
    if (this.isAnimatingCombat) return;
    this.engine.reset();
    this.syncBoardToMeshes();
    this.clearHighlights();
    this.selectedSquare = null;
    document.getElementById('white-graveyard').innerHTML = '';
    document.getElementById('black-graveyard').innerHTML = '';
    document.getElementById('duel-log').innerHTML = '<div class="log-entry system-message">The duel begins anew. Cast your move.</div>';
    this.updateTurnUI();
  }

  // ==========================================
  // 8. HUD & UI MANAGEMENT
  // ==========================================
  updateTurnUI() {
    const turnText = document.getElementById('turn-text');
    const turnGem = document.getElementById('turn-gem');
    if (this.engine.turn === 'w') {
      turnText.textContent = "LUMOS ORDER’S MOVE";
      turnGem.style.background = "var(--lumos-blue)";
      turnGem.style.boxShadow = "0 0 10px var(--lumos-blue)";
    } else {
      turnText.textContent = "NOX LEGION’S MOVE";
      turnGem.style.background = "var(--nox-crimson)";
      turnGem.style.boxShadow = "0 0 10px var(--nox-crimson)";
    }
  }

  addGravePiece(piece) {
    const isWhite = piece === piece.toUpperCase();
    const container = document.getElementById(isWhite ? 'white-graveyard' : 'black-graveyard');
    const slot = document.createElement('div');
    slot.className = 'grave-piece';

    // Unicode Chess Glyphs
    const symbols = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
    };
    slot.textContent = symbols[piece.toLowerCase()] || '♟';
    container.appendChild(slot);
  }

  logChronicle(msg, type = 'system-message') {
    const feed = document.getElementById('duel-log');
    const item = document.createElement('div');
    item.className = `log-entry ${type}`;
    item.textContent = msg;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
  }

  showGameOverModal(title, desc) {
    const modal = document.getElementById('game-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    modal.classList.remove('modal-hidden');
  }

  // ==========================================
  // 9. ANIMATION LOOP & PHYSICS UPDATE
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = 0.016; // Approx 60fps delta
    const time = performance.now() * 0.001;

    // 1. Update OrbitControls
    this.controls.update();

    // 2. Animate Floating Candles
    for (let c of this.floatingCandles) {
      c.group.position.y = c.baseY + Math.sin(time * c.speed + c.phase) * 0.15;
    }

    // 3. Animate Mystical Dust motes
    if (this.dustParticles) {
      const positions = this.dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 0.25;
        if (positions[i] > 8.0) positions[i] = 0.2; // Loop back
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Update Physics Debris Stone Fragments
    for (let i = this.debrisParticles.length - 1; i >= 0; i--) {
      const p = this.debrisParticles[i];
      p.life -= delta;
      p.velocity.y += p.gravity * delta;
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.mesh.rotation.x += 0.1;
      p.mesh.rotation.y += 0.12;

      // Floor collision
      if (p.mesh.position.y < 0.15) {
        p.mesh.position.y = 0.15;
        p.velocity.y *= -0.4;
        p.velocity.x *= 0.7;
        p.velocity.z *= 0.7;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.debrisParticles.splice(i, 1);
      }
    }

    // 5. Idle breathing animation for Queen's floating core
    for (let key in this.pieceMeshes) {
      const core = this.pieceMeshes[key].getObjectByName("floatingCore");
      if (core) {
        core.rotation.y += 0.02;
        core.position.y = 1.45 + Math.sin(time * 3) * 0.05;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize on window load
window.addEventListener('DOMContentLoaded', () => {
  new WizardChessApp();
});