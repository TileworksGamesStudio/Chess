import { Chess } from './vendor/chess.js';

const CONFIG = {
  boardAsset: './assets/board.svg',
  pieceRoot: './assets/pieces',
  states: ['standard', 'moving', 'attacking', 'celebrate', 'defeated', 'secret'],
  pieces: ['p', 'n', 'b', 'r', 'q', 'k'],
  colors: ['w', 'b'],
  pieceValues: { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 },

  orientation: 'w',
  playerColor: 'w',
  engineElo: 1800,
  engineMoveTime: 500,
  soundEnabled: true,

  pieceScale: 1.08,
  aiThinkingDelaysMs: [600, 950, 1300, 1750],
  moveStateDurationMs: 400,
  attackStateDurationMs: 650,
  celebrateStateDurationMs: 3500,
  defeatedAnimationMs: 450,
  defeatedHoldMs: 650,
};

// ============================================================
// STUDIO-GRADE PROCEDURAL AUDIO ENGINE (PHYSICAL ACOUSTICS)
// ============================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(type) {
    if (!CONFIG.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (type === 'move') {
        // Warm tactile wooden thud (felt transient + sine body)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'capture') {
        // High impact dual-transient strike
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'check') {
        // Crystalline dual bell shimmer (E5 & G#5)
        [659.25, 830.61].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.04);

          gain.gain.setValueAtTime(0.3, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.4);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.4);
        });
      } else if (type === 'victory') {
        // Ascending Grandmaster Major 9th flourish
        [523.25, 659.25, 783.99, 987.77, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);

          gain.gain.setValueAtTime(0.35, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.45);
        });
      }
    } catch {
      // Audio safety fallback
    }
  }
}
const sfx = new SoundFX();

// Optional haptic vibration trigger for supported mobile devices
function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return;
  try {
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(22);
    else if (type === 'heavy') navigator.vibrate([30, 40, 30]);
  } catch {}
}

// ============================================================
// PARTICLE CELEBRATION
// ============================================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const palette = ['#7952fc', '#00e5ff', '#ffc837', '#ff3366', '#00e676'];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.75) * 22,
      size: Math.random() * 8 + 4,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.alpha -= p.decay;
      p.rotation += p.rSpeed;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active) requestAnimationFrame(render);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(render);
}

// ============================================================
// CONTEXTUAL PIECE PERSONALITY & SPEECH
// ============================================================
let activeBubble = null;

const PIECE_PHRASES = {
  w: {
    p: "Holding the line!",
    n: "Unleash the flank!",
    b: "Dominating the diagonal.",
    r: "File open and secured.",
    q: "The board answers to me.",
    k: "To victory!",
  },
  b: {
    p: "No retreat.",
    n: "Leaping into the fray!",
    b: "Piercing through.",
    r: "Solidifying the rank!",
    q: "Yield before perfection.",
    k: "Stand resolute.",
  }
};

function showBubble(square, piece) {
  if (activeBubble) clearTimeout(activeBubble.timeout);
  activeBubble = {
    square,
    phrase: PIECE_PHRASES[piece.color]?.[piece.type] || "Forward!",
    fading: false,
    timeout: setTimeout(() => {
      activeBubble.fading = true;
      renderBoard();
      activeBubble.timeout = setTimeout(() => {
        activeBubble = null;
        renderBoard();
      }, 250);
    }, 1800)
  };
}

function clearBubble() {
  if (activeBubble) {
    clearTimeout(activeBubble.timeout);
    activeBubble = null;
  }
}

// ============================================================
// DOM ELEMENTS
// ============================================================
const boardEl = document.querySelector('#board');
const coordsFilesEl = document.querySelector('#coordsFiles');
const coordsRanksEl = document.querySelector('#coordsRanks');
const statusEl = document.querySelector('#statusText');
const matchSubText = document.querySelector('#matchSubText');
const turnBadge = document.querySelector('#turnBadge');
const opponentStatusDot = document.querySelector('#opponentStatusDot');
const playerStatusDot = document.querySelector('#playerStatusDot');
const moveListBody = document.querySelector('#moveListBody');
const emptyHistoryMsg = document.querySelector('#emptyHistoryMsg');
const moveCounter = document.querySelector('#moveCounter');

const playerCapturedTray = document.querySelector('#playerCapturedTray');
const opponentCapturedTray = document.querySelector('#opponentCapturedTray');
const playerAdvantage = document.querySelector('#playerAdvantage');
const opponentAdvantage = document.querySelector('#opponentAdvantage');
const playerSideBadge = document.querySelector('#playerSideBadge');
const opponentEloTag = document.querySelector('#opponentEloTag');

