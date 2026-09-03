/**
 * WIZARD'S CHESS: THE GRAND DUEL (ADVANCED EDITION)
 * 
 * Featuring:
 * 1. Complete Chess Engine (Castling, En Passant, Promotion Modal, SAN Notation, PST Evaluation)
 * 2. Optimized Alpha-Beta Search AI with MVV-LVA Move Ordering
 * 3. Procedural Lathe-Sculpted Staunton Piece Meshes & Dynamic Gothic Sanctuary Dais
 * 4. Procedural Canvas Textures (Veined Alabaster, Obsidian, Gold Inlaid Borders)
 * 5. Kinetic Combat Choreography (Arcing Knight jumps, Solar Bishop rays, Ward Dome Shatter)
 * 6. Synthesized Procedural Web Audio Suite (Cathedral drone, distinct spell acoustics, glass fracture)
 */

// ==========================================
// 1. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================
class MagicSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.initContext();
  }

  initContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.ctx) {
      this.ctx = new AudioContextClass();
    }
  }

  ensureContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ambientOsc && !this.muted) {
      this.startAmbientDrone();
    }
  }

  startAmbientDrone() {
    if (!this.ctx || this.ambientOsc || this.muted) return;
    try {
      this.ambientOsc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 fifth

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.ambientOsc.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
      osc2.start();
    } catch (e) {
      console.warn("Audio autoplay prevented.");
    }
  }

  playSelect() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playStoneSlide() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playPieceSpell(type) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    switch (type.toLowerCase()) {
      case 'n': // Knight kinetic leap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.3);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        break;
      case 'b': // Bishop solar laser
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.28);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        break;
      case 'r': // Rook battering charge
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.linearRampToValueAtTime(40, t + 0.4);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        break;
      case 'q': // Queen lightning surge
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(1760, t + 0.35);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        break;
      default: // Pawn or King strike
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(650, t + 0.2);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        break;
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + 0.45);
  }

  playWardShatter() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub-bass detonation thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.5);
    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start();
    subOsc.stop(t + 0.6);

    // Crystalline shatter burst
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(2.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();
  }

  playCheckWarning() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [130.81, 155.56, 196.00].forEach((freq, idx) => { // C Minor triad
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      gain.gain.setValueAtTime(0.18, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.65);
    });
  }

  playVictoryChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.09 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 1.3);
    });
  }
}

const soundEngine = new MagicSoundEngine();

// ==========================================
// 2. PROCEDURAL TEXTURE GENERATOR
// ==========================================
class ProceduralTextureFactory {
  static createMarbleCanvas(baseColor, veinColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Fractal Veining
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = veinColor;
    for (let v = 0; v < 14; v++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let i = 0; i < 40; i++) {
        x += (Math.random() - 0.48) * 45;
        y += (Math.random() - 0.48) * 45;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  static createRunicBorderCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#0c0814";
    ctx.fillRect(0, 0, 1024, 1024);

    // Inner gold filigree border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 964, 964);
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 934, 934);

    // Elder arcane runes along the rim
    ctx.fillStyle = "#e0c068";
    ctx.font = "24px 'Cinzel Decorative', serif";
    ctx.textAlign = "center";
    const runes = ["᚛", "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ", "᚜"];
    
    for (let i = 0; i < 32; i++) {
      const char = runes[i % runes.length];
      const step = (i / 32) * 920 + 50;
      ctx.fillText(char, step, 38);
      ctx.fillText(char, step, 995);
      ctx.fillText(char, 38, step);
      ctx.fillText(char, 995, step);
    }

    return new THREE.CanvasTexture(canvas);
  }
}

// ==========================================
// 3. LATHE-SCULPTED STAUNTON PIECE BUILDER
// ==========================================
class PieceMeshBuilder {
  constructor() {
    const lightMarbleTex = ProceduralTextureFactory.createMarbleCanvas("#f4efe6", "rgba(180, 170, 155, 0.4)");
    const darkObsidianTex = ProceduralTextureFactory.createMarbleCanvas("#16121f", "rgba(120, 95, 160, 0.35)");

    this.whiteMaterial = new THREE.MeshStandardMaterial({
      map: lightMarbleTex,
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.12
    });

    this.blackMaterial = new THREE.MeshStandardMaterial({
      map: darkObsidianTex,
      color: 0xdddddd,
      roughness: 0.35,
      metalness: 0.45
    });

    this.whiteRuneMat = new THREE.MeshStandardMaterial({
      color: 0x81d4fa,
      emissive: 0x29b6f6,
      emissiveIntensity: 0.85,
      roughness: 0.1
    });

    this.blackRuneMat = new THREE.MeshStandardMaterial({
      color: 0xff4081,
      emissive: 0xf50057,
      emissiveIntensity: 0.85,
      roughness: 0.1
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe6b800,
      metalness: 0.85,
      roughness: 0.25
    });
  }

  createPedestal(material, runeMat) {
    const group = new THREE.Group();
    // Stepped Circular Plinth
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.14, 24);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.07;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Inset Rune Ring
    const ringGeo = new THREE.TorusGeometry(0.38, 0.018, 10, 32);
    const ring = new THREE.Mesh(ringGeo, runeMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.14;
    group.add(ring);

    return group;
  }

  createPawn(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Lathed Staunton Pawn Stem
    const points = [
      new THREE.Vector2(0.32, 0.14),
      new THREE.Vector2(0.24, 0.25),
      new THREE.Vector2(0.18, 0.45),
      new THREE.Vector2(0.14, 0.58),
      new THREE.Vector2(0.20, 0.62),
      new THREE.Vector2(0.14, 0.64),
      new THREE.Vector2(0.00, 0.65)
    ];
    const stemGeo = new THREE.LatheGeometry(points, 24);
    const stem = new THREE.Mesh(stemGeo, mat);
    stem.castShadow = true;
    group.add(stem);

    // Ball Finial Head
    const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 0.78;
    head.castShadow = true;
    group.add(head);

    return group;
  }

