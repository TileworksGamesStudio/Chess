/**
 * WIZARD'S CHESS: THE GRAND DUEL (2D MOBILE EDITION)
 *
 * Fully optimized for mobile screens:
 * - 2D Canvas combat choreography (ward bursts, stone debris, arcane rays)
 * - Complete chess engine (Castling, En Passant, Promotion Modal, Check/Mate)
 * - Minimax AI with MVV-LVA move ordering & PST evaluation
 * - Touch-first input with zero zoom lag & sound engine context unblocking
 */

// ==========================================
// 1. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================
class MagicSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensureContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!this.ctx && AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
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
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playStoneSlide() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playSpell(type) {
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
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.22);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        break;
      case 'b': // Bishop solar flare
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        break;
      case 'r': // Rook shockwave
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.linearRampToValueAtTime(35, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        break;
      case 'q': // Queen arcane flash
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(340, t);
        osc.frequency.exponentialRampToValueAtTime(1600, t + 0.26);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        break;
      default: // Pawn strike
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.16);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        break;
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + 0.3);
  }

  playWardShatter() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Detonation thump
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(30, t + 0.35);
    subGain.gain.setValueAtTime(0.55, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start();
    sub.stop(t + 0.4);

    // Crystalline shatter burst
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();
  }

  playVictoryChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.85);
    });
  }
}

const soundEngine = new MagicSoundEngine();