// Modals
const promotionModal = document.querySelector('#promotionModal');
const promotionChoices = document.querySelector('#promotionChoices');
const gameResultModal = document.querySelector('#gameResultModal');
const gameResultIcon = document.querySelector('#gameResultIcon');
const gameResultTitle = document.querySelector('#gameResultTitle');
const gameResultMessage = document.querySelector('#gameResultMessage');
const resTotalMoves = document.querySelector('#resTotalMoves');
const resOpponentElo = document.querySelector('#resOpponentElo');
const modalPlayAgainBtn = document.querySelector('#modalPlayAgainBtn');
const modalReviewBtn = document.querySelector('#modalReviewBtn');

const startModal = document.querySelector('#startModal');
const startGameBtn = document.querySelector('#startGameBtn');
const sideSelectGroup = document.querySelector('#sideSelectGroup');
const eloSelectGroup = document.querySelector('#eloSelectGroup');

// Toolbar Controls
const hudSoundBtn = document.querySelector('#hudSoundBtn');
const soundIconOn = document.querySelector('#soundIconOn');
const soundIconOff = document.querySelector('#soundIconOff');
const hudFlipBtn = document.querySelector('#hudFlipBtn');
const hudUndoBtn = document.querySelector('#hudUndoBtn');
const hudMenuBtn = document.querySelector('#hudMenuBtn');

// Hidden fallback DOM elements
const newGameBtn = document.querySelector('#newGameBtn');
const flipBtn = document.querySelector('#flipBtn');
const undoBtn = document.querySelector('#undoBtn');
const claimDrawBtn = document.querySelector('#claimDrawBtn');
const resignBtn = document.querySelector('#resignBtn');
const playerColorEl = document.querySelector('#playerColor');
const engineStrengthEl = document.querySelector('#engineStrength');
const engineTimeEl = document.querySelector('#engineTime');
const fenBox = document.querySelector('#fenBox');

// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
let chess = new Chess();
let engine = null;
let engineReady = false;
let engineBusy = false;
let engineInitPromise = null;
let engineReadyWaiters = [];
let engineSearchToken = 0;
let activeSearchToken = null;
let pendingEngineMove = null;

let selectedSquare = null;
let legalTargets = [];
let orientation = 'w';
let playerColor = CONFIG.playerColor;
let gameOver = false;
let gameStartFen = chess.fen();
let pendingPromotion = null;
let visualGeneration = 0;
let visualTimers = new Set();
let engineDelayTimer = null;

const stateOverrides = new Map();

// Drag & Drop State
let dragPointerId = null;
let dragFromSquare = null;
let dragGhostEl = null;

const lastMoveState = {
  from: null,
  to: null,
  activeState: null,
  result: null,
  resultColor: null,
  defeatedSquare: null,
  captureGhost: null,
};

function fileName(piece, color, state) {
  return `${CONFIG.pieceRoot}/${state}/${color}-${piece}.svg`;
}

function boardSquares() {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const orderedFiles = orientation === 'w' ? files : [...files].reverse();
  const orderedRanks = orientation === 'w' ? ranks : [...ranks].reverse();
  const squares = [];

  for (const rank of orderedRanks) {
    for (const file of orderedFiles) {
      squares.push(`${file}${rank}`);
    }
  }
  return squares;
}

function allPieceStates() {
  const map = new Map();
  for (const row of chess.board()) {
    for (const piece of row) {
      if (piece) map.set(piece.square, piece);
    }
  }
  return map;
}

function desiredState(square, piece) {
  if (!piece) return null;
  if (stateOverrides.has(square)) return stateOverrides.get(square);
  if (square === lastMoveState.defeatedSquare) return 'defeated';
  if (lastMoveState.to === square && lastMoveState.activeState === 'celebrate' && piece.color === lastMoveState.resultColor) {
    return 'celebrate';
  }
  if (lastMoveState.to === square && lastMoveState.activeState) {
    return lastMoveState.activeState;
  }
  return 'standard';
}

function createPieceImage(piece, state, extraClass = '') {
  const img = document.createElement('img');
  img.className = `piece state-${state} ${extraClass}`.trim();
  img.alt = `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`;
  img.src = fileName(piece.type, piece.color, state);
  img.draggable = false;
  img.onerror = () => {
    if (state !== 'standard') {
      img.src = fileName(piece.type, piece.color, 'standard');
    }
  };
  return img;
}

function clearVisualTimers() {
  for (const timer of visualTimers) window.clearTimeout(timer);
  visualTimers.clear();
}

function clearEngineDelayTimer() {
  if (engineDelayTimer !== null) {
    window.clearTimeout(engineDelayTimer);
    engineDelayTimer = null;
  }
}

function scheduleVisualReset(generation, delayMs) {
  const timer = window.setTimeout(() => {
    visualTimers.delete(timer);
    if (generation !== visualGeneration) return;
    lastMoveState.activeState = null;
    renderBoard();
  }, delayMs);
  visualTimers.add(timer);
}

function scheduleDefeatedRemoval(generation, delayMs) {
  const timer = window.setTimeout(() => {
    visualTimers.delete(timer);
    if (generation !== visualGeneration) return;
    lastMoveState.defeatedSquare = null;
    lastMoveState.captureGhost = null;
    renderBoard();
  }, delayMs);
  visualTimers.add(timer);
}