  createRook(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Lathed Column Bastion
    const points = [
      new THREE.Vector2(0.34, 0.14),
      new THREE.Vector2(0.28, 0.22),
      new THREE.Vector2(0.25, 0.65),
      new THREE.Vector2(0.32, 0.78),
      new THREE.Vector2(0.32, 0.95),
      new THREE.Vector2(0.20, 0.95),
      new THREE.Vector2(0.00, 0.95)
    ];
    const colGeo = new THREE.LatheGeometry(points, 24);
    const col = new THREE.Mesh(colGeo, mat);
    col.castShadow = true;
    group.add(col);

    // Crenellation Turret Teeth
    for (let i = 0; i < 4; i++) {
      const toothGeo = new THREE.BoxGeometry(0.12, 0.14, 0.1);
      const tooth = new THREE.Mesh(toothGeo, mat);
      const angle = (i / 4) * Math.PI * 2;
      tooth.position.set(Math.cos(angle) * 0.25, 1.02, Math.sin(angle) * 0.25);
      tooth.rotation.y = -angle;
      tooth.castShadow = true;
      group.add(tooth);
    }

    // Arcane Core Brazier
    const crystalGeo = new THREE.OctahedronGeometry(0.1);
    const crystal = new THREE.Mesh(crystalGeo, runeMat);
    crystal.position.y = 0.98;
    group.add(crystal);

    return group;
  }

  createKnight(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Pedestal Neck Base
    const basePts = [
      new THREE.Vector2(0.34, 0.14),
      new THREE.Vector2(0.28, 0.32),
      new THREE.Vector2(0.22, 0.42),
      new THREE.Vector2(0.00, 0.42)
    ];
    const neckBase = new THREE.Mesh(new THREE.LatheGeometry(basePts, 20), mat);
    neckBase.castShadow = true;
    group.add(neckBase);

    // Sculpted Equine Steed Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.14, 0.22, 0.5, 10);
    const neck = new THREE.Mesh(neckGeo, mat);
    neck.position.set(0, 0.62, -0.05);
    neck.rotation.x = Math.PI / 7;
    neck.castShadow = true;
    group.add(neck);

    const headGeo = new THREE.BoxGeometry(0.22, 0.28, 0.42);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, 0.85, 0.12);
    head.rotation.x = -Math.PI / 6;
    head.castShadow = true;
    group.add(head);

    // Equine Spiked Mane
    const maneGeo = new THREE.ConeGeometry(0.06, 0.3, 6);
    const mane = new THREE.Mesh(maneGeo, this.goldTrimMat);
    mane.position.set(0, 1.05, 0.22);
    mane.rotation.x = Math.PI / 4;
    group.add(mane);

    return group;
  }

  createBishop(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Fluted Robe Stem
    const points = [
      new THREE.Vector2(0.34, 0.14),
      new THREE.Vector2(0.26, 0.25),
      new THREE.Vector2(0.17, 0.55),
      new THREE.Vector2(0.22, 0.72),
      new THREE.Vector2(0.15, 0.76),
      new THREE.Vector2(0.00, 0.78)
    ];
    const stem = new THREE.Mesh(new THREE.LatheGeometry(points, 24), mat);
    stem.castShadow = true;
    group.add(stem);

    // Teardrop Sorcerer's Mitre
    const mitreGeo = new THREE.ConeGeometry(0.22, 0.45, 14);
    const mitre = new THREE.Mesh(mitreGeo, mat);
    mitre.position.y = 0.98;
    mitre.castShadow = true;
    group.add(mitre);

    // Gilded Finial Sphere
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), runeMat);
    orb.position.y = 1.24;
    group.add(orb);

    return group;
  }

  createQueen(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Royal Hourglass Gown
    const points = [
      new THREE.Vector2(0.36, 0.14),
      new THREE.Vector2(0.28, 0.35),
      new THREE.Vector2(0.18, 0.65),
      new THREE.Vector2(0.26, 1.05),
      new THREE.Vector2(0.20, 1.10),
      new THREE.Vector2(0.00, 1.12)
    ];
    const gown = new THREE.Mesh(new THREE.LatheGeometry(points, 24), mat);
    gown.castShadow = true;
    group.add(gown);

    // Flared Radial Coronet
    const coronetGeo = new THREE.CylinderGeometry(0.28, 0.18, 0.22, 12, 1, true);
    const coronet = new THREE.Mesh(coronetGeo, this.goldTrimMat);
    coronet.position.y = 1.22;
    group.add(coronet);

    // Floating Arcane Core
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), runeMat);
    core.position.y = 1.42;
    core.name = "floatingCore";
    group.add(core);

    return group;
  }

  createKing(color) {
    const mat = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const runeMat = color === 'w' ? this.whiteRuneMat : this.blackRuneMat;
    const group = this.createPedestal(mat, runeMat);

    // Heavy Stately Mantle
    const points = [
      new THREE.Vector2(0.38, 0.14),
      new THREE.Vector2(0.30, 0.38),
      new THREE.Vector2(0.22, 0.72),
      new THREE.Vector2(0.28, 1.15),
      new THREE.Vector2(0.22, 1.20),
      new THREE.Vector2(0.00, 1.22)
    ];
    const mantle = new THREE.Mesh(new THREE.LatheGeometry(points, 24), mat);
    mantle.castShadow = true;
    group.add(mantle);

    // Arched Imperial Crown
    const crownGeo = new THREE.CylinderGeometry(0.27, 0.22, 0.22, 8);
    const crown = new THREE.Mesh(crownGeo, this.goldTrimMat);
    crown.position.y = 1.32;
    group.add(crown);

    // Imperial Cross Finial
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.04), this.goldTrimMat);
    vBar.position.y = 1.54;
    group.add(vBar);

    const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), this.goldTrimMat);
    hBar.position.y = 1.58;
    group.add(hBar);

    // King's Crest Jewel
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), runeMat);
    jewel.position.y = 1.45;
    group.add(jewel);

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
// 4. COMPLETE CHESS ENGINE (SAN, CASTLING, EN PASSANT)
// ==========================================
class ChessEngine {
  constructor() {
    this.reset();
  }

