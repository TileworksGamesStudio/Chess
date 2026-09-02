import { Chess } from './vendor/chess.js';

const CONFIG = {
  boardAsset: './assets/board.svg',
  pieceRoot: './assets/pieces',
  states: ['standard', 'moving', 'attacking', 'celebrate', 'defeated', 'secret'],
  pieces: ['p', 'n', 'b', 'r', 'q', 'k'],
  colors: ['w', 'b'],
  orientation: 'w',
  playerColor: 'w',
  engineElo: 1200,
  engineMoveTime: 500,

  // The Python builder injects these values into the generated app.
  pieceScale: 1.2000,
  aiThinkingDelaysMs: [1000, 1425, 1850, 2275, 2700],
  moveStateDurationMs: 450,
  attackStateDurationMs: 450,
  celebrateStateDurationMs: 1100,
  defeatedAnimationMs: 450,
  defeatedHoldMs: 700,
};

// ==========================================
// SPEECH BUBBLE LOGIC INTEGRATION
// ==========================================
let activeBubble = null;

const PIECE_PHRASES = {
  w: {
    p: "Pawn. Your Custom Text Here.",
    n: "Knight. Your Custom Text Here.",
    b: "Bishop. Your Custom Text Here.",
    r: "Rook. Your Custom Text Here.",
    q: "Queen. Your Custom Text Here.",
    k: "King. Your Custom Text Here.",
  },
  b: {
    p: "Pawn. Your Custom Text Here.",
    n: "Knight. Your Custom Text Here.",
    b: "Bishop. Your Custom Text Here.",
    r: "Rook. Your Custom Text Here.",
    q: "Queen. Your Custom Text Here.",
    k: "King. Your Custom Text Here.",
  }
};

