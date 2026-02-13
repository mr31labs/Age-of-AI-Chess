import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { THEMES, DEFAULT_THEME, THEME_IDS } from './themes.js';
import './index.css';

// ============================================================
//  THEME SELECTOR
// ============================================================
function ThemeSelector({ currentTheme, onSelect }) {
  return (
    <div className="theme-selector">
      {THEME_IDS.map(id => {
        const t = THEMES[id];
        const active = id === currentTheme;
        return (
          <button
            key={id}
            className={`theme-card ${active ? 'active' : ''}`}
            onClick={() => onSelect(id)}
          >
            <span className="theme-icon">{t.icon}</span>
            <span className="theme-name">{t.name}</span>
            <span className="theme-desc">{t.description}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
//  CUSTOM CHESSBOARD — click-to-move
// ============================================================
function CustomBoard({ game, selectedSquare, legalMoves, onSquareClick, pieceMap }) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className="board-outer">
      <div className="custom-board">
        {ranks.map(rank =>
          files.map(file => {
            const sq = `${file}${rank}`;
            const piece = game.get(sq);
            const isLight = (files.indexOf(file) + rank) % 2 !== 0;
            const isSelected = selectedSquare === sq;
            const isLegal = legalMoves.includes(sq);
            const isCapture = isLegal && piece;

            let pieceChar = '';
            if (piece) {
              pieceChar = pieceMap[`${piece.color}${piece.type}`] || '';
            }

            return (
              <div
                key={sq}
                className={`square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLegal ? 'legal' : ''}`}
                onClick={() => onSquareClick(sq)}
                data-square={sq}
              >
                {pieceChar && (
                  <span className={`piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`}>
                    {pieceChar}
                  </span>
                )}
                {isLegal && !isCapture && <div className="legal-dot" />}
                {isCapture && <div className="legal-capture" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================
//  CAPTURED PIECES DISPLAY
// ============================================================
const PIECE_ORDER = { q: 0, r: 1, b: 2, n: 3, p: 4 };

function CapturedPieces({ captured, color, label, pieceMap }) {
  const sorted = [...captured].sort((a, b) => (PIECE_ORDER[a] ?? 9) - (PIECE_ORDER[b] ?? 9));
  const prefix = color === 'black' ? 'b' : 'w';
  return (
    <div className={`captured-row ${color}`}>
      <span className="captured-label">{label}</span>
      <div className="captured-pieces">
        {sorted.length === 0 && <span className="captured-empty">—</span>}
        {sorted.map((type, i) => (
          <span key={i} className={`captured-piece ${color === 'black' ? 'black-piece' : 'white-piece'}`}>
            {pieceMap[`${prefix}${type}`]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  AI LOG (NEURAL FEED / QUEST LOG / FATE CHRONICLE)
// ============================================================
function AILog({ logs, status, labels }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="side-panel left-panel">
      <h2 className="accent-1-text panel-title">{labels.logTitle}</h2>
      <div className="status-row">
        <span className="label">{labels.statusLabel}</span>
        <span className="accent-2-text blink">{status}</span>
      </div>
      <div className="log-container">
        {logs.map((l, i) => (
          <div key={i} className={`log-entry ${l.type}`}>
            <span className="log-prefix">&gt;</span>
            <span>{l.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ============================================================
//  METRICS PANEL
// ============================================================
function Metrics({ moveCount, gameStatus, labels }) {
  const s = labels.statLabels;
  const winProb = Math.max(5, 50 - moveCount * 2 + Math.floor(Math.random() * 10));
  const resources = Math.min(99, 30 + moveCount * 3);
  const latency = 8 + Math.floor(Math.random() * 20);

  return (
    <div className="side-panel right-panel">
      <h2 className="accent-1-text panel-title">{labels.metricsTitle}</h2>
      <div className="metric-row"><span>{s.prob}</span><span className="accent-2-text">{winProb}%</span></div>
      <div className="progress-bar"><div className="progress-fill accent-2-bg" style={{ width: `${winProb}%` }} /></div>
      <div className="metric-row"><span>{s.resources}</span><span className="accent-1-text">{resources}%</span></div>
      <div className="progress-bar"><div className="progress-fill accent-1-bg" style={{ width: `${resources}%` }} /></div>
      <div className="metric-row small"><span>{s.latency}</span><span>{latency}ms</span></div>
      <div className="metric-row small"><span>{s.moves}</span><span>{moveCount}</span></div>
      <div className="metric-row small"><span>{s.engine}</span><span className="accent-1-text">{s.engineVal}</span></div>
      {gameStatus && <div className="game-over-badge"><span className="accent-2-text">{gameStatus}</span></div>}
    </div>
  );
}

// ============================================================
//  MAIN APP
// ============================================================
export default function App() {
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  const theme = THEMES[themeId];

  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [status, setStatus] = useState('IDLE');
  const [moveCount, setMoveCount] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [logs, setLogs] = useState([{ message: 'System initialized.', type: 'info' }]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev.slice(-24), { message: msg, type }]);
  }, []);

  // ---- APPLY THEME CSS VARS ----
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));

    // Load fonts
    const fontUrl = `https://fonts.googleapis.com/css2?${theme.fonts.map(f => `family=${f}`).join('&')}&display=swap`;
    let link = document.getElementById('theme-font-link');
    if (!link) {
      link = document.createElement('link');
      link.id = 'theme-font-link';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = fontUrl;
  }, [theme]);

  // ---- INIT MESSAGES ON THEME CHANGE ----
  useEffect(() => {
    setLogs([{ message: 'System initialized.', type: 'info' }]);
    const timers = theme.initMessages.map((msg, i) =>
      setTimeout(() => addLog(msg), 600 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [themeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- CLICK HANDLER ----
  function handleSquareClick(sq) {
    if (gameStatus) return;
    const piece = game.get(sq);

    if (selectedSquare) {
      if (sq === selectedSquare) { setSelectedSquare(null); setLegalMoves([]); return; }
      if (legalMoves.includes(sq)) { makeHumanMove(selectedSquare, sq); return; }
      if (piece && piece.color === 'w') { selectPiece(sq); return; }
      setSelectedSquare(null); setLegalMoves([]); return;
    }

    if (piece && piece.color === 'w') selectPiece(sq);
  }

  function selectPiece(sq) {
    setSelectedSquare(sq);
    const moves = game.moves({ square: sq, verbose: true });
    setLegalMoves(moves.map(m => m.to));
  }

  function makeHumanMove(from, to) {
    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(from);
    const isPromotion = piece && piece.type === 'p' &&
      ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'));

    let move;
    try {
      move = gameCopy.move({ from, to, promotion: isPromotion ? 'q' : undefined });
    } catch {
      addLog('Invalid move.', 'error');
      setSelectedSquare(null); setLegalMoves([]);
      return;
    }

    if (move.captured) {
      setCapturedPieces(prev => ({ ...prev, b: [...prev.b, move.captured] }));
    }

    setGame(gameCopy);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(prev => prev + 1);
    setStatus('PROCESSING');
    addLog(`Human played ${move.san}.`);

    if (gameCopy.isGameOver()) { handleGameOver(gameCopy); return; }
    setTimeout(() => makeAIMove(gameCopy), 600 + Math.random() * 800);
  }

  function makeAIMove(currentGame) {
    if (currentGame.isGameOver()) { handleGameOver(currentGame); return; }
    const moves = currentGame.moves();
    if (!moves.length) return;

    const aiMove = moves[Math.floor(Math.random() * moves.length)];
    let result;
    try { result = currentGame.move(aiMove); } catch { addLog('AI engine error.', 'error'); return; }

    if (result.captured) {
      setCapturedPieces(prev => ({ ...prev, w: [...prev.w, result.captured] }));
    }

    const newGame = new Chess(currentGame.fen());
    setGame(newGame);
    setMoveCount(prev => prev + 1);
    setStatus('WAITING');
    addLog(`AI responds: ${aiMove}`, 'info');

    // Theme-specific flavor text
    const flavor = theme.flavorText[Math.floor(Math.random() * theme.flavorText.length)];
    addLog(flavor, 'info');

    if (newGame.isGameOver()) handleGameOver(newGame);
  }

  function handleGameOver(g) {
    if (g.isCheckmate()) {
      const w = g.turn() === 'w' ? 'AI' : 'HUMAN';
      setGameStatus(`CHECKMATE — ${w} WINS`);
      addLog(`Checkmate. ${w} wins.`, 'warning');
    } else {
      setGameStatus('DRAW');
      addLog('Draw.', 'warning');
    }
    setStatus('TERMINATED');
  }

  function resetGame() {
    setGame(new Chess());
    setSelectedSquare(null); setLegalMoves([]);
    setMoveCount(0); setGameStatus(null);
    setStatus('IDLE');
    setCapturedPieces({ w: [], b: [] });
    setLogs([{ message: 'System reset.', type: 'info' }]);
    theme.initMessages.forEach((msg, i) =>
      setTimeout(() => addLog(msg), 400 + i * 500)
    );
  }

  const L = theme.labels;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="title">
          <span className="accent-1-text">{L.title[0]}</span>{' '}
          <span className="dim">{L.title[1]}</span>{' '}
          <span className="accent-2-text">{L.title[2]}</span>
        </h1>
        <p className="subtitle">{L.subtitle}</p>
      </header>

      <ThemeSelector currentTheme={themeId} onSelect={setThemeId} />

      <div className="game-container">
        <AILog logs={logs} status={status} labels={L} />

        <div className="board-wrapper">
          <CapturedPieces captured={capturedPieces.b} color="black" label={L.capturedTop} pieceMap={theme.pieceMap} />
          <CustomBoard
            game={game}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            onSquareClick={handleSquareClick}
            pieceMap={theme.pieceMap}
          />
          <CapturedPieces captured={capturedPieces.w} color="white" label={L.capturedBottom} pieceMap={theme.pieceMap} />
          <div className="board-controls">
            <button className="reset-btn" onClick={resetGame}>{L.resetButton}</button>
          </div>
        </div>

        <Metrics moveCount={moveCount} gameStatus={gameStatus} labels={L} />
      </div>

      <footer className="app-footer">
        <span className="dim">{L.footer}</span>
      </footer>
    </div>
  );
}