  reset() {
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

    this.turn = 'w';
    this.history = [];
    this.enPassantSquare = null; // { r, c }

    // Castling rights
    this.castling = {
      w: { k: true, q: true },
      b: { k: true, q: true }
    };
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
        return true;
      }
      if (this.getPieceColor(target) !== color) {
        moves.push({ from: { r, c }, to: { r: tr, c: tc }, capture: target });
      }
      return false;
    };

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // 1 step forward
      if (this.isValidPos(r + dir, c) && !board[r + dir][c]) {
        moves.push({ from: { r, c }, to: { r: r + dir, c } });
        // 2 steps forward
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push({ from: { r, c }, to: { r: r + 2 * dir, c }, isDoublePawn: true });
        }
      }
      // Diagonal standard captures
      [-1, 1].forEach(dc => {
        const tr = r + dir;
        const tc = c + dc;
        if (this.isValidPos(tr, tc)) {
          if (board[tr][tc] && this.getPieceColor(board[tr][tc]) !== color) {
            moves.push({ from: { r, c }, to: { r: tr, c: tc }, capture: board[tr][tc] });
          } else if (this.enPassantSquare && this.enPassantSquare.r === tr && this.enPassantSquare.c === tc) {
            // En Passant
            moves.push({
              from: { r, c },
              to: { r: tr, c: tc },
              capture: color === 'w' ? 'p' : 'P',
              isEnPassant: true
            });
          }
        }
      });
    }

    if (type === 'r' || type === 'q') {
      [[1,0], [-1,0], [0,1], [0,-1]].forEach(([dr, dc]) => {
        let s = 1;
        while (addMove(r + dr * s, c + dc * s)) s++;
      });
    }

    if (type === 'b' || type === 'q') {
      [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
        let s = 1;
        while (addMove(r + dr * s, c + dc * s)) s++;
      });
    }

    if (type === 'n') {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
        addMove(r + dr, c + dc);
      });
    }

    if (type === 'k') {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
        addMove(r + dr, c + dc);
      });

      // Castling logic
      if (this.castling[color].k) {
        if (!board[r][c + 1] && !board[r][c + 2]) {
          moves.push({ from: { r, c }, to: { r, c: c + 2 }, isCastleKingside: true });
        }
      }
      if (this.castling[color].q) {
        if (!board[r][c - 1] && !board[r][c - 2] && !board[r][c - 3]) {
          moves.push({ from: { r, c }, to: { r, c: c - 2 }, isCastleQueenside: true });
        }
      }
    }

    return moves;
  }

  findKing(color, board = this.board) {
    const target = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === target) return { r, c };
      }
    }
    return null;
  }

  isSquareAttacked(r, c, byColor, board = this.board) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && this.getPieceColor(piece) === byColor) {
          const type = piece.toLowerCase();
          if (type === 'p') {
            const dir = byColor === 'w' ? -1 : 1;
            if (row + dir === r && (col - 1 === c || col + 1 === c)) return true;
          } else {
            const raw = this.getRawMoves(row, col, board);
            if (raw.some(m => m.to.r === r && m.to.c === c)) return true;
          }
        }
      }
    }
    return false;
  }

  isCheck(color, board = this.board) {
    const king = this.findKing(color, board);
    if (!king) return false;
    const opponent = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(king.r, king.c, opponent, board);
  }

  getLegalMoves(r, c) {
    const piece = this.board[r][c];
    if (!piece || this.getPieceColor(piece) !== this.turn) return [];

    const rawMoves = this.getRawMoves(r, c, this.board);
    const legalMoves = [];
    const color = this.turn;
    const opponent = color === 'w' ? 'b' : 'w';

    for (const move of rawMoves) {
      // Castling through check restriction
      if (move.isCastleKingside) {
        if (this.isCheck(color, this.board)) continue;
        if (this.isSquareAttacked(r, c + 1, opponent, this.board)) continue;
        if (this.isSquareAttacked(r, c + 2, opponent, this.board)) continue;
      }
      if (move.isCastleQueenside) {
        if (this.isCheck(color, this.board)) continue;
        if (this.isSquareAttacked(r, c - 1, opponent, this.board)) continue;
        if (this.isSquareAttacked(r, c - 2, opponent, this.board)) continue;
      }

      // Simulate move
      const nextBoard = this.cloneBoard(this.board);
      nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
      nextBoard[move.from.r][move.from.c] = null;

      if (move.isEnPassant) {
        const epRow = color === 'w' ? move.to.r + 1 : move.to.r - 1;
        nextBoard[epRow][move.to.c] = null;
      }

      if (!this.isCheck(color, nextBoard)) {
        legalMoves.push(move);
      }
    }

    return legalMoves;
  }

  getAllLegalMoves(color = this.turn) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.getPieceColor(this.board[r][c]) === color) {
          const prevTurn = this.turn;
          this.turn = color;
          moves.push(...this.getLegalMoves(r, c));
          this.turn = prevTurn;
        }
      }
    }
    return moves;
  }

  makeMove(move, promotionChoice = 'q') {
    const piece = this.board[move.from.r][move.from.c];
    const color = this.getPieceColor(piece);
    let captured = this.board[move.to.r][move.to.c];

    this.history.push({
      board: this.cloneBoard(this.board),
      move,
      turn: this.turn,
      enPassantSquare: this.enPassantSquare ? { ...this.enPassantSquare } : null,
      castling: JSON.parse(JSON.stringify(this.castling))
    });

    // En Passant execution
    if (move.isEnPassant) {
      const epRow = color === 'w' ? move.to.r + 1 : move.to.r - 1;
      captured = this.board[epRow][move.to.c];
      this.board[epRow][move.to.c] = null;
    }

    // Castling Rook repositioning
    if (move.isCastleKingside) {
      this.board[move.to.r][5] = this.board[move.to.r][7];
      this.board[move.to.r][7] = null;
    } else if (move.isCastleQueenside) {
      this.board[move.to.r][3] = this.board[move.to.r][0];
      this.board[move.to.r][0] = null;
    }

    // Move piece
    this.board[move.to.r][move.to.c] = piece;
    this.board[move.from.r][move.from.c] = null;

    // Pawn Promotion
    let promoted = false;
    if (piece.toLowerCase() === 'p' && (move.to.r === 0 || move.to.r === 7)) {
      const promoPiece = color === 'w' ? promotionChoice.toUpperCase() : promotionChoice.toLowerCase();
      this.board[move.to.r][move.to.c] = promoPiece;
      promoted = true;
    }

    // Invalidate castling rights on king or rook moves
    if (piece === 'K') { this.castling.w.k = false; this.castling.w.q = false; }
    if (piece === 'k') { this.castling.b.k = false; this.castling.b.q = false; }
    if (move.from.r === 7 && move.from.c === 7) this.castling.w.k = false;
    if (move.from.r === 7 && move.from.c === 0) this.castling.w.q = false;
    if (move.from.r === 0 && move.from.c === 7) this.castling.b.k = false;
    if (move.from.r === 0 && move.from.c === 0) this.castling.b.q = false;

    // Update En Passant availability
    if (move.isDoublePawn) {
      this.enPassantSquare = {
        r: (move.from.r + move.to.r) / 2,
        c: move.from.c
      };
    } else {
      this.enPassantSquare = null;
    }

    // Change turn
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
      isStalemate,
      san: this.formatSAN(move, piece, !!captured, inCheck, isCheckmate, promoted, promotionChoice)
    };
  }

  undo() {
    if (this.history.length === 0) return null;
    const last = this.history.pop();
    this.board = last.board;
    this.turn = last.turn;
    this.enPassantSquare = last.enPassantSquare;
    this.castling = last.castling;
    return last;
  }

  formatSAN(move, piece, isCapture, inCheck, isCheckmate, promoted, promoChoice) {
    if (move.isCastleKingside) return "O-O";
    if (move.isCastleQueenside) return "O-O-O";

    const type = piece.toLowerCase();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const targetSquare = `${files[move.to.c]}${8 - move.to.r}`;
    let san = "";

    if (type === 'p') {
      if (isCapture) {
        san += `${files[move.from.c]}x`;
      }
      san += targetSquare;
      if (promoted) san += `=${promoChoice.toUpperCase()}`;
    } else {
      san += piece.toUpperCase();
      if (isCapture) san += 'x';
      san += targetSquare;
    }

    if (isCheckmate) san += '#';
    else if (inCheck) san += '+';

    return san;
  }
}