// ==========================================
// 2. COMPLETE CHESS LOGIC ENGINE
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
    this.enPassantSquare = null;
    this.castling = {
      w: { k: true, q: true },
      b: { k: true, q: true }
    };
  }

  cloneBoard(board) {
    return board.map(row => [...row]);
  }

  isPieceWhite(piece) {
    return piece && piece === piece.toUpperCase();
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

      if (this.isValidPos(r + dir, c) && !board[r + dir][c]) {
        moves.push({ from: { r, c }, to: { r: r + dir, c } });
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push({ from: { r, c }, to: { r: r + 2 * dir, c }, isDoublePawn: true });
        }
      }

      [-1, 1].forEach(dc => {
        const tr = r + dir;
        const tc = c + dc;
        if (this.isValidPos(tr, tc)) {
          if (board[tr][tc] && this.getPieceColor(board[tr][tc]) !== color) {
            moves.push({ from: { r, c }, to: { r: tr, c: tc }, capture: board[tr][tc] });
          } else if (this.enPassantSquare && this.enPassantSquare.r === tr && this.enPassantSquare.c === tc) {
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

      if (this.castling[color].k && !board[r][c + 1] && !board[r][c + 2]) {
        moves.push({ from: { r, c }, to: { r, c: c + 2 }, isCastleKingside: true });
      }
      if (this.castling[color].q && !board[r][c - 1] && !board[r][c - 2] && !board[r][c - 3]) {
        moves.push({ from: { r, c }, to: { r, c: c - 2 }, isCastleQueenside: true });
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

    if (move.isEnPassant) {
      const epRow = color === 'w' ? move.to.r + 1 : move.to.r - 1;
      captured = this.board[epRow][move.to.c];
      this.board[epRow][move.to.c] = null;
    }

    if (move.isCastleKingside) {
      this.board[move.to.r][5] = this.board[move.to.r][7];
      this.board[move.to.r][7] = null;
    } else if (move.isCastleQueenside) {
      this.board[move.to.r][3] = this.board[move.to.r][0];
      this.board[move.to.r][0] = null;
    }

    this.board[move.to.r][move.to.c] = piece;
    this.board[move.from.r][move.from.c] = null;

    let promoted = false;
    if (piece.toLowerCase() === 'p' && (move.to.r === 0 || move.to.r === 7)) {
      const promoPiece = color === 'w' ? promotionChoice.toUpperCase() : promotionChoice.toLowerCase();
      this.board[move.to.r][move.to.c] = promoPiece;
      promoted = true;
    }

    if (piece === 'K') { this.castling.w.k = false; this.castling.w.q = false; }
    if (piece === 'k') { this.castling.b.k = false; this.castling.b.q = false; }
    if (move.from.r === 7 && move.from.c === 7) this.castling.w.k = false;
    if (move.from.r === 7 && move.from.c === 0) this.castling.w.q = false;
    if (move.from.r === 0 && move.from.c === 7) this.castling.b.k = false;
    if (move.from.r === 0 && move.from.c === 0) this.castling.b.q = false;

    this.enPassantSquare = move.isDoublePawn ? { r: (move.from.r + move.to.r) / 2, c: move.from.c } : null;

    this.turn = this.turn === 'w' ? 'b' : 'w';
    const inCheck = this.isCheck(this.turn);
    const hasMoves = this.getAllLegalMoves(this.turn).length > 0;

    return {
      captured,
      promoted,
      inCheck,
      isCheckmate: inCheck && !hasMoves,
      isStalemate: !inCheck && !hasMoves,
      san: this.formatSAN(move, piece, !!captured, inCheck, inCheck && !hasMoves, promoted, promotionChoice)
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
    const target = `${files[move.to.c]}${8 - move.to.r}`;
    let san = "";

    if (type === 'p') {
      if (isCapture) san += `${files[move.from.c]}x`;
      san += target;
      if (promoted) san += `=${promoChoice.toUpperCase()}`;
    } else {
      san += piece.toUpperCase();
      if (isCapture) san += 'x';
      san += target;
    }

    if (isCheckmate) san += '#';
    else if (inCheck) san += '+';

    return san;
  }
}

// ==========================================
// 3. OPTIMIZED WIZARD AI (PST + MVV-LVA)
// ==========================================
class WizardAI {
  constructor(engine) {
    this.engine = engine;
    this.pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
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
        -40,-25,-20,-20,-20,-20,-25,-40,
        -25,  0,  0,  0,  0,  0,  0,-25,
        -20,  0, 10, 15, 15, 10,  0,-20,
        -20,  5, 15, 20, 20, 15,  5,-20,
        -20,  0, 15, 20, 20, 15,  0,-20,
        -20,  5, 10, 15, 15, 10,  5,-20,
        -25,  0,  0,  5,  5,  0,  0,-25,
        -40,-25,-20,-20,-20,-20,-25,-40
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
        const base = this.pieceValues[type] || 0;
        const pIdx = isWhite ? ((7 - r) * 8 + c) : (r * 8 + c);
        const pos = this.pst[type] ? this.pst[type][pIdx] : 0;
        const total = base + pos;
        score += isWhite ? -total : total;
      }
    }
    return score;
  }

  orderMoves(moves, board) {
    return moves.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.capture) {
        const victim = this.pieceValues[a.capture.toLowerCase()] || 0;
        const attacker = this.pieceValues[(board[a.from.r][a.from.c] || 'p').toLowerCase()] || 0;
        scoreA = victim * 10 - attacker;
      }
      if (b.capture) {
        const victim = this.pieceValues[b.capture.toLowerCase()] || 0;
        const attacker = this.pieceValues[(board[b.from.r][b.from.c] || 'p').toLowerCase()] || 0;
        scoreB = victim * 10 - attacker;
      }
      return scoreB - scoreA;
    });
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) return { score: this.evaluateBoard(this.engine.board) };

    const currentTurn = isMaximizing ? 'b' : 'w';
    this.engine.turn = currentTurn;
    let legalMoves = this.engine.getAllLegalMoves(currentTurn);

    if (legalMoves.length === 0) {
      if (this.engine.isCheck(currentTurn)) {
        return { score: isMaximizing ? -99999 + (4 - depth) : 99999 - (4 - depth) };
      }
      return { score: 0 };
    }

    legalMoves = this.orderMoves(legalMoves, this.engine.board);
    let bestMove = legalMoves[0];

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        this.engine.makeMove(move, 'q');
        const evalRes = this.minimax(depth - 1, alpha, beta, false);
        this.engine.undo();

        if (evalRes.score > maxEval) {
          maxEval = evalRes.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evalRes.score);
        if (beta <= alpha) break;
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        this.engine.makeMove(move, 'q');
        const evalRes = this.minimax(depth - 1, alpha, beta, true);
        this.engine.undo();

        if (evalRes.score < minEval) {
          minEval = evalRes.score;
          bestMove = move;
        }
        beta = Math.min(beta, evalRes.score);
        if (beta <= alpha) break;
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
// 4. 2D COMBAT CANVAS FX RENDERER
// ==========================================
class CombatFXManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.beams = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  triggerWardShatter(x, y, color = 'nox') {
    const isLumos = color === 'lumos';
    const primaryColor = isLumos ? '#81d4fa' : '#ff4081';
    const coreColor = isLumos ? '#ffffff' : '#ffb2dd';