function squareGridPosition(square) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const rawFile = files.indexOf(square[0]);
  const rawRank = ranks.indexOf(square[1]);

  return {
    file: orientation === 'w' ? rawFile : 7 - rawFile,
    rank: orientation === 'w' ? rawRank : 7 - rawRank,
  };
}

// ============================================================
// COORDINATES NOTATION RENDERER
// ============================================================
function renderCoordinates() {
  const files = orientation === 'w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];
  const ranks = orientation === 'w' ? ['8','7','6','5','4','3','2','1'] : ['1','2','3','4','5','6','7','8'];

  coordsFilesEl.innerHTML = files.map(f => `<span>${f}</span>`).join('');
  coordsRanksEl.innerHTML = ranks.map(r => `<span>${r}</span>`).join('');
}

// ============================================================
// BOARD RENDERING & INTERACTIVE DRAG-AND-DROP
// ============================================================
function renderBoard() {
  boardEl.innerHTML = '';

  const art = document.createElement('img');
  art.className = 'board-art';
  art.src = CONFIG.boardAsset;
  art.alt = 'Custom chess board art';
  boardEl.appendChild(art);

  const grid = document.createElement('div');
  grid.className = 'board-grid';

  const pieces = allPieceStates();
  const checkedKing = chess.isCheck() ? findKingSquare(chess.turn()) : null;

  for (const square of boardSquares()) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'square';
    cell.dataset.square = square;

    if (square === selectedSquare) cell.classList.add('selected');

    if (legalTargets.includes(square)) {
      cell.classList.add(chess.get(square) ? 'capture' : 'legal');
    }

    if (square === lastMoveState.from || square === lastMoveState.to) {
      cell.classList.add('last-move');
    }

    if (square === checkedKing) {
      cell.classList.add('check');
    }

    const piece = pieces.get(square);
    if (piece) {
      // If actively dragging this piece, hide it on the square
      if (dragFromSquare !== square) {
        cell.appendChild(createPieceImage(piece, desiredState(square, piece)));
      } else {
        cell.classList.add('is-dragging');
      }
    }

    if (activeBubble && activeBubble.square === square) {
      const bubble = document.createElement('div');
      bubble.className = `speech-bubble ${activeBubble.fading ? 'fade-out' : ''}`;
      bubble.innerText = activeBubble.phrase;
      cell.appendChild(bubble);
    }

    // Pointer Event Listeners for seamless Touch & Mouse Dragging
    cell.addEventListener('pointerdown', (e) => onSquarePointerDown(e, square));
    cell.addEventListener('click', () => onSquareClick(square));

    grid.appendChild(cell);
  }

  boardEl.appendChild(grid);

  if (lastMoveState.captureGhost) {
    const ghost = createPieceImage(lastMoveState.captureGhost.piece, 'defeated', 'capture-ghost');
    ghost.style.left = `${lastMoveState.captureGhost.file * 12.5}%`;
    ghost.style.top = `${lastMoveState.captureGhost.rank * 12.5}%`;
    ghost.style.width = '12.5%';
    ghost.style.height = '12.5%';
    boardEl.appendChild(ghost);
  }
}

function findKingSquare(color) {
  for (const [square, piece] of allPieceStates()) {
    if (piece.color === color && piece.type === 'k') return square;
  }
  return null;
}

// ============================================================
// DRAG & DROP POINTER HANDLING
// ============================================================
function onSquarePointerDown(e, square) {
  if (gameOver || engineBusy || chess.turn() !== playerColor || pendingPromotion) return;
  const piece = chess.get(square);
  if (!piece || piece.color !== playerColor) return;

  dragPointerId = e.pointerId;
  dragFromSquare = square;

  selectedSquare = square;
  legalTargets = getLegalTargets(square);

  // Create floating drag preview
  dragGhostEl = createPieceImage(piece, 'standard', 'is-drag-preview');
  const squareRect = e.currentTarget.getBoundingClientRect();
  dragGhostEl.style.width = `${squareRect.width}px`;
  dragGhostEl.style.height = `${squareRect.height}px`;
  dragGhostEl.style.left = `${e.clientX}px`;
  dragGhostEl.style.top = `${e.clientY}px`;
  document.body.appendChild(dragGhostEl);

  window.addEventListener('pointermove', onGlobalPointerMove);
  window.addEventListener('pointerup', onGlobalPointerUp);
  window.addEventListener('pointercancel', onGlobalPointerUp);

  renderBoard();
}

function onGlobalPointerMove(e) {
  if (!dragGhostEl || e.pointerId !== dragPointerId) return;
  dragGhostEl.style.left = `${e.clientX}px`;
  dragGhostEl.style.top = `${e.clientY}px`;
}