// ==========================================
// 5. HIGH PERFORMANCE WIZARD AI (PST + MVV-LVA)
// ==========================================
class WizardAI {
  constructor(engine) {
    this.engine = engine;
    this.pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

    // Piece-Square Tables for strategic positioning
    this.pst = {
      p: [
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0
      ],
      n: [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
      ],
      b: [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
      ],
      r: [
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0
      ],
      q: [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
      ],
      k: [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
      ]
    };
  }

  evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const type = piece.toLowerCase();
        const isWhite = piece === piece.toUpperCase();
        const baseVal = this.pieceValues[type] || 0;
        
        // Lookup PST (flip index for white)
        const pIdx = isWhite ? ((7 - r) * 8 + c) : (r * 8 + c);
        const positionalVal = this.pst[type] ? this.pst[type][pIdx] : 0;
        const total = baseVal + positionalVal;

        score += isWhite ? -total : total; // Black maximizes score
      }
    }
    return score;
  }

  // MVV-LVA move ordering
  orderMoves(moves, board) {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.capture) {
        const victimVal = this.pieceValues[a.capture.toLowerCase()] || 0;
        const attackerVal = this.pieceValues[(board[a.from.r][a.from.c] || 'p').toLowerCase()] || 0;
        scoreA = victimVal * 10 - attackerVal;
      }
      if (b.capture) {
        const victimVal = this.pieceValues[b.capture.toLowerCase()] || 0;
        const attackerVal = this.pieceValues[(board[b.from.r][b.from.c] || 'p').toLowerCase()] || 0;
        scoreB = victimVal * 10 - attackerVal;
      }
      return scoreB - scoreA;
    });
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return { score: this.evaluateBoard(this.engine.board) };
    }

    const currentTurn = isMaximizing ? 'b' : 'w';
    this.engine.turn = currentTurn;
    let legalMoves = this.engine.getAllLegalMoves(currentTurn);

    if (legalMoves.length === 0) {
      if (this.engine.isCheck(currentTurn)) {
        return { score: isMaximizing ? -99999 + (4 - depth) : 99999 - (4 - depth) };
      }
      return { score: 0 }; // Stalemate
    }

    legalMoves = this.orderMoves(legalMoves, this.engine.board);
    let bestMove = legalMoves[0];

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        this.engine.makeMove(move, 'q');
        const evalResult = this.minimax(depth - 1, alpha, beta, false);
        this.engine.undo();

        if (evalResult.score > maxEval) {
          maxEval = evalResult.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evalResult.score);
        if (beta <= alpha) break; // Prune branch
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        this.engine.makeMove(move, 'q');
        const evalResult = this.minimax(depth - 1, alpha, beta, true);
        this.engine.undo();

        if (evalResult.score < minEval) {
          minEval = evalResult.score;
          bestMove = move;
        }
        beta = Math.min(beta, evalResult.score);
        if (beta <= alpha) break; // Prune branch
      }
      return { score: minEval, move: bestMove };
    }
  }

  getBestMove(depth = 2) {
    const origTurn = this.engine.turn;
    const result = this.minimax(depth, -Infinity, Infinity, true);
    this.engine.turn = origTurn;
    return result.move;
  }
}