    // Particle debris
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 1.5,
        color: Math.random() > 0.4 ? primaryColor : coreColor,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }

    // Ward shockwave ring
    this.beams.push({
      type: 'shockwave',
      x,
      y,
      radius: 8,
      maxRadius: 45,
      color: primaryColor,
      alpha: 1
    });
  }

  triggerSpellRay(fromX, fromY, toX, toY, attackerColor = 'lumos') {
    const rayColor = attackerColor === 'lumos' ? '#4fc3f7' : '#ff3366';
    this.beams.push({
      type: 'ray',
      fromX,
      fromY,
      toX,
      toY,
      color: rayColor,
      progress: 0,
      alpha: 1
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & draw beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      if (b.type === 'shockwave') {
        b.radius += 2.5;
        b.alpha -= 0.045;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = b.color;
        this.ctx.globalAlpha = Math.max(0, b.alpha);
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.restore();
        if (b.alpha <= 0) this.beams.splice(i, 1);
      } else if (b.type === 'ray') {
        b.progress += 0.18;
        b.alpha -= 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(b.fromX, b.fromY);
        this.ctx.lineTo(b.toX, b.toY);
        this.ctx.strokeStyle = b.color;
        this.ctx.globalAlpha = Math.max(0, b.alpha);
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = b.color;
        this.ctx.stroke();
        this.ctx.restore();
        if (b.alpha <= 0 || b.progress >= 1) this.beams.splice(i, 1);
      }
    }

    // Update & draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fill();
      this.ctx.restore();

      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }
}

// ==========================================
// 5. MASTER 2D APP CONTROLLER
// ==========================================
class WizardChessApp {
  constructor() {
    this.engine = new ChessEngine();
    this.ai = new WizardAI(this.engine);
    this.boardEl = document.getElementById('chessboard');
    this.fx = new CombatFXManager(document.getElementById('fx-canvas'));

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.isAnimating = false;
    this.pendingPromotionMove = null;
    this.isFlipped = false;
    this.moveCount = 1;

    this.pieceGlyphs = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
    };