function showBubble(square, piece) {
  if (activeBubble) clearTimeout(activeBubble.timeout);
  activeBubble = {
    square,
    phrase: PIECE_PHRASES[piece.color]?.[piece.type] || "I'm a chess piece!",
    fading: false,
    timeout: setTimeout(() => {
      activeBubble.fading = true;
      renderBoard(); // Re-render triggers the fade out animation class
      activeBubble.timeout = setTimeout(() => {
        activeBubble = null;
        renderBoard();
      }, 300); // 300ms matches the fade-out CSS animation duration
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

const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#statusText');
const moveListEl = document.querySelector('#moveList');
const fenBox = document.querySelector('#fenBox');
const moveCounter = document.querySelector('#moveCounter');
const promotionModal = document.querySelector('#promotionModal');
const promotionChoices = document.querySelector('#promotionChoices');
const gameResultModal = document.querySelector('#gameResultModal');
const gameResultTitle = document.querySelector('#gameResultTitle');
const gameResultMessage = document.querySelector('#gameResultMessage');
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

function currentPiece(square) {
  const piece = chess.get(square);
  return piece ? { ...piece, square } : null;
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

    // Attach active speech bubble to the correct square during the render cycle
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

  const turnName = chess.turn() === 'w' ? 'White' : 'Black';
  statusEl.textContent = chess.isCheck()
    ? `${turnName} to move — check.`
    : `${turnName} to move.`;
}

function renderMoveList() {
  const history = chess.history();
  moveListEl.innerHTML = '';

  for (let i = 0; i < history.length; i += 2) {
    const li = document.createElement('li');
    li.className = 'move-pair';

    const number = document.createElement('span');
    number.textContent = `${Math.floor(i / 2) + 1}.`;

    const white = document.createElement('span');
    white.textContent = history[i] ?? '';

    const black = document.createElement('span');
    black.textContent = history[i + 1] ?? '';

    li.append(number, white, black);
    moveListEl.appendChild(li);
  }

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

  // Trigger or clear the speech bubble based on user click
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
    renderBoard(); // Ensure re-render always happens so the newly added bubble renders
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

function showCheckmateResult(winnerColor) {
  const playerWon = winnerColor === playerColor;
  gameResultTitle.textContent = 'Checkmate';
  gameResultMessage.textContent = playerWon ? 'You win.' : 'You lost.';
  gameResultModal.classList.remove('hidden');
  gameResultModal.setAttribute('aria-hidden', 'false');
}

function resetVisualState() {
  clearVisualTimers();
  clearBubble(); // Clear lingering bubbles on reset
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
  clearBubble(); // Ensure pieces don't speak mid-move
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

    statusEl.textContent = `Checkmate — ${winner === 'w' ? 'White' : 'Black'} wins.`;
    stopEngine();
    showCheckmateResult(winner);
    return true;
  }

  if (chess.isStalemate()) {
    gameOver = true;
    statusEl.textContent = 'Draw — stalemate.';
    stopEngine();
    syncUi();
    return true;
  }

  if (typeof chess.isInsufficientMaterial === 'function' && chess.isInsufficientMaterial()) {
    gameOver = true;
    statusEl.textContent = 'Draw — insufficient material.';
    stopEngine();
    syncUi();
    return true;
  }

  const halfmoveClock = Number(chess.fen().split(/\s+/)[4] || 0);
  if (halfmoveClock >= 150) {
    gameOver = true;
    statusEl.textContent = 'Draw — 75-move rule.';
    stopEngine();
    syncUi();
    return true;
  }

  if (repetitionCountForCurrentPosition() >= 5) {
    gameOver = true;
    statusEl.textContent = 'Draw — fivefold repetition.';
    stopEngine();
    syncUi();
    return true;
  }

  return false;
}

function claimDraw() {
  if (gameOver || !isClaimableDraw()) return;

  gameOver = true;
  closePromotion();
  stopEngine();

  if (isFiftyMoveClaimable() && isThreefoldClaimable()) {
    statusEl.textContent = 'Draw claimed — 50-move rule / threefold repetition.';
  } else if (isFiftyMoveClaimable()) {
    statusEl.textContent = 'Draw claimed — 50-move rule.';
  } else {
    statusEl.textContent = 'Draw claimed — threefold repetition.';
  }

  syncUi();
}

function resign() {
  if (gameOver) return;

  gameOver = true;
  closePromotion();
  stopEngine();

  const winner = playerColor === 'w' ? 'Black' : 'White';
  statusEl.textContent = `${playerColor === 'w' ? 'White' : 'Black'} resigned — ${winner} wins.`;
  syncUi();
}

function undo() {
  if (engineBusy || chess.history().length === 0) return;

  stopEngine();
  closePromotion();
  gameOver = false;

  const undone = chess.undo();
  if (!undone) return;

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

function exportPgn() {
  const pgn = chess.pgn({ maxWidth: 0 });
  const blob = new Blob([pgn], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'game.pgn';
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function copyFen() {
  const fen = chess.fen();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fen);
      statusEl.textContent = 'FEN copied.';
      return;
    }
  } catch {
  }

  const helper = document.createElement('textarea');
  helper.value = fen;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.select();

  try {
    document.execCommand('copy');
    statusEl.textContent = 'FEN copied.';
  } catch {
    statusEl.textContent = 'Copy failed.';
  } finally {
    helper.remove();
  }
}

function loadFen() {
  const fen = fenBox.value.trim();
  if (!fen) return;

  try {
    const next = new Chess(fen);

    stopEngine();
    closePromotion();
    hideGameResult();

    chess = next;
    gameStartFen = chess.fen();
    gameOver = false;
    selectedSquare = null;
    legalTargets = [];
    stateOverrides.clear();
    resetVisualState();

    syncUi();

    if (chess.turn() !== playerColor) {
      requestEngineMove();
    }
  } catch (error) {
    statusEl.textContent = error?.message || 'Invalid FEN.';
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
  CONFIG.engineElo = Number(engineStrengthEl.value);
  CONFIG.engineMoveTime = Number(engineTimeEl.value);

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
      statusEl.textContent = 'Stockfish failed to load. Check the engine files.';
    });
}

function setPieceState(square, state) {
  if (!CONFIG.states.includes(state)) {
    throw new Error(`Unknown state: ${state}`);
  }
  if (!chess.get(square)) {
    throw new Error(`No piece on ${square}`);
  }

  stateOverrides.set(square, state);
  renderBoard();
}

function clearPieceState(square) {
  stateOverrides.delete(square);
  renderBoard();
}

function getGameApi() {
  return {
    get chess() {
      return chess;
    },
    setPieceState,
    clearPieceState,
    clearAllPieceStates() {
      stateOverrides.clear();
      renderBoard();
    },
    newGame,
    loadFen(fen) {
      fenBox.value = fen;
      loadFen();
    },
    getFen: () => chess.fen(),
    getPgn: () => chess.pgn({ maxWidth: 0 }),
  };
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
    try {
      engine.terminate();
    } catch {
    }
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
    try {
      engine.terminate();
    } catch {
    }
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
      statusEl.textContent = 'Stockfish failed to load. Check assets/engine files.';
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
    try {
      engine.postMessage('stop');
    } catch {
    }
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

  if (
    token === null ||
    gameOver ||
    token !== engineSearchToken ||
    chess.turn() === playerColor
  ) {
    return;
  }

  if (!best || best === '(none)' || best.length < 4) {
    engineBusy = false;
    activeSearchToken = null;
    clearEngineDelayTimer();
    statusEl.textContent = 'Stockfish returned no legal move.';
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
      statusEl.textContent = 'Stockfish returned an invalid move.';
      syncUi();
    }
  }
}

function randomAiThinkingDelay() {
  const choices = CONFIG.aiThinkingDelaysMs;
  return choices[Math.floor(Math.random() * choices.length)];
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
    statusEl.textContent = 'Stockfish failed to load. Check the engine files.';
    syncUi();
    return;
  }

  if (!engine || !engineReady || gameOver || chess.turn() === playerColor) return;

  const delayMs = randomAiThinkingDelay();
  const token = ++engineSearchToken;
  activeSearchToken = null;
  engineBusy = true;

  statusEl.textContent = 'Stockfish is thinking…';
  syncUi();

  try {
    engine.postMessage('stop');
    engine.postMessage('isready');
    await waitForReadyOk();

    if (
      token !== engineSearchToken ||
      gameOver ||
      chess.turn() === playerColor ||
      !engine
    ) {
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
    } else {
      statusEl.textContent = 'Stockfish is thinking…';
    }
  } catch (error) {
    if (activeSearchToken === token) {
      activeSearchToken = null;
    }
    engineBusy = false;
    clearEngineDelayTimer();
    statusEl.textContent = error?.message || 'Stockfish failed during search.';
    syncUi();
  }
}

window.ChessApp = getGameApi();

newGameBtn.addEventListener('click', newGame);
flipBtn.addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  renderBoard();
});
undoBtn.addEventListener('click', undo);
claimDrawBtn.addEventListener('click', claimDraw);
resignBtn.addEventListener('click', resign);
downloadPgnBtn.addEventListener('click', exportPgn);
copyFenBtn.addEventListener('click', copyFen);
loadFenBtn.addEventListener('click', loadFen);

engineStrengthEl.addEventListener('change', event => {
  CONFIG.engineElo = Number(event.target.value);
});

engineTimeEl.addEventListener('change', event => {
  CONFIG.engineMoveTime = Number(event.target.value);
});

playerColorEl.addEventListener('change', newGame);

promotionModal.addEventListener('click', event => {
  if (event.target === promotionModal) closePromotion();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && pendingPromotion) {
    closePromotion();
    renderBoard();
  }
});

syncUi();

initEngine()
  .then(() => {
    if (!gameOver && chess.turn() !== playerColor) {
      requestEngineMove();
    }
  })
  .catch(() => {
    statusEl.textContent = 'Stockfish unavailable — check the generated engine files.';
  });
