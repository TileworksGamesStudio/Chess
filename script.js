/**
 * Master Chess - Full Engine, Web Audio, Positional AI & Touch Logic
 */

// =============================================================================
// 1. High-Fidelity SVG Piece Assets
// =============================================================================
const PIECE_SVGS = {
  p: `<svg viewBox="0 0 45 45"><path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 C 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5"/></svg>`,
  r: `<svg viewBox="0 0 45 45"><g fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 z" /><path d="M 12,36 L 12,32 L 33,32 L 33,36 z" /><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" /><path d="M 34,14 L 31,17 L 14,17 L 11,14" /><path d="M 14,17 L 14,29.5 L 31,29.5 L 31,17" /><path d="M 14,29.5 L 11,32 L 34,32 L 31,29.5" stroke-linejoin="miter"/></g></svg>`,
  n: `<svg viewBox="0 0 45 45"><g fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" /><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.95,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.99,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,7.4 17.02,5.06 20.92,5 C 20.92,5 20.28,6.8 22,8 C 23.72,9.2 24.28,10.3 22,10 z" /><circle cx="15" cy="14" r="1.2" fill="CURRENT_STROKE"/></g></svg>`,
  b: `<svg viewBox="0 0 45 45"><g fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 z" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" /><path d="M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 z" /><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke-linejoin="miter"/></g></svg>`,
  q: `<svg viewBox="0 0 45 45"><g fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9 13 A 2 2 0 1 1 5,13 A 2 2 0 1 1 9 13 z M 24 9 A 2 2 0 1 1 20,9 A 2 2 0 1 1 24 9 z M 39 13 A 2 2 0 1 1 35,13 A 2 2 0 1 1 39 13 z M 16 10.5 A 1.5 1.5 0 1 1 13,10.5 A 1.5 1.5 0 1 1 16 10.5 z M 32 10.5 A 1.5 1.5 0 1 1 29,10.5 A 1.5 1.5 0 1 1 32 10.5 z"/><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 22.5,10 L 14,25 L 7,14 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 L 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 L 9,26 z"/></g></svg>`,
  k: `<svg viewBox="0 0 45 45"><g fill="CURRENT_FILL" stroke="CURRENT_STROKE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8" /><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 20,14.5 C 18.5,17.5 22.5,25 22.5,25" /><path d="M 12.5,37 C 15,40.5 30,40.5 32.5,37 C 32.5,30 29.5,25 22.5,25 C 15.5,25 12.5,30 12.5,37 z" /><path d="M 11.5,30 C 15,29 30,29 33.5,30 M 12,33.5 C 18,32.5 27,32.5 33,33.5" /></g></svg>`
};

function getPieceSVG(pieceType, color) {
  const base = PIECE_SVGS[pieceType.toLowerCase()];
  if (!base) return '';
  const isWhite = color === 'w';
  return base
    .replace(/CURRENT_FILL/g, isWhite ? '#ffffff' : '#1e232a')
    .replace(/CURRENT_STROKE/g, isWhite ? '#1e232a' : '#eceff4');
}

// =============================================================================
// 2. Synthesized Zero-Dependency Web Audio System
// =============================================================================
const SoundFX = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },

  play(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    switch (type) {
      case 'move':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
        break;

      case 'capture':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
        break;

      case 'check':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.setValueAtTime(880, t + 0.08); // A5
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);
        break;

      case 'castle':
        // Two quick wood taps
        this.play('move');
        setTimeout(() => this.play('move'), 80);
        break;

      case 'victory':
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.2, t + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.25);
          o.start(t + i * 0.1);
          o.stop(t + i * 0.1 + 0.25);
        });
        break;
    }
  }
};

// =============================================================================
// 3. Positional AI Evaluation Engine (Minimax with Alpha-Beta Pruning)
// =============================================================================
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Piece-Square Tables (encourages central control, development, king safety)
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  5,  0,  0,  5,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10, 10,  5, 10, 10,  5, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