function onGlobalPointerUp(e) {
  if (e.pointerId !== dragPointerId) return;

  window.removeEventListener('pointermove', onGlobalPointerMove);
  window.removeEventListener('pointerup', onGlobalPointerUp);
  window.removeEventListener('pointercancel', onGlobalPointerUp);

  if (dragGhostEl) {
    dragGhostEl.remove();
    dragGhostEl = null;
  }

  const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
  const targetSquareEl = dropTarget ? dropTarget.closest('.square') : null;
  const targetSquare = targetSquareEl ? targetSquareEl.dataset.square : null;

  const originSquare = dragFromSquare;
  dragFromSquare = null;
  dragPointerId = null;

  if (targetSquare && targetSquare !== originSquare && legalTargets.includes(targetSquare)) {
    // Check for promotion
    const legalMove = chess
      .moves({ square: originSquare, verbose: true })
      .find(m => m.to === targetSquare);

    if (legalMove?.promotion) {
      openPromotion(originSquare, targetSquare);
    } else {
      makeMove(originSquare, targetSquare, undefined, 'human');
    }
  } else {
    renderBoard();
  }
}

// Click-to-Move fallback
function onSquareClick(square) {
  if (gameOver || engineBusy || chess.turn() !== playerColor || pendingPromotion) return;

  const clickedPiece = chess.get(square);

  if (clickedPiece) {
    showBubble(square, clickedPiece);
  } else {
    clearBubble();
  }

  if (!selectedSquare) {
    if (clickedPiece?.color === playerColor) {
      selectedSquare = square;
      legalTargets = getLegalTargets(square);
    }
    renderBoard();
    return;
  }

  if (square === selectedSquare) {
    selectedSquare = null;
    legalTargets = [];
    renderBoard();
    return;
  }

  const legalMove = chess
    .moves({ square: selectedSquare, verbose: true })
    .find(move => move.to === square);

  if (!legalMove) {
    if (clickedPiece?.color === playerColor) {
      selectedSquare = square;
      legalTargets = getLegalTargets(square);
    } else {
      selectedSquare = null;
      legalTargets = [];
    }
    renderBoard();
    return;
  }

  if (legalMove.promotion) {
    openPromotion(selectedSquare, square);
    return;
  }

  makeMove(selectedSquare, square, undefined, 'human');
}

// ============================================================
// MATERIAL & CAPTURED PIECES COMPUTATION
// ============================================================
function updateMaterialEvaluation() {
  const initialPieces = {
    w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
    b: { p: 8, n: 2, b: 2, r: 2, q: 1 }
  };

  const currentBoard = chess.board();
  const remaining = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };

  let whiteScore = 0;
  let blackScore = 0;

  for (const row of currentBoard) {
    for (const piece of row) {
      if (piece && piece.type !== 'k') {
        remaining[piece.color][piece.type]++;
        if (piece.color === 'w') whiteScore += CONFIG.pieceValues[piece.type];
        else blackScore += CONFIG.pieceValues[piece.type];
      }
    }
  }

  const capturedByWhite = [];
  const capturedByBlack = [];

  for (const type of ['p', 'n', 'b', 'r', 'q']) {
    const blackLoss = initialPieces.b[type] - remaining.b[type];
    for (let i = 0; i < blackLoss; i++) capturedByWhite.push({ type, color: 'b' });

    const whiteLoss = initialPieces.w[type] - remaining.w[type];
    for (let i = 0; i < whiteLoss; i++) capturedByBlack.push({ type, color: 'w' });
  }

  const isUserWhite = playerColor === 'w';
  const userCaptured = isUserWhite ? capturedByWhite : capturedByBlack;
  const opponentCaptured = isUserWhite ? capturedByBlack : capturedByWhite;

  playerCapturedTray.innerHTML = userCaptured.map(p =>
    `<img src="${fileName(p.type, p.color, 'standard')}" class="captured-mini-piece" alt="">`
  ).join('');

  opponentCapturedTray.innerHTML = opponentCaptured.map(p =>
    `<img src="${fileName(p.type, p.color, 'standard')}" class="captured-mini-piece" alt="">`
  ).join('');

  const delta = isUserWhite ? (whiteScore - blackScore) : (blackScore - whiteScore);

  if (delta > 0) {
    playerAdvantage.textContent = `+${delta}`;
    playerAdvantage.className = 'advantage-badge leading';
    opponentAdvantage.textContent = '';
    opponentAdvantage.className = 'advantage-badge';
  } else if (delta < 0) {
    opponentAdvantage.textContent = `+${Math.abs(delta)}`;
    opponentAdvantage.className = 'advantage-badge leading';
    playerAdvantage.textContent = '';
    playerAdvantage.className = 'advantage-badge';
  } else {
    playerAdvantage.textContent = '';
    opponentAdvantage.textContent = '';
    playerAdvantage.className = 'advantage-badge';
    opponentAdvantage.className = 'advantage-badge';
  }
}

