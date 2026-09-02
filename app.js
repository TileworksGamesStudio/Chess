import { Chess } from './vendor/chess.js';

const CONFIG = {
  boardAsset: './assets/board.svg',
  pieceRoot: './assets/pieces',
  states: ['standard', 'moving', 'attacking', 'celebrate', 'defeated', 'secret'],
  pieces: ['p', 'n', 'b', 'r', 'q', 'k'],
  colors: ['w', 'b'],
  orientation: 'w',
  playerColor: 'w',
  engineElo: 1800,
  engineMoveTime: 500,
  soundEnabled: true,

  pieceScale: 1.08,
  aiThinkingDelaysMs: [800, 1200, 1600, 2000],
  moveStateDurationMs: 400,
  attackStateDurationMs: 650,
  celebrateStateDurationMs: 3500,
  defeatedAnimationMs: 450,
  defeatedHoldMs: 700,
};

// ==========================================
// PROCEDURAL AUDIO ENGINE (Zero-Dependency)
// ==========================================
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
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'move') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'capture') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'check') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'victory') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        notes.forEach((freq, idx) => {
          const noteOsc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(this.ctx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
          noteGain.gain.setValueAtTime(0.4, now + idx * 0.12);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
          noteOsc.start(now + idx * 0.12);
          noteOsc.stop(now + idx * 0.12 + 0.3);
        });
      }
    } catch {
      // Audio fallback fail-safe
    }
  }
}
const sfx = new SoundFX();

// ==========================================
// CELEBRATION CONFETTI ENGINE
// ==========================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#7c4dff', '#00e5ff', '#ffd700', '#ff3366', '#00e676'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
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

    if (active) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

// ==========================================
// SPEECH BUBBLE SYSTEM
// ==========================================
let activeBubble = null;

const PIECE_PHRASES = {
  w: {
    p: "Forward march!",
    n: "Ready for a leap!",
    b: "The diagonals are mine.",
    r: "Clear the open files!",
    q: "Command the whole board.",
    k: "Protect the realm!",
  },
  b: {
    p: "No step back!",
    n: "Flanking maneuvering!",
    b: "Striking from afar.",
    r: "Reinforcing the ranks!",
    q: "Bow before majesty.",
    k: "Stand firm!",
  }
};

function showBubble(square, piece) {
  if (activeBubble) clearTimeout(activeBubble.timeout);
  activeBubble = {
    square,
    phrase: PIECE_PHRASES[piece.color]?.[piece.type] || "To victory!",
    fading: false,
    timeout: setTimeout(() => {
      activeBubble.fading = true;
      renderBoard();
      activeBubble.timeout = setTimeout(() => {
        activeBubble = null;
        renderBoard();
      }, 300);
    }, 2000)
  };
}

function clearBubble() {
  if (activeBubble) {
    clearTimeout(activeBubble.timeout);
    activeBubble = null;
  }
}

// ==========================================
// UI ELEMENTS
// ==========================================
const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#statusText');
const turnBadge = document.querySelector('#turnBadge');
const moveListEl = document.querySelector('#moveList');
const fenBox = document.querySelector('#fenBox');
const moveCounter = document.querySelector('#moveCounter');

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

// Floating HUD controls
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
const downloadPgnBtn = document.querySelector('#downloadPgnBtn');
const copyFenBtn = document.querySelector('#copyFenBtn');
const loadFenBtn = document.querySelector('#loadFenBtn');
const playerColorEl = document.querySelector('#playerColor');
const engineStrengthEl = document.querySelector('#engineStrength');
const engineTimeEl = document.querySelector('#engineTime');

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
  for (const timer of visualTimers) {
    window.clearTimeout(timer);
  }
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

function renderBoard() {
  boardEl.innerHTML = '';

  const art = document.createElement('img');
  art.className = 'board-art';
  art.src = CONFIG.boardAsset;
  art.alt = 'Custom chess board';
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
      cell.appendChild(createPieceImage(piece, desiredState(square, piece)));
    }

    if (activeBubble && activeBubble.square === square) {
      const bubble = document.createElement('div');
      bubble.className = `speech-bubble ${activeBubble.fading ? 'fade-out' : ''}`;
      bubble.innerText = activeBubble.phrase;
      cell.appendChild(bubble);
    }

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