function evaluateBoard(game) {
  let totalScore = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const pstTable = PST[piece.type];
      const pstVal = piece.color === 'w' ? pstTable[r][c] : pstTable[7 - r][c];
      const score = val + pstVal;

      totalScore += (piece.color === 'w') ? score : -score;
    }
  }
  return totalScore;
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.game_over()) {
    return { evaluation: evaluateBoard(game) };
  }

  const moves = game.moves({ verbose: true });
  
  // Move Ordering heuristic: captures first for faster Alpha-Beta cutoffs
  moves.sort((a, b) => {
    const scoreA = a.captured ? PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece] : 0;
    const scoreB = b.captured ? PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece] : 0;
    return scoreB - scoreA;
  });

  let bestMove = null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const res = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      if (res.evaluation > maxEval) {
        maxEval = res.evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, res.evaluation);
      if (beta <= alpha) break;
    }
    return { evaluation: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const res = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      if (res.evaluation < minEval) {
        minEval = res.evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, res.evaluation);
      if (beta <= alpha) break;
    }
    return { evaluation: minEval, bestMove };
  }
}

// =============================================================================
// 4. Game State & Configuration
// =============================================================================
const GameState = {
  chess: new Chess(),
  orientation: 'w', // 'w' or 'b'
  selectedSquare: null,
  legalMovesCache: [],
  lastMove: null,
  hintSquare: null,
  pendingPromotion: null,

  // Settings
  mode: 'ai', // 'ai' or 'pvp'
  difficulty: 2, // 1: Novice, 2: Casual, 3: Club, 4: Master
  haptics: true,
  isAIThinking: false,

  // Local Storage Stats
  stats: {
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    streak: 0,
    bestStreak: 0
  },

  loadStats() {
    try {
      const saved = localStorage.getItem('crown_chess_stats');
      if (saved) this.stats = JSON.parse(saved);
    } catch (e) { console.warn(e); }
  },

  saveStats() {
    try {
      localStorage.setItem('crown_chess_stats', JSON.stringify(this.stats));
    } catch (e) { console.warn(e); }
  },

  vibrate(pattern) {
    if (this.haptics && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }
};

// =============================================================================
// 5. Board Rendering & Interactions
// =============================================================================
const boardEl = document.getElementById('chessboard');

function renderBoard() {
  boardEl.innerHTML = '';
  const board = GameState.chess.board();
  const isFlipped = GameState.orientation === 'b';
  const ranks = isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const inCheck = GameState.chess.in_check();
  const turn = GameState.chess.turn();

  for (let rIdx = 0; rIdx < 8; rIdx++) {
    for (let fIdx = 0; fIdx < 8; fIdx++) {
      const rank = ranks[rIdx];
      const file = files[fIdx];
      const squareName = file + rank;

      const sq = document.createElement('div');
      sq.className = `square ${(rIdx + fIdx) % 2 === 0 ? 'light' : 'dark'}`;
      sq.dataset.square = squareName;

      // Coordinate Labels
      if (fIdx === 7) {
        const rCoord = document.createElement('span');
        rCoord.className = 'coord coord-rank';
        rCoord.textContent = rank;
        sq.appendChild(rCoord);
      }
      if (rIdx === 7) {
        const fCoord = document.createElement('span');
        fCoord.className = 'coord coord-file';
        fCoord.textContent = file;
        sq.appendChild(fCoord);
      }

      // Highlights: selected, last move, check, hint
      if (GameState.selectedSquare === squareName) {
        sq.classList.add('selected');
      }
      if (GameState.lastMove && (GameState.lastMove.from === squareName || GameState.lastMove.to === squareName)) {
        sq.classList.add('last-move');
      }
      if (GameState.hintSquare && (GameState.hintSquare.from === squareName || GameState.hintSquare.to === squareName)) {
        const hintGlow = document.createElement('div');
        hintGlow.className = 'hint-glow';
        sq.appendChild(hintGlow);
      }

      // Piece rendering
      const actualR = 8 - rank;
      const actualC = file.charCodeAt(0) - 97;
      const piece = board[actualR][actualC];

      if (piece) {
        // Red check aura if King in check
        if (piece.type === 'k' && piece.color === turn && inCheck) {
          sq.classList.add('in-check');
        }

        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece';
        pieceEl.innerHTML = getPieceSVG(piece.type, piece.color);
        sq.appendChild(pieceEl);
      }

      // Valid move destination markers
      const isLegal = GameState.legalMovesCache.find(m => m.to === squareName);
      if (isLegal) {
        const marker = document.createElement('div');
        marker.className = isLegal.captured ? 'capture-ring' : 'move-marker';
        sq.appendChild(marker);
      }

      // Touch / Click Bindings
      sq.addEventListener('pointerdown', (e) => onSquareClick(squareName, e));

      boardEl.appendChild(sq);
    }
  }

  updateTurnBadges();
  updateCapturedPieces();
  updateEvaluationBar();
}

// =============================================================================
// 6. User Move & Touch Logic
// =============================================================================
function onSquareClick(squareName, e) {
  if (GameState.isAIThinking) return;
  if (GameState.chess.game_over()) return;

  // In AI mode, restrict moves when not your turn
  if (GameState.mode === 'ai' && GameState.chess.turn() !== GameState.orientation) {
    return;
  }

  // Clear hint
  GameState.hintSquare = null;

  const pieceOnSquare = GameState.chess.get(squareName);

  // If a piece was already selected, check if destination is valid
  if (GameState.selectedSquare) {
    if (GameState.selectedSquare === squareName) {
      // Deselect
      GameState.selectedSquare = null;
      GameState.legalMovesCache = [];
      renderBoard();
      return;
    }

    const legalMove = GameState.legalMovesCache.find(m => m.to === squareName);
    if (legalMove) {
      // Check for pawn promotion
      if (legalMove.flags.includes('p')) {
        promptPromotion(GameState.selectedSquare, squareName);
        return;
      }

      makeMove({ from: GameState.selectedSquare, to: squareName });
      GameState.selectedSquare = null;
      GameState.legalMovesCache = [];
      return;
    }
  }

  // Select piece if it belongs to current active turn
  if (pieceOnSquare && pieceOnSquare.color === GameState.chess.turn()) {
    GameState.selectedSquare = squareName;
    GameState.legalMovesCache = GameState.chess.moves({ square: squareName, verbose: true });
    GameState.vibrate(10);
    renderBoard();
  } else {
    GameState.selectedSquare = null;
    GameState.legalMovesCache = [];
    renderBoard();
  }
}

function makeMove(moveObj) {
  const result = GameState.chess.move(moveObj);
  if (!result) return false;

  GameState.lastMove = result;

  // Audio & Haptic Feedback
  if (GameState.chess.in_checkmate()) {
    SoundFX.play('victory');
    GameState.vibrate([40, 60, 100]);
  } else if (GameState.chess.in_check()) {
    SoundFX.play('check');
    GameState.vibrate([30, 40, 30]);
  } else if (result.flags.includes('k') || result.flags.includes('q')) {
    SoundFX.play('castle');
    GameState.vibrate(20);
  } else if (result.captured) {
    SoundFX.play('capture');
    GameState.vibrate(25);
  } else {
    SoundFX.play('move');
    GameState.vibrate(15);
  }

  renderBoard();
  appendHistoryStrip(result);
  checkGameOverStatus();

  // Trigger AI if game active
  if (!GameState.chess.game_over() && GameState.mode === 'ai' && GameState.chess.turn() !== GameState.orientation) {
    triggerAIMove();
  }

  return true;
}

// =============================================================================
// 7. AI Move Orchestration
// =============================================================================
function triggerAIMove() {
  GameState.isAIThinking = true;
  document.getElementById('name-top').textContent = 'Thinking...';

  // Slight deliberate delay for realistic UX and DOM unblocking
  setTimeout(() => {
    const isMaximizing = GameState.chess.turn() === 'w';
    let chosenMove = null;

    // Difficulty 1: Novice (random with light heuristic)
    if (GameState.difficulty === 1 && Math.random() < 0.35) {
      const moves = GameState.chess.moves({ verbose: true });
      chosenMove = moves[Math.floor(Math.random() * moves.length)];
    } else {
      const depth = GameState.difficulty >= 3 ? 3 : 2;
      const search = minimax(GameState.chess, depth, -Infinity, Infinity, isMaximizing);
      chosenMove = search.bestMove;
    }

    GameState.isAIThinking = false;
    document.getElementById('name-top').textContent = 'Stockfish AI';

    if (chosenMove) {
      makeMove({
        from: chosenMove.from,
        to: chosenMove.to,
        promotion: 'q'
      });
    }
  }, 280);
}

// =============================================================================
// 8. Promotion Modal Handling
// =============================================================================
function promptPromotion(from, to) {
  GameState.pendingPromotion = { from, to };
  const turn = GameState.chess.turn();
  const container = document.getElementById('promotion-choices');
  container.innerHTML = '';

  const options = ['q', 'r', 'b', 'n'];
  options.forEach(p => {
    const btn = document.createElement('div');
    btn.className = 'promo-option';
    btn.innerHTML = getPieceSVG(p, turn);
    btn.onclick = () => selectPromotion(p);
    container.appendChild(btn);
  });

  document.getElementById('modal-promotion').classList.add('open');
}

function selectPromotion(pieceType) {
  document.getElementById('modal-promotion').classList.remove('open');
  if (GameState.pendingPromotion) {
    makeMove({
      from: GameState.pendingPromotion.from,
      to: GameState.pendingPromotion.to,
      promotion: pieceType
    });
    GameState.pendingPromotion = null;
    GameState.selectedSquare = null;
    GameState.legalMovesCache = [];
  }
}

// =============================================================================
// 9. UI Sync, Captures, Evaluation, & History
// =============================================================================
function updateTurnBadges() {
  const turn = GameState.chess.turn();
  const isTopTurn = (GameState.orientation === 'w') ? (turn === 'b') : (turn === 'w');
  
  document.getElementById('turn-top').classList.toggle('active', isTopTurn);
  document.getElementById('turn-bottom').classList.toggle('active', !isTopTurn);
}

function updateCapturedPieces() {
  const history = GameState.chess.history({ verbose: true });
  const capturedW = [];
  const capturedB = [];
  let scoreW = 0;
  let scoreB = 0;

  history.forEach(m => {
    if (m.captured) {
      if (m.color === 'w') {
        capturedB.push(m.captured);
        scoreW += PIECE_VALUES[m.captured] / 100;
      } else {
        capturedW.push(m.captured);
        scoreB += PIECE_VALUES[m.captured] / 100;
      }
    }
  });

  const topCaptures = GameState.orientation === 'w' ? capturedW : capturedB;
  const bottomCaptures = GameState.orientation === 'w' ? capturedB : capturedW;

  renderCaptureIcons('captures-top', topCaptures, GameState.orientation === 'w' ? 'w' : 'b');
  renderCaptureIcons('captures-bottom', bottomCaptures, GameState.orientation === 'w' ? 'b' : 'w');

  const diffTop = document.getElementById('diff-top');
  const diffBottom = document.getElementById('diff-bottom');
  diffTop.textContent = '';
  diffBottom.textContent = '';

  const net = scoreW - scoreB;
  if (GameState.orientation === 'w') {
    if (net > 0) diffBottom.textContent = `+${net}`;
    if (net < 0) diffTop.textContent = `+${Math.abs(net)}`;
  } else {
    if (net < 0) diffBottom.textContent = `+${Math.abs(net)}`;
    if (net > 0) diffTop.textContent = `+${net}`;
  }
}

function renderCaptureIcons(elementId, pieces, pieceColor) {
  const el = document.getElementById(elementId);
  el.innerHTML = '';
  pieces.forEach(p => {
    const span = document.createElement('span');
    span.innerHTML = getPieceSVG(p, pieceColor);
    el.appendChild(span);
  });
}

function updateEvaluationBar() {
  const evalScore = evaluateBoard(GameState.chess) / 100;
  // Convert score into percentage (0% = Black winning, 100% = White winning)
  let percentage = 50 + (evalScore * 4);
  percentage = Math.max(5, Math.min(95, percentage));
  
  // Invert height if board is oriented as Black
  const fillPct = GameState.orientation === 'w' ? percentage : (100 - percentage);
  document.getElementById('eval-fill').style.height = `${fillPct}%`;
}

function appendHistoryStrip(lastMove) {
  const strip = document.getElementById('history-strip');
  const history = GameState.chess.history();
  if (history.length === 1) strip.innerHTML = '';

  const moveNumber = Math.ceil(history.length / 2);
  const isWhite = history.length % 2 !== 0;

  if (isWhite) {
    const turnSpan = document.createElement('span');
    turnSpan.className = 'history-turn';
    turnSpan.innerHTML = `<span class="num">${moveNumber}.</span><span class="move latest">${lastMove.san}</span>`;
    strip.appendChild(turnSpan);
  } else {
    const turns = strip.getElementsByClassName('history-turn');
    const latestTurn = turns[turns.length - 1];
    if (latestTurn) {
      const prevMove = latestTurn.querySelector('.move.latest');
      if (prevMove) prevMove.classList.remove('latest');
      const bMove = document.createElement('span');
      bMove.className = 'move latest';
      bMove.textContent = lastMove.san;
      latestTurn.appendChild(bMove);
    }
  }
  strip.scrollLeft = strip.scrollWidth;
}

// =============================================================================
// 10. Game Over & Stats Modals
// =============================================================================
function checkGameOverStatus() {
  if (!GameState.chess.game_over()) return;

  let title = 'Game Over';
  let reason = '';
  let icon = '🤝';
  let isWin = false;
  let isLoss = false;

  if (GameState.chess.in_checkmate()) {
    const winner = GameState.chess.turn() === 'w' ? 'Black' : 'White';
    title = 'Checkmate!';
    reason = `${winner} wins by surrender of the king.`;
    icon = '🏆';

    if (GameState.mode === 'ai') {
      const userWon = (winner === 'White' && GameState.orientation === 'w') ||
                      (winner === 'Black' && GameState.orientation === 'b');
      if (userWon) {
        isWin = true;
        title = 'Victory!';
        icon = '👑';
      } else {
        isLoss = true;
        title = 'Defeat';
        icon = '💀';
      }
    }
  } else if (GameState.chess.in_stalemate()) {
    title = 'Stalemate';
    reason = 'Draw: No legal moves possible.';
  } else if (GameState.chess.in_threefold_repetition()) {
    title = 'Repetition';
    reason = 'Draw by threefold repetition.';
  } else if (GameState.chess.insufficient_material()) {
    title = 'Insufficient Material';
    reason = 'Draw: Not enough pieces for checkmate.';
  } else {
    reason = 'Draw by 50-move rule.';
  }

  // Update Stats
  GameState.stats.games++;
  if (isWin) {
    GameState.stats.wins++;
    GameState.stats.streak++;
    if (GameState.stats.streak > GameState.stats.bestStreak) {
      GameState.stats.bestStreak = GameState.stats.streak;
    }
  } else if (isLoss) {
    GameState.stats.losses++;
    GameState.stats.streak = 0;
  } else {
    GameState.stats.draws++;
  }
  GameState.saveStats();

  // Populate Game Over Card
  document.getElementById('gameover-icon').textContent = icon;
  document.getElementById('gameover-title').textContent = title;
  document.getElementById('gameover-reason').textContent = reason;
  document.getElementById('stat-total-moves').textContent = GameState.chess.history().length;
  document.getElementById('stat-accuracy').textContent = title;

  setTimeout(() => {
    document.getElementById('modal-gameover').classList.add('open');
  }, 600);
}

function updateStatsModal() {
  const s = GameState.stats;
  document.getElementById('stats-games').textContent = s.games;
  document.getElementById('stats-wins').textContent = s.wins;
  document.getElementById('stats-losses').textContent = s.losses;
  document.getElementById('stats-draws').textContent = s.draws;
  const rate = s.games > 0 ? Math.round((s.wins / s.games) * 100) : 0;
  document.getElementById('stats-winrate').textContent = `${rate}%`;
  document.getElementById('stats-streak').textContent = s.streak;
}

// =============================================================================
// 11. Event Handlers & Control Setup
// =============================================================================
function startNewGame() {
  GameState.chess.reset();
  GameState.selectedSquare = null;
  GameState.legalMovesCache = [];
  GameState.lastMove = null;
  GameState.hintSquare = null;
  GameState.isAIThinking = false;
  document.getElementById('history-strip').innerHTML = '<span class="history-empty">Game started. Make your move!</span>';
  document.getElementById('modal-gameover').classList.remove('open');

  if (GameState.mode === 'ai' && GameState.orientation === 'b') {
    renderBoard();
    triggerAIMove();
  } else {
    renderBoard();
  }
}

function setupEventListeners() {
  // Sound Toggle
  document.getElementById('btn-sound').onclick = () => {
    SoundFX.enabled = !SoundFX.enabled;
    document.querySelector('.sound-on').classList.toggle('hidden', !SoundFX.enabled);
    document.querySelector('.sound-off').classList.toggle('hidden', SoundFX.enabled);
  };

  // Undo Move
  document.getElementById('btn-undo').onclick = () => {
    if (GameState.isAIThinking) return;
    if (GameState.mode === 'ai') {
      // Revert AI move and player move
      GameState.chess.undo();
      GameState.chess.undo();
    } else {
      GameState.chess.undo();
    }
    GameState.selectedSquare = null;
    GameState.legalMovesCache = [];
    GameState.lastMove = null;
    GameState.hintSquare = null;
    renderBoard();
  };

  // Hint Button (Computes best move and highlights it)
  document.getElementById('btn-hint').onclick = () => {
    if (GameState.isAIThinking || GameState.chess.game_over()) return;
    const isMaximizing = GameState.chess.turn() === 'w';
    const search = minimax(GameState.chess, 3, -Infinity, Infinity, isMaximizing);
    if (search.bestMove) {
      GameState.hintSquare = search.bestMove;
      renderBoard();
      GameState.vibrate([15, 30]);
    }
  };

  // Flip Board
  document.getElementById('btn-flip').onclick = () => {
    GameState.orientation = GameState.orientation === 'w' ? 'b' : 'w';
    renderBoard();
  };

  // New Game
  document.getElementById('btn-new-game').onclick = startNewGame;
  document.getElementById('btn-play-again').onclick = startNewGame;
  document.getElementById('btn-close-gameover').onclick = () => {
    document.getElementById('modal-gameover').classList.remove('open');
  };

  // Modals Open/Close
  document.getElementById('btn-stats').onclick = () => {
    updateStatsModal();
    document.getElementById('modal-stats').classList.add('open');
  };
  document.getElementById('btn-close-stats').onclick = () => {
    document.getElementById('modal-stats').classList.remove('open');
  };
  document.getElementById('btn-reset-stats').onclick = () => {
    if (confirm('Reset all chess records?')) {
      GameState.stats = { games: 0, wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 };
      GameState.saveStats();
      updateStatsModal();
    }
  };

  document.getElementById('btn-settings').onclick = () => {
    document.getElementById('modal-settings').classList.add('open');
  };
  document.getElementById('btn-close-settings').onclick = () => {
    document.getElementById('modal-settings').classList.remove('open');
  };

  // Mode Selection (AI vs PvP)
  document.querySelectorAll('#mode-selector .seg-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('#mode-selector .seg-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      GameState.mode = e.target.dataset.mode;
      document.getElementById('difficulty-group').style.display = GameState.mode === 'ai' ? 'flex' : 'none';
      
      // Update top player name
      document.getElementById('name-top').textContent = GameState.mode === 'ai' ? 'Stockfish AI' : 'Player 2';
      document.getElementById('avatar-top').textContent = GameState.mode === 'ai' ? '🤖' : '👥';
      startNewGame();
    };
  });

  // Difficulty Selection
  document.querySelectorAll('#diff-selector .seg-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('#diff-selector .seg-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      GameState.difficulty = parseInt(e.target.dataset.diff, 10);
      document.getElementById('badge-top').textContent = `Level ${GameState.difficulty}`;
    };
  });

  // Themes
  document.querySelectorAll('#theme-selector .theme-pill').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('#theme-selector .theme-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      document.body.setAttribute('data-theme', e.target.dataset.theme);
    };
  });

  // Haptics Checkbox
  document.getElementById('check-haptics').onchange = (e) => {
    GameState.haptics = e.target.checked;
  };
}

// =============================================================================
// 12. Initialization
// =============================================================================
window.addEventListener('DOMContentLoaded', () => {
  GameState.loadStats();
  setupEventListeners();
  renderBoard();
});