// ============================================================
// MOVE HISTORY SIDEBAR TABLE
// ============================================================
function updateMoveHistoryUI() {
  const history = chess.history();
  moveCounter.textContent = String(history.length);

  if (history.length === 0) {
    emptyHistoryMsg.style.display = 'grid';
    moveListBody.innerHTML = '';
    return;
  }

  emptyHistoryMsg.style.display = 'none';
  let html = '';

  for (let i = 0; i < history.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const whiteMove = history[i];
    const blackMove = history[i + 1] || '';

    const isCurrentWhite = (i === history.length - 1);
    const isCurrentBlack = (i + 1 === history.length - 1);

    html += `
      <tr>
        <td class="move-num">${moveNum}.</td>
        <td class="move-san ${isCurrentWhite ? 'active-ply' : ''}">${whiteMove}</td>
        <td class="move-san ${isCurrentBlack ? 'active-ply' : ''}">${blackMove}</td>
      </tr>
    `;
  }

  moveListBody.innerHTML = html;
  const scrollContainer = document.getElementById('moveHistoryContainer');
  if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
}

// ============================================================
// STATUS & TURN UPDATES
// ============================================================
function updateStatus() {
  if (gameOver) return;

  const isWhite = chess.turn() === 'w';
  const isPlayerTurn = chess.turn() === playerColor;

  turnBadge.className = `status-dot ${isWhite ? 'active' : ''} ${engineBusy ? 'thinking' : ''}`;
  opponentStatusDot.className = `status-dot ${!isPlayerTurn ? 'active' : ''} ${engineBusy ? 'thinking' : ''}`;
  playerStatusDot.className = `status-dot ${isPlayerTurn ? 'active' : ''}`;

  if (engineBusy) {
    statusEl.textContent = 'Stockfish Calculating';
    matchSubText.textContent = 'Analyzing optimal reply…';
  } else {
    const turnName = isWhite ? 'White' : 'Black';
    if (chess.isCheck()) {
      statusEl.textContent = 'Check!';
      matchSubText.textContent = `${turnName} must escape threat`;
    } else {
      statusEl.textContent = `${turnName} to Move`;
      matchSubText.textContent = isPlayerTurn ? 'Your turn to move' : 'Stockfish is preparing move';
    }
  }
}

function syncUi() {
  renderBoard();
  renderCoordinates();
  updateStatus();
  updateMoveHistoryUI();
  updateMaterialEvaluation();
  fenBox.value = chess.fen();

  playerSideBadge.textContent = playerColor === 'w' ? 'White' : 'Black';
  opponentEloTag.textContent = `${CONFIG.engineElo} Elo`;

  const canUndo = chess.history().length > 0 && !engineBusy;
  undoBtn.disabled = !canUndo;
  hudUndoBtn.style.opacity = canUndo ? '1' : '0.4';
  claimDrawBtn.disabled = !( !gameOver && isClaimableDraw() );
  resignBtn.disabled = gameOver;
}

function getLegalTargets(square) {
  try {
    return chess.moves({ square, verbose: true }).map(move => move.to);
  } catch {
    return [];
  }
}

// ============================================================
// PAWN PROMOTION
// ============================================================
function openPromotion(from, to) {
  pendingPromotion = { from, to };
  promotionChoices.innerHTML = '';

  for (const type of ['q', 'r', 'b', 'n']) {
    const button = document.createElement('button');
    button.className = 'promotion-cell';
    button.type = 'button';
    button.setAttribute('aria-label', `Promote to ${type.toUpperCase()}`);

    const img = createPieceImage({ type, color: playerColor }, 'standard');
    button.appendChild(img);

    button.addEventListener('click', () => {
      const move = pendingPromotion;
      closePromotion();
      if (move) makeMove(move.from, move.to, type, 'human');
    });

    promotionChoices.appendChild(button);
  }

  promotionModal.classList.remove('hidden');
  promotionModal.setAttribute('aria-hidden', 'false');
}

function closePromotion() {
  pendingPromotion = null;
  promotionChoices.innerHTML = '';
  promotionModal.classList.add('hidden');
  promotionModal.setAttribute('aria-hidden', 'true');
}

// ============================================================
// GAME RESULT OVERLAY
// ============================================================
function hideGameResult() {
  gameResultModal.classList.add('hidden');
  gameResultModal.setAttribute('aria-hidden', 'true');
}

function showGameResultModal(title, message, isVictory) {
  gameResultTitle.textContent = title;
  gameResultMessage.textContent = message;
  gameResultIcon.textContent = isVictory ? '👑' : (title.includes('Draw') ? '🤝' : '⚔️');
  resTotalMoves.textContent = String(chess.history().length);
  resOpponentElo.textContent = String(CONFIG.engineElo);

  if (isVictory) {
    sfx.play('victory');
    triggerHaptic('heavy');
    launchConfetti();
  }

  gameResultModal.classList.remove('hidden');
  gameResultModal.setAttribute('aria-hidden', 'false');
}