function updateStatus() {
  if (gameOver) return;

  const isWhite = chess.turn() === 'w';
  turnBadge.className = `status-indicator ${isWhite ? '' : 'black-turn'} ${engineBusy ? 'thinking' : ''}`;

  if (engineBusy) {
    statusEl.textContent = 'Stockfish is thinking…';
  } else {
    const turnName = isWhite ? 'White' : 'Black';
    statusEl.textContent = chess.isCheck()
      ? `${turnName} to move (Check)`
      : `${turnName} to move`;
  }
}

function renderMoveList() {
  const history = chess.history();
  moveCounter.textContent = String(history.length);
}

function syncUi() {
  renderBoard();
  renderMoveList();
  fenBox.value = chess.fen();
  updateStatus();

  const canUndo = chess.history().length > 0 && !engineBusy;
  const canClaim = !gameOver && isClaimableDraw();

  undoBtn.disabled = !canUndo;
  hudUndoBtn.style.opacity = canUndo ? '1' : '0.4';
  claimDrawBtn.disabled = !canClaim;
  resignBtn.disabled = gameOver;
}

function getLegalTargets(square) {
  try {
    return chess.moves({ square, verbose: true }).map(move => move.to);
  } catch {
    return [];
  }
}

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

function openPromotion(from, to) {
  pendingPromotion = { from, to };
  promotionChoices.innerHTML = '';

  for (const type of ['q', 'r', 'b', 'n']) {
    const button = document.createElement('button');
    button.className = 'promotion-choice';
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

function makeMove(from, to, promotion, source) {
  clearBubble();
  if (gameOver) return false;

  const movingPiece = chess.get(from);
  if (!movingPiece) return false;

  let capturedPiece = chess.get(to);
  let capturedSquare = capturedPiece ? to : null;

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

  // Play audio response
  if (chess.isCheck()) {
    sfx.play('check');
  } else if (capturedPiece) {
    sfx.play('capture');
  } else {
    sfx.play('move');
  }

  closePromotion();
  selectedSquare = null;
  legalTargets = [];

  stateOverrides.delete(from);
  stateOverrides.delete(to);
  if (capturedSquare) stateOverrides.delete(capturedSquare);

  prepareMoveVisual(from, to, capturedPiece, capturedSquare);
  const generation = visualGeneration;
  const stateDuration = capturedPiece
    ? CONFIG.attackStateDurationMs
    : CONFIG.moveStateDurationMs;

  if (capturedPiece && capturedSquare) {
    scheduleDefeatedRemoval(generation, CONFIG.defeatedAnimationMs + CONFIG.defeatedHoldMs);
  }

  if (isTerminalPosition()) {
    if (lastMoveState.defeatedSquare) {
      scheduleDefeatedRemoval(
        generation,
        CONFIG.defeatedAnimationMs + CONFIG.defeatedHoldMs,
      );
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
      playerWon ? 'Checkmate — You won the game!' : 'Checkmate — Stockfish wins.',
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
      statusEl.textContent = 'Engine ready (offline fallback).';
    });
}

function setPieceState(square, state) {
  if (!CONFIG.states.includes(state)) throw new Error(`Unknown state: ${state}`);
  if (!chess.get(square)) throw new Error(`No piece on ${square}`);

  stateOverrides.set(square, state);
  renderBoard();
}

function clearPieceState(square) {
  stateOverrides.delete(square);
  renderBoard();
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
    statusEl.textContent = 'Stockfish returned no move.';
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
    statusEl.textContent = 'Engine search failed.';
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

// ==========================================
// START MODAL & SELECTION HANDLERS
// ==========================================
sideSelectGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill-choice');
  if (!btn) return;
  sideSelectGroup.querySelectorAll('.pill-choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  playerColorEl.value = btn.dataset.color;
});

eloSelectGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill-choice');
  if (!btn) return;
  eloSelectGroup.querySelectorAll('.pill-choice').forEach(b => b.classList.remove('active'));
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

// Floating HUD controls
hudFlipBtn.addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  renderBoard();
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
  setPieceState,
  clearPieceState,
  clearAllPieceStates: () => { stateOverrides.clear(); renderBoard(); },
  newGame,
  getFen: () => chess.fen(),
  getPgn: () => chess.pgn({ maxWidth: 0 }),
};

syncUi();
