# Custom Chess GitHub Pages App

This project is deliberately built as a **static browser application**. GitHub Pages serves HTML/CSS/JavaScript; it does not execute Python or Pygame on the server. The included Python file is a **builder** that creates the deployable site.

The generated site is intentionally **board-only and mobile-first**: no visible header, menu, footer, side panel, move list, FEN controls, or settings. The board fills the viewport width and is centered on the screen. Your custom board SVG, upper/lower banner SVGs, custom piece SVGs, and optional BACKGROUND.png control the visual experience. Piece artwork is rendered at the builder-configured visual scale (see PIECE_SCALE in the Python config section). The existing game API remains available for scripted/custom behavior.

## Build

```bash
python build_chess_site.py
```

Or choose a folder:

```bash
python build_chess_site.py --output my-chess-site
```

The builder vendors the pinned browser dependencies into the output folder:

- `chess.js 1.4.0` for legal chess moves, FEN/PGN, check/checkmate, promotion, castling, en passant and draw-state handling.
- Stockfish `18.0.8` lite single-threaded WASM for the computer opponent.

The Stockfish lite single-threaded build is used because it does not require the cross-origin isolation headers needed by the multi-threaded build and is suitable for static hosting. 

## Important visual architecture

There is **no chessboard UI library and no default piece-font rendering**. The app draws its own 8×8 clickable grid over your board artwork, and every visible piece is an SVG path from `assets/pieces/`.

Replace:

- `assets/board.svg` — your complete 8×8 board artwork.
- `assets/upper.svg` — optional banner artwork filling the entire viewport-width area above the board.
- `assets/lower.svg` — optional banner artwork filling the entire viewport-width area below the board.
- `assets/BACKGROUND.png` — optional full-screen page background; it scales and centers automatically.
- `assets/pieces/standard/w-k.svg`, etc. — your normal piece art.
- `assets/pieces/moving/` — moving-state art.
- `assets/pieces/attacking/` — attacking/capture art.
- `assets/pieces/celebrate/` — win/celebration art.
- `assets/pieces/defeated/` — defeated/captured art.
- `assets/pieces/secret/` — secret/hidden-state art.

File format is:

`assets/pieces/<STATE>/<COLOR>-<PIECE>.svg`

where color is `w` or `b`, and piece is `p`, `n`, `b`, `r`, `q`, `k`.

## Animation state rules

The six requested states are built into the renderer:

- `standard`: ordinary resting piece.
- `moving`: piece that has just moved.
- `attacking`: piece that just captured.
- `celebrate`: winner's moving piece after checkmate.
- `defeated`: reserved defeat/capture visual state.
- `secret`: explicit custom state that you can trigger from JavaScript.

Each move applies its moving/attacking state for its animation duration, then returns to standard. Captured pieces use the defeated state, and that visual remains for an additional 0.7 seconds before disappearing. Checkmate celebration also returns to standard when its animation finishes. The renderer does not run a second move command or duplicate the piece movement. When a game ends by checkmate, a centered result card displays whether you won or lost and tells you to refresh the page to start a new game.

The AI chooses one of five response delays ranging from 1.000 to 2.700 seconds for every turn. Stockfish calculates during that visible thinking period, and an early result is held until the selected delay has elapsed.

## Secret state API

Open the browser console and use:

```js
ChessApp.setPieceState('e4', 'secret')
ChessApp.clearPieceState('e4')
ChessApp.clearAllPieceStates()
```

You can also control the game through `window.ChessApp` with `newGame()`, `getFen()`, `loadFen(fen)`, and `getPgn()`.

## Local testing

A simple static server avoids browser restrictions that can occur when opening ES modules directly from `file://`:

```bash
python -m http.server 8000 -d my-chess-site
```

Then open `http://localhost:8000/`.

## GitHub Pages

Commit the generated folder contents to your repository and enable GitHub Pages for that branch/folder. The app is static; no Python server is required after generation.

## Licensing notices

`chess.js` is BSD-2-Clause licensed. Stockfish/Stockfish.js is GPLv3 licensed. Keep the included notices and their upstream source links when redistributing the generated site.

Upstream:
- https://github.com/jhlywa/chess.js
- https://github.com/nmrugg/stockfish.js