function resetVisualState() {
  clearVisualTimers();
  clearBubble();
  visualGeneration += 1;

  lastMoveState.from = null;
  lastMoveState.to = null;
  lastMoveState.activeState = null;
  lastMoveState.result = null;
  lastMoveState.resultColor = null;
  lastMoveState.defeatedSquare = null;
  lastMoveState.captureGhost = null;
}

function prepareMoveVisual(from, to, capturedPiece, capturedSquare) {
  clearVisualTimers();
  visualGeneration += 1;

  lastMoveState.from = from;
  lastMoveState.to = to;
  lastMoveState.activeState = capturedPiece ? 'attacking' : 'moving';
  lastMoveState.result = null;
  lastMoveState.resultColor = null;
  lastMoveState.defeatedSquare = null;
  lastMoveState.captureGhost = null;

  if (capturedPiece && capturedSquare) {
    const position = squareGridPosition(capturedSquare);
    lastMoveState.captureGhost = {
      piece: capturedPiece,
      file: position.file,
      rank: position.rank,
    };
  }
}

// ============================================================
// MOVE EXECUTION
// ============================================================
function makeMove(from, to, promotion, source) {
  clearBubble();
  if (gameOver) return false;

  const movingPiece = chess.get(from);
  if (!movingPiece) return false;

  let capturedPiece = chess.get(to);
  let capturedSquare = capturedPiece ? to : null;

  // Detect En Passant
  const isPotentialEnPassant =
    movingPiece.type === 'p' &&
    from[0] !== to[0] &&
    !chess.get(to);

  if (isPotentialEnPassant) {
    const captureRank = movingPiece.color === 'w' ? Number(to[1]) - 1 : Number(to[1]) + 1;
    const candidateSquare = `${to[0]}${captureRank}`;
    const candidatePiece = chess.get(candidateSquare);

    if (candidatePiece?.type === 'p' && candidatePiece.color !== movingPiece.color) {
      capturedPiece = candidatePiece;
      capturedSquare = candidateSquare;
    }
  }

  try {
    chess.move({ from, to, promotion });
  } catch (error) {
    statusEl.textContent = error?.message || 'Illegal move.';
    return false;
  }

  // Audio & Haptic Feedback
  if (chess.isCheck()) {
    sfx.play('check');
    triggerHaptic('medium');
  } else if (capturedPiece) {
    sfx.play('capture');
    triggerHaptic('medium');
  } else {
    sfx.play('move');
    triggerHaptic('light');
  }

  closePromotion();
  selectedSquare = null;
  legalTargets = [];

  stateOverrides.delete(from);
  stateOverrides.delete(to);
  if (capturedSquare) stateOverrides.delete(capturedSquare);

  prepareMoveVisual(from, to, capturedPiece, capturedSquare);
  const generation = visualGeneration;
  const stateDuration = capturedPiece ? CONFIG.attackStateDurationMs : CONFIG.moveStateDurationMs;

  if (capturedPiece && capturedSquare) {
    scheduleDefeatedRemoval(generation, CONFIG.defeatedAnimationMs + CONFIG.defeatedHoldMs);
  }

  if (isTerminalPosition()) {
    if (lastMoveState.defeatedSquare) {
      scheduleDefeatedRemoval(generation, CONFIG.defeatedAnimationMs + CONFIG.defeatedHoldMs);
    }
    scheduleVisualReset(generation, CONFIG.celebrateStateDurationMs);
    syncUi();
    return true;
  }

  scheduleVisualReset(generation, stateDuration);
  syncUi();

  if (source === 'human') {
    requestEngineMove();
  }

  return true;
}

function positionKeyFromFen(fen) {
  return fen.trim().split(/\s+/).slice(0, 4).join(' ');
}

function repetitionCountForCurrentPosition() {
  const counts = new Map();
  const addFen = fen => {
    const key = positionKeyFromFen(fen);
    counts.set(key, (counts.get(key) || 0) + 1);
  };

  addFen(gameStartFen);
  for (const move of chess.history({ verbose: true })) {
    if (move.after) addFen(move.after);
  }
  return counts.get(positionKeyFromFen(chess.fen())) || 1;
}

function isFiftyMoveClaimable() {
  const halfmoveClock = Number(chess.fen().split(/\s+/)[4] || 0);
  return halfmoveClock >= 100;
}

function isThreefoldClaimable() {
  if (typeof chess.isThreefoldRepetition === 'function' && chess.isThreefoldRepetition()) {
    return true;
  }
  return repetitionCountForCurrentPosition() >= 3;
}

function isClaimableDraw() {
  return isFiftyMoveClaimable() || isThreefoldClaimable();
}