// ==========================================
// 6. MASTER 3D SCENE & INTERACTION CONTROLLER
// ==========================================
class WizardChessApp {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.engine = new ChessEngine();
    this.ai = new WizardAI(this.engine);
    this.builder = new PieceMeshBuilder();

    this.pieceMeshes = {};
    this.squareHighlights = [];
    this.floatingCandles = [];
    this.debrisParticles = [];
    this.dustParticles = null;

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.isAnimatingCombat = false;
    this.pendingPromotionMove = null;
    this.isFlipped = false;
    this.moveCount = 1;

    this.initThree();
    this.buildGothicSanctuary();
    this.buildChessboard();
    this.syncBoardToMeshes();
    this.bindEvents();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060408, 0.045);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 9.2, 10.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 24;
    this.controls.target.set(0, 0.35, 0);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  buildGothicSanctuary() {
    // Ambient moon radiance
    const ambient = new THREE.AmbientLight(0x281c38, 1.4);
    this.scene.add(ambient);

    // Directional celestial moonlight shaft
    const moonLight = new THREE.DirectionalLight(0xb4d2ff, 1.8);
    moonLight.position.set(-8, 16, 10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 35;
    moonLight.shadow.camera.left = -7;
    moonLight.shadow.camera.right = 7;
    moonLight.shadow.camera.top = 7;
    moonLight.shadow.camera.bottom = -7;
    moonLight.shadow.bias = -0.0004;
    this.scene.add(moonLight);

    // Central board warm brazier light
    const brazier = new THREE.PointLight(0xffaa33, 1.2, 14, 1.8);
    brazier.position.set(0, 3.8, 0);
    this.scene.add(brazier);

    // Gothic Dais stone floor base
    const floorGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.4, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0710,
      roughness: 0.65,
      metalness: 0.25
    });
    const dais = new THREE.Mesh(floorGeo, floorMat);
    dais.position.y = -0.1;
    dais.receiveShadow = true;
    this.scene.add(dais);

    // Fluted Sanctuary Pillars
    const colGeo = new THREE.CylinderGeometry(0.4, 0.45, 12, 16);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x140e1c, roughness: 0.7 });
    const colPositions = [
      [-6.5, -6.5], [6.5, -6.5],
      [-6.5, 6.5],  [6.5, 6.5]
    ];
    colPositions.forEach(([x, z]) => {
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(x, 5.8, z);
      colMesh.receiveShadow = true;
      this.scene.add(colMesh);
    });

    // Ring of levitating enchanted candles
    const candleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.42, 8);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfff3d1, roughness: 0.3 });
    const flameGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });

    for (let i = 0; i < 40; i++) {
      const candleGroup = new THREE.Group();
      const body = new THREE.Mesh(candleGeo, candleMat);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 0.23;
      candleGroup.add(body);
      candleGroup.add(flame);

      const angle = (i / 40) * Math.PI * 2;
      const radius = 4.4 + (i % 3) * 1.4;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.7;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.7;
      const y = 3.2 + Math.sin(i * 1.5) * 1.2;

      candleGroup.position.set(x, y, z);

      if (i % 5 === 0) {
        const point = new THREE.PointLight(0xff9922, 0.55, 4.5);
        point.position.y = 0.25;
        candleGroup.add(point);
      }

      this.scene.add(candleGroup);
      this.floatingCandles.push({
        group: candleGroup,
        baseY: y,
        speed: 1.0 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Drifting mana dust motes
    const count = 280;
    const dustGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 18;
      pos[i + 1] = Math.random() * 8.5 + 0.2;
      pos[i + 2] = (Math.random() - 0.5) * 18;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xeedfb8,
      size: 0.055,
      transparent: true,
      opacity: 0.65
    });
    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  buildChessboard() {
    const boardGroup = new THREE.Group();
    const squareSize = 1.0;

    const lightTex = ProceduralTextureFactory.createMarbleCanvas("#f4efe6", "rgba(180, 170, 155, 0.35)");
    const darkTex = ProceduralTextureFactory.createMarbleCanvas("#14101e", "rgba(95, 75, 135, 0.3)");
    const borderTex = ProceduralTextureFactory.createRunicBorderCanvas();

    const lightSquareMat = new THREE.MeshStandardMaterial({
      map: lightTex,
      roughness: 0.24,
      metalness: 0.1
    });

    const darkSquareMat = new THREE.MeshStandardMaterial({
      map: darkTex,
      roughness: 0.35,
      metalness: 0.25
    });

    const squareGeo = new THREE.BoxGeometry(squareSize, 0.3, squareSize);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        const mat = isDark ? darkSquareMat : lightSquareMat;
        const tile = new THREE.Mesh(squareGeo, mat);
        tile.position.set((c - 3.5) * squareSize, 0.15, (r - 3.5) * squareSize);
        tile.receiveShadow = true;
        tile.userData = { r, c };
        boardGroup.add(tile);
      }
    }

    // Inscribed Runic Border Platform
    const rimMat = new THREE.MeshStandardMaterial({
      map: borderTex,
      roughness: 0.4,
      metalness: 0.4
    });
    const rimGeo = new THREE.BoxGeometry(9.3, 0.28, 9.3);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.12;
    rimMesh.receiveShadow = true;
    boardGroup.add(rimMesh);

    this.scene.add(boardGroup);
  }

  gridToWorld(r, c) {
    return new THREE.Vector3((c - 3.5) * 1.0, 0.3, (r - 3.5) * 1.0);
  }

  syncBoardToMeshes() {
    Object.values(this.pieceMeshes).forEach(mesh => {
      this.scene.remove(mesh);
      mesh.traverse(child => {
        if (child.geometry) child.geometry.dispose();
      });
    });
    this.pieceMeshes = {};

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.engine.board[r][c];
        if (piece) {
          const color = this.engine.isPieceWhite(piece) ? 'w' : 'b';
          const mesh = this.builder.buildPiece(piece, color);
          mesh.position.copy(this.gridToWorld(r, c));
          mesh.rotation.y = color === 'w' ? 0 : Math.PI;
          mesh.userData.grid = { r, c };
          this.scene.add(mesh);
          this.pieceMeshes[`${r},${c}`] = mesh;
        }
      }
    }
  }

  showLegalMoveHighlights(moves) {
    this.clearHighlights();
    const ringGeo = new THREE.RingGeometry(0.18, 0.38, 24);
    ringGeo.rotateX(-Math.PI / 2);

    moves.forEach(m => {
      const isCapture = !!this.engine.board[m.to.r][m.to.c] || m.isEnPassant;
      const mat = new THREE.MeshBasicMaterial({
        color: isCapture ? 0xff3366 : 0x4fc3f7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, mat);
      const pos = this.gridToWorld(m.to.r, m.to.c);
      ring.position.set(pos.x, 0.315, pos.z);
      this.scene.add(ring);
      this.squareHighlights.push(ring);

      gsap.to(ring.scale, {
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
    this.squareHighlights.forEach(h => {
      this.scene.remove(h);
      if (h.geometry) h.geometry.dispose();
    });
    this.squareHighlights = [];
  }

  // ==========================================
  // 7. KINETIC COMBAT CHOREOGRAPHY & DEBRIS
  // ==========================================
  triggerShatterExplosion(pos, color) {
    soundEngine.playWardShatter();

    // Directional camera shockwave recoil
    const origCam = this.camera.position.clone();
    gsap.to(this.camera.position, {
      x: origCam.x + (Math.random() - 0.5) * 0.45,
      y: origCam.y + (Math.random() - 0.5) * 0.45,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      onComplete: () => this.camera.position.copy(origCam)
    });

    // Screen flash
    const flash = document.getElementById('flash-overlay');
    flash.style.opacity = '0.55';
    gsap.to(flash, { opacity: 0, duration: 0.35 });

    // Physics stone fragment debris
    const fragMat = color === 'w' ? this.builder.whiteMaterial : this.builder.blackMaterial;
    for (let i = 0; i < 22; i++) {
      const shard = new THREE.Mesh(new THREE.DodecahedronGeometry(0.06 + Math.random() * 0.07), fragMat);
      shard.position.copy(pos);
      shard.position.y += 0.25;
      this.scene.add(shard);

      this.debrisParticles.push({
        mesh: shard,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4.0,
          Math.random() * 4.2 + 1.8,
          (Math.random() - 0.5) * 4.0
        ),
        rotSpeed: new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2),
        gravity: -9.8,
        life: 1.3
      });
    }
  }

  executeMoveWithAnimation(move, promotionChoice = 'q', onComplete) {
    this.isAnimatingCombat = true;
    const attacker = this.pieceMeshes[`${move.from.r},${move.from.c}`];
    let defender = this.pieceMeshes[`${move.to.r},${move.to.c}`];

    // En Passant defender target
    if (move.isEnPassant) {
      const epRow = attacker.userData.color === 'w' ? move.to.r + 1 : move.to.r - 1;
      defender = this.pieceMeshes[`${epRow},${move.to.c}`];
    }

    const targetPos = this.gridToWorld(move.to.r, move.to.c);
    attacker.lookAt(targetPos.x, attacker.position.y, targetPos.z);

    const isCombat = !!defender;

    if (isCombat) {
      const attackerType = attacker.userData.type;
      soundEngine.playPieceSpell(attackerType);

      // Raise translucent runic ward dome over defender
      const wardGeo = new THREE.SphereGeometry(0.48, 16, 16);
      const wardMat = new THREE.MeshBasicMaterial({
        color: defender.userData.color === 'w' ? 0x81d4fa : 0xff4081,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const wardMesh = new THREE.Mesh(wardGeo, wardMat);
      wardMesh.position.copy(defender.position);
      wardMesh.position.y += 0.45;
      this.scene.add(wardMesh);

      const timeline = gsap.timeline();

      if (attackerType === 'n') {
        // Knight parabolic leaping leap
        timeline.to(attacker.position, {
          x: (attacker.position.x + targetPos.x) / 2,
          y: 2.4,
          z: (attacker.position.z + targetPos.z) / 2,
          duration: 0.35,
          ease: "power2.out"
        });
        timeline.to(attacker.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            this.scene.remove(wardMesh);
            this.triggerShatterExplosion(targetPos, defender.userData.color);
            this.scene.remove(defender);
            this.finalizeMoveState(move, promotionChoice, onComplete);
          }
        });
      } else {
        // Magical energy projectile surge
        timeline.to(attacker.position, { y: 0.85, duration: 0.25, ease: "power1.out" });
        timeline.add(() => {
          const bolt = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 8),
            new THREE.MeshBasicMaterial({ color: attacker.userData.color === 'w' ? 0x80d8ff : 0xff1744 })
          );
          bolt.position.copy(attacker.position);
          this.scene.add(bolt);

          gsap.to(bolt.position, {
            x: targetPos.x,
            y: targetPos.y + 0.5,
            z: targetPos.z,
            duration: 0.24,
            ease: "power1.in",
            onComplete: () => {
              this.scene.remove(bolt);
              this.scene.remove(wardMesh);
              this.triggerShatterExplosion(targetPos, defender.userData.color);
              this.scene.remove(defender);
            }
          });
        });

        // Attacker claims square
        timeline.to(attacker.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 0.45,
          delay: 0.25,
          ease: "power3.inOut",
          onComplete: () => {
            this.finalizeMoveState(move, promotionChoice, onComplete);
          }
        });
      }
    } else {
      // Smooth stone sliding movement
      soundEngine.playStoneSlide();
      gsap.to(attacker.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.42,
        ease: "power2.inOut",
        onComplete: () => {
          // Move rook if castling
          if (move.isCastleKingside) {
            const rookMesh = this.pieceMeshes[`${move.to.r},7`];
            const rookTarget = this.gridToWorld(move.to.r, 5);
            gsap.to(rookMesh.position, { x: rookTarget.x, z: rookTarget.z, duration: 0.3 });
            delete this.pieceMeshes[`${move.to.r},7`];
            this.pieceMeshes[`${move.to.r},5`] = rookMesh;
            rookMesh.userData.grid = { r: move.to.r, c: 5 };
          } else if (move.isCastleQueenside) {
            const rookMesh = this.pieceMeshes[`${move.to.r},0`];
            const rookTarget = this.gridToWorld(move.to.r, 3);
            gsap.to(rookMesh.position, { x: rookTarget.x, z: rookTarget.z, duration: 0.3 });
            delete this.pieceMeshes[`${move.to.r},0`];
            this.pieceMeshes[`${move.to.r},3`] = rookMesh;
            rookMesh.userData.grid = { r: move.to.r, c: 3 };
          }
          this.finalizeMoveState(move, promotionChoice, onComplete);
        }
      });
    }
  }

  finalizeMoveState(move, promotionChoice, onComplete) {
    const result = this.engine.makeMove(move, promotionChoice);

    // Update lookup table
    const moving = this.pieceMeshes[`${move.from.r},${move.from.c}`];
    delete this.pieceMeshes[`${move.from.r},${move.from.c}`];
    this.pieceMeshes[`${move.to.r},${move.to.c}`] = moving;
    moving.userData.grid = { r: move.to.r, c: move.to.c };

    // En Passant removal from mesh list
    if (move.isEnPassant) {
      const epRow = moving.userData.color === 'w' ? move.to.r + 1 : move.to.r - 1;
      delete this.pieceMeshes[`${epRow},${move.to.c}`];
    }

    if (result.captured) {
      this.addGravePiece(result.captured);
    }

    // Pawn Promotion replacement
    if (result.promoted) {
      this.scene.remove(moving);
      const newMesh = this.builder.buildPiece(promotionChoice, moving.userData.color);
      newMesh.position.copy(this.gridToWorld(move.to.r, move.to.c));
      newMesh.userData.grid = { r: move.to.r, c: move.to.c };
      this.scene.add(newMesh);
      this.pieceMeshes[`${move.to.r},${move.to.c}`] = newMesh;
    }

    // Log move in SAN format
    const turnLabel = this.engine.turn === 'b' ? `${this.moveCount}. ` : `${this.moveCount}... `;
    if (this.engine.turn === 'w') this.moveCount++;
    this.logChronicle(`${turnLabel}${result.san}`, result.captured ? 'spell-shatter' : 'spell-cast');

    this.updateHUD();

    if (result.isCheckmate) {
      soundEngine.playVictoryChime();
      const winner = this.engine.turn === 'w' ? 'Nox Legion' : 'Lumos Order';
      this.showGameOverModal(`CHECKMATE!`, `${winner} reigns victorious in the Grand Duel.`);
    } else if (result.isStalemate) {
      this.showGameOverModal(`STALEMATE!`, `The duel ends in an immutable balance of power.`);
    } else if (result.inCheck) {
      soundEngine.playCheckWarning();
      this.logChronicle(`The King is besieged in check!`, 'system-message');
    }

    this.isAnimatingCombat = false;
    if (onComplete) onComplete();
  }

  // ==========================================
  // 8. INTERACTION & INPUT DISPATCHER
  // ==========================================
  bindEvents() {
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));

    // Promotion buttons
    document.querySelectorAll('.promo-choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = btn.getAttribute('data-piece');
        document.getElementById('promotion-modal').classList.add('modal-hidden');
        if (this.pendingPromotionMove) {
          const move = this.pendingPromotionMove;
          this.pendingPromotionMove = null;
          this.executeMoveWithAnimation(move, choice, () => this.checkAIMove());
        }
      });
    });

    // Control buttons
    document.getElementById('btn-undo').addEventListener('click', () => this.handleUndo());
    document.getElementById('btn-restart').addEventListener('click', () => this.handleReset());
    document.getElementById('modal-btn-restart').addEventListener('click', () => {
      document.getElementById('game-modal').classList.add('modal-hidden');
      this.handleReset();
    });

    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      soundEngine.muted = !soundEngine.muted;
      soundBtn.textContent = soundEngine.muted ? 'Sound: OFF' : 'Sound: ON';
      if (!soundEngine.muted) soundEngine.playSelect();
    });

    // Camera presets
    document.getElementById('btn-cam-reset').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 0, y: 9.2, z: this.isFlipped ? -10.2 : 10.2, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0.35, 0);
    });

    document.getElementById('btn-cam-tactical').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 0, y: 13.5, z: 0.1, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0, 0);
    });

    document.getElementById('btn-cam-duel').addEventListener('click', () => {
      gsap.to(this.camera.position, { x: 3.8, y: 3.4, z: this.isFlipped ? -5.8 : 5.8, duration: 1.2, ease: "power2.inOut" });
      this.controls.target.set(0, 0.5, 0);
    });

    document.getElementById('btn-cam-flip').addEventListener('click', () => {
      this.isFlipped = !this.isFlipped;
      const camZ = this.isFlipped ? -10.2 : 10.2;
      gsap.to(this.camera.position, { x: 0, y: 9.2, z: camZ, duration: 1.4, ease: "power3.inOut" });
      this.controls.target.set(0, 0.35, 0);
    });
  }

  onPointerDown(e) {
    if (this.isAnimatingCombat || this.pendingPromotionMove) return;

    soundEngine.ensureContext();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length === 0) return;

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

    // Check if target is a selected legal move
    if (this.selectedSquare) {
      const matchMove = this.legalMovesForSelected.find(
        m => m.to.r === clickedRow && m.to.c === clickedCol
      );

      if (matchMove) {
        const piece = this.engine.board[matchMove.from.r][matchMove.from.c];
        const isPromotion = piece.toLowerCase() === 'p' && (matchMove.to.r === 0 || matchMove.to.r === 7);

        this.clearHighlights();
        this.deselect();

        if (isPromotion) {
          this.pendingPromotionMove = matchMove;
          document.getElementById('promotion-modal').classList.remove('modal-hidden');
        } else {
          this.executeMoveWithAnimation(matchMove, 'q', () => this.checkAIMove());
        }
        return;
      }
    }

    // Select piece
    const targetCode = this.engine.board[clickedRow][clickedCol];
    if (targetCode && this.engine.getPieceColor(targetCode) === this.engine.turn) {
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
    if (diff === 'pvp' || this.engine.turn !== 'b') return;

    const depth = parseInt(diff, 10) || 2;
    this.logChronicle("The Archmage weaves a counter-curse...", "system-message");

    setTimeout(() => {
      const aiMove = this.ai.getBestMove(depth);
      if (aiMove) {
        this.executeMoveWithAnimation(aiMove, 'q', () => {});
      }
    }, 450);
  }

  handleUndo() {
    if (this.isAnimatingCombat) return;
    const undone = this.engine.undo();
    if (undone) {
      const diff = document.getElementById('ai-difficulty').value;
      if (diff !== 'pvp' && this.engine.turn === 'b') {
        this.engine.undo();
      }
      this.syncBoardToMeshes();
      this.clearHighlights();
      this.selectedSquare = null;
      this.updateHUD();
      this.logChronicle("Time reverses! The incantation unravels.", "system-message");
    }
  }

  handleReset() {
    if (this.isAnimatingCombat) return;
    this.engine.reset();
    this.moveCount = 1;
    this.syncBoardToMeshes();
    this.clearHighlights();
    this.selectedSquare = null;
    this.pendingPromotionMove = null;
    document.getElementById('white-graveyard').innerHTML = '';
    document.getElementById('black-graveyard').innerHTML = '';
    document.getElementById('duel-log').innerHTML = '<div class="log-entry system-message">The duel chamber stirs. Cast your incantation.</div>';
    this.updateHUD();
  }

  // ==========================================
  // 9. HUD & ADVANTAGE RECALCULATION
  // ==========================================
  updateHUD() {
    const turnText = document.getElementById('turn-text');
    const turnGem = document.getElementById('turn-gem');
    if (this.engine.turn === 'w') {
      turnText.textContent = "LUMOS ORDER’S TURN";
      turnGem.style.background = "var(--lumos-blue)";
      turnGem.style.boxShadow = "0 0 12px var(--lumos-blue-glow)";
    } else {
      turnText.textContent = "NOX LEGION’S TURN";
      turnGem.style.background = "var(--nox-crimson)";
      turnGem.style.boxShadow = "0 0 12px var(--nox-crimson-glow)";
    }

    // Material calculation
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.engine.board[r][c];
        if (p && p.toLowerCase() !== 'k') {
          const val = values[p.toLowerCase()] || 0;
          score += p === p.toUpperCase() ? val : -val;
        }
      }
    }

    const advText = document.getElementById('material-advantage-text');
    if (score > 0) advText.textContent = `LUMOS ADVANTAGE +${score}`;
    else if (score < 0) advText.textContent = `NOX ADVANTAGE +${Math.abs(score)}`;
    else advText.textContent = `EQUAL POWER`;
  }

  addGravePiece(piece) {
    const isWhite = piece === piece.toUpperCase();
    const container = document.getElementById(isWhite ? 'white-graveyard' : 'black-graveyard');
    const slot = document.createElement('div');
    slot.className = `grave-piece ${isWhite ? 'white-piece' : 'black-piece'}`;
    const glyphs = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
    slot.textContent = glyphs[piece.toLowerCase()] || '♟';
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
  // 10. CONTINUOUS RENDERING & PHYSICS ENGINE
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = 0.016;
    const time = performance.now() * 0.001;

    this.controls.update();

    // Harmonic Candle float animation
    for (const c of this.floatingCandles) {
      c.group.position.y = c.baseY + Math.sin(time * c.speed + c.phase) * 0.15;
    }

    // Drifting mana dust
    if (this.dustParticles) {
      const arr = this.dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += delta * 0.22;
        if (arr[i] > 8.5) arr[i] = 0.2;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Physics debris fragments
    for (let i = this.debrisParticles.length - 1; i >= 0; i--) {
      const p = this.debrisParticles[i];
      p.life -= delta;
      p.velocity.y += p.gravity * delta;
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;

      if (p.mesh.position.y < 0.15) {
        p.mesh.position.y = 0.15;
        p.velocity.y *= -0.42; // Bounce
        p.velocity.x *= 0.65;
        p.velocity.z *= 0.65;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        this.debrisParticles.splice(i, 1);
      }
    }

    // Queen's floating core idle pulse
    for (let key in this.pieceMeshes) {
      const core = this.pieceMeshes[key].getObjectByName("floatingCore");
      if (core) {
        core.rotation.y += 0.025;
        core.position.y = 1.42 + Math.sin(time * 3.5) * 0.06;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate on window load
window.addEventListener('DOMContentLoaded', () => {
  new WizardChessApp();
});