    this.initBoardDOM();
    this.renderPieces();
    this.bindEvents();
    this.updateHUD();
  }

  initBoardDOM() {
    this.boardEl.innerHTML = '';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      for (let colIdx = 0; colIdx < 8; colIdx++) {
        const r = this.isFlipped ? 7 - rowIdx : rowIdx;
        const c = this.isFlipped ? 7 - colIdx : colIdx;
        const tile = document.createElement('div');
        const isDark = (r + c) % 2 === 1;

        tile.className = `tile ${isDark ? 'dark' : 'light'}`;
        tile.dataset.r = r;
        tile.dataset.c = c;

        // Rank & File notations
        const isFileEdge = this.isFlipped ? r === 0 : r === 7;
        const isRankEdge = this.isFlipped ? c === 7 : c === 0;
        if (isFileEdge) {
          tile.classList.add('file-label');
          tile.setAttribute('data-coord', files[c]);
        }
        if (isRankEdge) {
          tile.classList.add('rank-label');
          tile.setAttribute('data-coord', 8 - r);
        }

        this.boardEl.appendChild(tile);
      }
    }
  }

  getTileElement(r, c) {
    return this.boardEl.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
  }

  renderPieces() {
    document.querySelectorAll('.tile').forEach(tile => {
      const r = parseInt(tile.dataset.r, 10);
      const c = parseInt(tile.dataset.c, 10);
      const piece = this.engine.board[r][c];

      tile.innerHTML = '';
      if (piece) {
        const isWhite = this.engine.isPieceWhite(piece);
        const span = document.createElement('span');
        span.className = `piece ${isWhite ? 'white' : 'black'}`;
        span.textContent = this.pieceGlyphs[piece.toLowerCase()];
        tile.appendChild(span);
      }
    });

    // Highlight check on King
    document.querySelectorAll('.tile.in-check').forEach(t => t.classList.remove('in-check'));
    if (this.engine.isCheck(this.engine.turn)) {
      const kingPos = this.engine.findKing(this.engine.turn);
      if (kingPos) {
        const tile = this.getTileElement(kingPos.r, kingPos.c);
        if (tile) tile.classList.add('in-check');
      }
    }
  }

  showHighlights() {
    this.clearHighlights();
    if (!this.selectedSquare) return;

    const selTile = this.getTileElement(this.selectedSquare.r, this.selectedSquare.c);
    if (selTile) selTile.classList.add('selected');

    this.legalMovesForSelected.forEach(m => {
      const tile = this.getTileElement(m.to.r, m.to.c);
      if (tile) {
        const isCapture = !!this.engine.board[m.to.r][m.to.c] || m.isEnPassant;
        const marker = document.createElement('div');
        marker.className = isCapture ? 'capture-ring' : 'move-dot';
        tile.appendChild(marker);
      }
    });
  }

  clearHighlights() {
    document.querySelectorAll('.tile.selected').forEach(t => t.classList.remove('selected'));
    document.querySelectorAll('.move-dot, .capture-ring').forEach(el => el.remove());
  }

  bindEvents() {
    // Board pointer touch/click
    this.boardEl.addEventListener('pointerdown', (e) => this.onTileClick(e));

    // Promotion Dialog Buttons
    document.querySelectorAll('.promo-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.piece;
        document.getElementById('promotion-modal').classList.add('modal-hidden');
        if (this.pendingPromotionMove) {
          const move = this.pendingPromotionMove;
          this.pendingPromotionMove = null;
          this.executeMove(move, choice, () => this.triggerAITurn());
        }
      });
    });

    // Action buttons
    document.getElementById('btn-undo').addEventListener('click', () => this.handleUndo());
    document.getElementById('btn-flip').addEventListener('click', () => this.handleFlip());
    document.getElementById('btn-restart').addEventListener('click', () => this.handleReset());
    document.getElementById('modal-btn-restart').addEventListener('click', () => {
      document.getElementById('game-modal').classList.add('modal-hidden');
      this.handleReset();
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      soundEngine.ensureContext();
      soundEngine.muted = !soundEngine.muted;
      document.getElementById('sound-icon').textContent = soundEngine.muted ? '🔇' : '🔊';
      if (!soundEngine.muted) soundEngine.playSelect();
    });

    // Chronicle Drawer
    const drawer = document.getElementById('chronicle-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    document.getElementById('btn-log-toggle').addEventListener('click', () => {
      drawer.classList.toggle('drawer-hidden');
      backdrop.classList.toggle('drawer-backdrop-hidden');
    });
    const closeDrawer = () => {
      drawer.classList.add('drawer-hidden');
      backdrop.classList.add('drawer-backdrop-hidden');
    };
    document.getElementById('btn-close-drawer').addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
  }

  onTileClick(e) {
    if (this.isAnimating || this.pendingPromotionMove) return;
    soundEngine.ensureContext();

    const tile = e.target.closest('.tile');
    if (!tile) return;

    const r = parseInt(tile.dataset.r, 10);
    const c = parseInt(tile.dataset.c, 10);

    if (this.selectedSquare) {
      const match = this.legalMovesForSelected.find(m => m.to.r === r && m.to.c === c);
      if (match) {
        const piece = this.engine.board[match.from.r][match.from.c];
        const isPromotion = piece.toLowerCase() === 'p' && (match.to.r === 0 || match.to.r === 7);

        this.deselect();
        if (isPromotion) {
          this.pendingPromotionMove = match;
          document.getElementById('promotion-modal').classList.remove('modal-hidden');
        } else {
          this.executeMove(match, 'q', () => this.triggerAITurn());
        }
        return;
      }
    }

    const piece = this.engine.board[r][c];
    if (piece && this.engine.getPieceColor(piece) === this.engine.turn) {
      this.selectedSquare = { r, c };
      soundEngine.playSelect();
      this.legalMovesForSelected = this.engine.getLegalMoves(r, c);
      this.showHighlights();
    } else {
      this.deselect();
    }
  }

  deselect() {
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.clearHighlights();
  }

  executeMove(move, promo = 'q', onComplete) {
    this.isAnimating = true;
    const fromTile = this.getTileElement(move.from.r, move.from.c);
    const toTile = this.getTileElement(move.to.r, move.to.c);
    const attacker = this.engine.board[move.from.r][move.from.c];
    let defender = this.engine.board[move.to.r][move.to.c];

    if (move.isEnPassant) {
      const epRow = this.engine.turn === 'w' ? move.to.r + 1 : move.to.r - 1;
      defender = this.engine.board[epRow][move.to.c];
    }

    const isCapture = !!defender;

    // Last move highlight
    document.querySelectorAll('.tile.last-move').forEach(t => t.classList.remove('last-move'));
    fromTile.classList.add('last-move');
    toTile.classList.add('last-move');

    const fromRect = fromTile.getBoundingClientRect();
    const toRect = toTile.getBoundingClientRect();
    const boardRect = document.getElementById('board-frame').getBoundingClientRect();

    const startX = fromRect.left - boardRect.left + fromRect.width / 2;
    const startY = fromRect.top - boardRect.top + fromRect.height / 2;
    const endX = toRect.left - boardRect.left + toRect.width / 2;
    const endY = toRect.top - boardRect.top + toRect.height / 2;

    if (isCapture) {
      const attackerType = attacker.toLowerCase();
      soundEngine.playSpell(attackerType);
      this.fx.triggerSpellRay(startX, startY, endX, endY, this.engine.turn === 'w' ? 'lumos' : 'nox');

      setTimeout(() => {
        soundEngine.playWardShatter();
        this.fx.triggerWardShatter(endX, endY, this.engine.turn === 'w' ? 'nox' : 'lumos');

        // Mobile screen shake
        const frame = document.getElementById('board-frame');
        frame.classList.add('shake-screen');
        setTimeout(() => frame.classList.remove('shake-screen'), 350);

        this.finalizeMove(move, promo, onComplete);
      }, 180);
    } else {
      soundEngine.playStoneSlide();
      this.finalizeMove(move, promo, onComplete);
    }
  }

  finalizeMove(move, promo, onComplete) {
    const res = this.engine.makeMove(move, promo);
    if (res.captured) this.addGraveyard(res.captured);

    const turnLabel = this.engine.turn === 'b' ? `${this.moveCount}. ` : `${this.moveCount}... `;
    if (this.engine.turn === 'w') this.moveCount++;
    this.logChronicle(`${turnLabel}${res.san}`, res.captured ? 'spell-shatter' : 'spell-cast');

    this.renderPieces();
    this.updateHUD();

    if (res.isCheckmate) {
      soundEngine.playVictoryChime();
      const winner = this.engine.turn === 'w' ? 'Nox Legion' : 'Lumos Order';
      this.showGameOverModal('CHECKMATE!', `${winner} reigns victorious in the Grand Duel.`);
    } else if (res.isStalemate) {
      this.showGameOverModal('STALEMATE!', 'The magical powers have reached total equilibrium.');
    }

    this.isAnimating = false;
    if (onComplete) onComplete();
  }

  triggerAITurn() {
    const diff = document.getElementById('ai-difficulty').value;
    if (diff === 'pvp' || this.engine.turn !== 'b') return;

    const depth = parseInt(diff, 10) || 2;
    this.logChronicle("Archmage conjures an incantation...", "system-message");

    setTimeout(() => {
      const best = this.ai.getBestMove(depth);
      if (best) {
        this.executeMove(best, 'q', () => {});
      }
    }, 280);
  }

  handleUndo() {
    if (this.isAnimating) return;
    const undone = this.engine.undo();
    if (undone) {
      const diff = document.getElementById('ai-difficulty').value;
      if (diff !== 'pvp' && this.engine.turn === 'b') {
        this.engine.undo();
      }
      this.deselect();
      this.renderPieces();
      this.updateHUD();
      this.logChronicle("Time reverses! Spell unraveled.", "system-message");
    }
  }

  handleFlip() {
    this.isFlipped = !this.isFlipped;
    this.initBoardDOM();
    this.renderPieces();
    this.deselect();
  }

  handleReset() {
    if (this.isAnimating) return;
    this.engine.reset();
    this.moveCount = 1;
    this.deselect();
    document.querySelectorAll('.tile.last-move').forEach(t => t.classList.remove('last-move'));
    document.getElementById('lumos-graveyard').innerHTML = '';
    document.getElementById('nox-graveyard').innerHTML = '';
    document.getElementById('duel-log').innerHTML = '<div class="log-entry system-message">The duel chamber stirs. Cast your incantation.</div>';
    this.renderPieces();
    this.updateHUD();
  }

  updateHUD() {
    const turnText = document.getElementById('turn-text');
    const turnGem = document.getElementById('turn-gem');
    if (this.engine.turn === 'w') {
      turnText.textContent = "LUMOS ORDER";
      turnGem.style.background = "var(--lumos-blue)";
      turnGem.style.boxShadow = "0 0 10px var(--lumos-blue-glow)";
    } else {
      turnText.textContent = "NOX LEGION";
      turnGem.style.background = "var(--nox-crimson)";
      turnGem.style.boxShadow = "0 0 10px var(--nox-crimson-glow)";
    }

    // Material Balance
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.engine.board[r][c];
        if (p && p.toLowerCase() !== 'k') {
          score += (p === p.toUpperCase() ? 1 : -1) * (values[p.toLowerCase()] || 0);
        }
      }
    }
    const advEl = document.getElementById('material-advantage-text');
    if (score > 0) advEl.textContent = `LUMOS +${score}`;
    else if (score < 0) advEl.textContent = `NOX +${Math.abs(score)}`;
    else advEl.textContent = "EQUAL POWER";
  }

  addGraveyard(piece) {
    const isWhite = piece === piece.toUpperCase();
    const container = document.getElementById(isWhite ? 'lumos-graveyard' : 'nox-graveyard');
    const slot = document.createElement('span');
    slot.className = `grave-piece ${isWhite ? 'lumos' : 'nox'}`;
    slot.textContent = this.pieceGlyphs[piece.toLowerCase()] || '♟';
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
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('game-modal').classList.remove('modal-hidden');
  }
}

// Boot up once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new WizardChessApp();
});