function isTerminalPosition() {
  if (chess.isCheckmate()) {
    gameOver = true;
    const winner = chess.turn() === 'w' ? 'b' : 'w';
    const loser = chess.turn();

    lastMoveState.result = 'win';
    lastMoveState.resultColor = winner;
    lastMoveState.activeState = 'celebrate';
    lastMoveState.defeatedSquare = findKingSquare(loser);

    stopEngine();
    const playerWon = winner === playerColor;
    showGameResultModal(
      playerWon ? 'Victory!' : 'Defeat',
      playerWon ? 'Checkmate — You outplayed the engine!' : 'Checkmate — Stockfish has triumphed.',
      playerWon
    );
    return true;
  }

  if (chess.isStalemate() || chess.isInsufficientMaterial()) {
    gameOver = true;
    stopEngine();
    showGameResultModal('Draw', 'Draw by stalemate or insufficient material.', false);
    return true;
  }

  return false;
}

function undo() {
  if (engineBusy || chess.history().length === 0) return;

  stopEngine();
  closePromotion();
  gameOver = false;
  hideGameResult();

  chess.undo();
  if (chess.turn() !== playerColor && chess.history().length > 0) {
    chess.undo();
  }

  stateOverrides.clear();
  resetVisualState();
  selectedSquare = null;
  legalTargets = [];

  syncUi();

  if (chess.turn() !== playerColor && !gameOver) {
    requestEngineMove();
  }
}

function newGame() {
  stopEngine();
  closePromotion();
  hideGameResult();

  const colorSetting = playerColorEl.value;
  playerColor = colorSetting === 'random'
    ? (Math.random() < 0.5 ? 'w' : 'b')
    : colorSetting;

  orientation = playerColor;

  chess = new Chess();
  gameStartFen = chess.fen();
  gameOver = false;
  selectedSquare = null;
  legalTargets = [];
  stateOverrides.clear();
  resetVisualState();

  syncUi();

  initEngine()
    .then(() => {
      if (!gameOver && chess.turn() !== playerColor) {
        requestEngineMove();
      }
    })
    .catch(() => {
      statusEl.textContent = 'Engine ready (offline mode).';
    });
}

function settleReadyWaiters(error = null) {
  const waiters = engineReadyWaiters.splice(0);
  for (const waiter of waiters) {
    if (error) waiter.reject(error);
    else waiter.resolve();
  }
}

function waitForReadyOk() {
  return new Promise((resolve, reject) => {
    engineReadyWaiters.push({ resolve, reject });
  });
}

function resetEngineWorker() {
  if (engine) {
    try { engine.terminate(); } catch {}
  }
  engine = null;
  engineReady = false;
  engineBusy = false;
  activeSearchToken = null;
  pendingEngineMove = null;
  clearEngineDelayTimer();
  settleReadyWaiters(new Error('Engine reset.'));
}

async function initEngine() {
  if (engine && engineReady) return;
  if (engineInitPromise) return engineInitPromise;

  if (engine && !engineReady) {
    try { engine.terminate(); } catch {}
    engine = null;
  }

  engineInitPromise = (async () => {
    engine = new Worker(
      new URL('./assets/engine/stockfish-18-lite-single.js', import.meta.url),
    );

    engine.onmessage = event => onEngineLine(String(event.data ?? event));
    engine.onerror = () => {
      engineReady = false;
      engineBusy = false;
      activeSearchToken = null;
      statusEl.textContent = 'Engine offline fallback.';
      settleReadyWaiters(new Error('Stockfish worker error.'));
      engineInitPromise = null;
    };

    engine.postMessage('uci');
    await waitForReadyOk();
    engineReady = true;
  })();

  try {
    await engineInitPromise;
    engine.postMessage('setoption name UCI_LimitStrength value true');
    engine.postMessage(`setoption name UCI_Elo value ${CONFIG.engineElo}`);
    engine.postMessage('isready');
    await waitForReadyOk();
  } catch (error) {
    resetEngineWorker();
    throw error;
  } finally {
    engineInitPromise = null;
  }
}

function stopEngine() {
  engineSearchToken += 1;
  activeSearchToken = null;
  engineBusy = false;
  pendingEngineMove = null;
  clearEngineDelayTimer();

  if (engine) {
    try { engine.postMessage('stop'); } catch {}
  }
}

function onEngineLine(line) {
  if (line === 'uciok') {
    if (!engine) return;
    engine.postMessage('setoption name UCI_LimitStrength value true');
    engine.postMessage(`setoption name UCI_Elo value ${CONFIG.engineElo}`);
    engine.postMessage('isready');
    return;
  }

  if (line === 'readyok') {
    settleReadyWaiters();
    return;
  }

  if (!line.startsWith('bestmove ')) return;

  const token = activeSearchToken;
  const best = line.split(/\s+/)[1];

  if (token === null || gameOver || token !== engineSearchToken || chess.turn() === playerColor) {
    return;
  }

  if (!best || best === '(none)' || best.length < 4) {
    engineBusy = false;
    activeSearchToken = null;
    clearEngineDelayTimer();
    statusEl.textContent = 'Engine returned no move.';
    syncUi();
    return;
  }

  pendingEngineMove = {
    token,
    from: best.slice(0, 2),
    to: best.slice(2, 4),
    promotion: best.length >= 5 ? best.slice(4, 5) : undefined,
  };

  if (engineDelayTimer === null && pendingEngineMove.token === engineSearchToken) {
    const move = pendingEngineMove;
    pendingEngineMove = null;
    engineBusy = false;
    activeSearchToken = null;

    if (!makeMove(move.from, move.to, move.promotion, 'engine')) {
      statusEl.textContent = 'Engine returned invalid move.';
      syncUi();
    }
  }
}

function waitForAiRelease(token, delayMs) {
  return new Promise(resolve => {
    engineDelayTimer = window.setTimeout(() => {
      engineDelayTimer = null;
      resolve(token === engineSearchToken && !gameOver && chess.turn() !== playerColor);
    }, delayMs);
  });
}

async function requestEngineMove() {
  if (gameOver || chess.turn() === playerColor || engineBusy || engineDelayTimer !== null) return;

  try {
    await initEngine();
  } catch {
    statusEl.textContent = 'Engine calculation offline.';
    syncUi();
    return;
  }

  if (!engine || !engineReady || gameOver || chess.turn() === playerColor) return;

  const delayMs = CONFIG.aiThinkingDelaysMs[Math.floor(Math.random() * CONFIG.aiThinkingDelaysMs.length)];
  const token = ++engineSearchToken;
  activeSearchToken = null;
  engineBusy = true;

  syncUi();

  try {
    engine.postMessage('stop');
    engine.postMessage('isready');
    await waitForReadyOk();

    if (token !== engineSearchToken || gameOver || chess.turn() === playerColor || !engine) {
      engineBusy = false;
      syncUi();
      return;
    }

    activeSearchToken = token;
    engine.postMessage('ucinewgame');
    engine.postMessage('setoption name UCI_LimitStrength value true');
    engine.postMessage(`setoption name UCI_Elo value ${CONFIG.engineElo}`);
    engine.postMessage(`position fen ${chess.fen()}`);
    engine.postMessage(`go movetime ${CONFIG.engineMoveTime}`);

    const released = await waitForAiRelease(token, delayMs);
    if (!released) {
      engineBusy = false;
      activeSearchToken = null;
      pendingEngineMove = null;
      syncUi();
      return;
    }

    if (pendingEngineMove && pendingEngineMove.token === token) {
      const move = pendingEngineMove;
      pendingEngineMove = null;
      engineBusy = false;
      activeSearchToken = null;

      if (!makeMove(move.from, move.to, move.promotion, 'engine')) {
        statusEl.textContent = 'Stockfish returned an invalid move.';
        syncUi();
      }
    }
  } catch (error) {
    if (activeSearchToken === token) activeSearchToken = null;
    engineBusy = false;
    clearEngineDelayTimer();
    syncUi();
  }
}

// ============================================================
// USER SELECTION & MODAL BINDINGS
// ============================================================
sideSelectGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip-choice');
  if (!btn) return;
  sideSelectGroup.querySelectorAll('.chip-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  playerColorEl.value = btn.dataset.color;
});

eloSelectGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip-choice');
  if (!btn) return;
  eloSelectGroup.querySelectorAll('.chip-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  CONFIG.engineElo = Number(btn.dataset.elo);
  CONFIG.engineMoveTime = Number(btn.dataset.time);
  engineStrengthEl.value = btn.dataset.elo;
  engineTimeEl.value = btn.dataset.time;
});

startGameBtn.addEventListener('click', () => {
  sfx.init();
  startModal.classList.add('hidden');
  newGame();
});

modalPlayAgainBtn.addEventListener('click', () => {
  hideGameResult();
  startModal.classList.remove('hidden');
});

modalReviewBtn.addEventListener('click', () => {
  hideGameResult();
});

// Toolbar Interactions
hudFlipBtn.addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  renderBoard();
  renderCoordinates();
});

hudUndoBtn.addEventListener('click', undo);

hudMenuBtn.addEventListener('click', () => {
  startModal.classList.remove('hidden');
});

hudSoundBtn.addEventListener('click', () => {
  CONFIG.soundEnabled = !CONFIG.soundEnabled;
  soundIconOn.classList.toggle('hidden', !CONFIG.soundEnabled);
  soundIconOff.classList.toggle('hidden', CONFIG.soundEnabled);
  if (CONFIG.soundEnabled) sfx.play('move');
});

// Compatibility Bindings
newGameBtn?.addEventListener('click', newGame);
flipBtn?.addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  renderBoard();
  renderCoordinates();
});
undoBtn?.addEventListener('click', undo);

promotionModal.addEventListener('click', event => {
  if (event.target === promotionModal) closePromotion();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && pendingPromotion) {
    closePromotion();
    renderBoard();
  }
});

// Global API
window.ChessApp = {
  get chess() { return chess; },
  newGame,
  getFen: () => chess.fen(),
  getPgn: () => chess.pgn({ maxWidth: 0 }),
};

syncUi();