import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import './index.css';

// ============================================================
//  PIECE UNICODE MAP
// ============================================================
const PIECE_UNICODE = {
  wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
  bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
};

// ============================================================
//  CUSTOM CHESSBOARD — click-to-move
// ============================================================
function CustomBoard({ game, selectedSquare, legalMoves, onSquareClick }) {
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
              pieceChar = PIECE_UNICODE[`${piece.color}${piece.type}`] || '';
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
// Captured pieces are tracked in state (not derived from history)
// because creating Chess(fen) copies loses move history.

// Sort order for display: q, r, b, n, p
const PIECE_ORDER = { q: 0, r: 1, b: 2, n: 3, p: 4 };

function CapturedPieces({ captured, color, label }) {
  const sorted = [...captured].sort((a, b) => (PIECE_ORDER[a] ?? 9) - (PIECE_ORDER[b] ?? 9));
  return (
    <div className={`captured-row ${color}`}>
      <span className="captured-label">{label}</span>
      <div className="captured-pieces">
        {sorted.length === 0 && <span className="captured-empty">—</span>}
        {sorted.map((type, i) => (
          <span key={i} className={`captured-piece ${color === 'black' ? 'black-piece' : 'white-piece'}`}>
            {PIECE_UNICODE[`${color === 'black' ? 'b' : 'w'}${type}`]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  AI LOG (NEURAL FEED)
// ============================================================
function AILog({ logs, status }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="side-panel left-panel">
      <h2 className="neon-text panel-title">⟨ NEURAL FEED ⟩</h2>
      <div className="status-row">
        <span className="label">STATUS:</span>
        <span className="neon-text-pink blink">{status}</span>
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
function Metrics({ moveCount, gameStatus }) {
  const winProb = Math.max(5, 50 - moveCount * 2 + Math.floor(Math.random() * 10));
  const resources = Math.min(99, 30 + moveCount * 3);
  const latency = 8 + Math.floor(Math.random() * 20);

  return (
    <div className="side-panel right-panel">
      <h2 className="neon-text panel-title">⟨ METRICS ⟩</h2>
      <div className="metric-row"><span>WIN PROBABILITY</span><span className="neon-text-pink">{winProb}%</span></div>
      <div className="progress-bar"><div className="progress-fill pink" style={{ width: `${winProb}%` }} /></div>
      <div className="metric-row"><span>RESOURCES</span><span className="neon-text">{resources}%</span></div>
      <div className="progress-bar"><div className="progress-fill cyan" style={{ width: `${resources}%` }} /></div>
      <div className="metric-row small"><span>LATENCY</span><span>{latency}ms</span></div>
      <div className="metric-row small"><span>MOVES</span><span>{moveCount}</span></div>
      <div className="metric-row small"><span>ENGINE</span><span className="neon-text">ACTIVE</span></div>
      {gameStatus && <div className="game-over-badge"><span className="neon-text-pink">{gameStatus}</span></div>}
    </div>
  );
}

// ============================================================
//  MAIN APP
// ============================================================
export default function App() {
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

  useEffect(() => {
    const t1 = setTimeout(() => addLog('Neural Engine v9.2 online.'), 600);
    const t2 = setTimeout(() => addLog('Click a piece to begin.'), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [addLog]);

  // ---- CLICK HANDLER ----
  function handleSquareClick(sq) {
    if (gameStatus) return; // game is over

    const piece = game.get(sq);

    // If a square is already selected
    if (selectedSquare) {
      // Clicking the same square = deselect
      if (sq === selectedSquare) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // If clicking one of the legal target squares → make the move
      if (legalMoves.includes(sq)) {
        makeHumanMove(selectedSquare, sq);
        return;
      }

      // Clicking another own piece → reselect
      if (piece && piece.color === 'w') {
        selectPiece(sq);
        return;
      }

      // Otherwise deselect
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // No square selected yet — select a white piece
    if (piece && piece.color === 'w') {
      selectPiece(sq);
    }
  }

  function selectPiece(sq) {
    setSelectedSquare(sq);
    const moves = game.moves({ square: sq, verbose: true });
    setLegalMoves(moves.map(m => m.to));
  }

  function makeHumanMove(from, to) {
    const gameCopy = new Chess(game.fen());

    // Determine if promotion
    const piece = gameCopy.get(from);
    const isPromotion =
      piece && piece.type === 'p' &&
      ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'));

    let move;
    try {
      move = gameCopy.move({ from, to, promotion: isPromotion ? 'q' : undefined });
    } catch {
      addLog('Invalid move.', 'error');
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Track capture
    if (move.captured) {
      setCapturedPieces(prev => ({
        ...prev,
        b: [...prev.b, move.captured],  // white captured a black piece
      }));
    }

    setGame(gameCopy);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(prev => prev + 1);
    setStatus('PROCESSING');
    addLog(`Human played ${move.san}.`);

    if (gameCopy.isGameOver()) {
      handleGameOver(gameCopy);
      return;
    }

    // AI responds
    setTimeout(() => makeAIMove(gameCopy), 600 + Math.random() * 800);
  }

  function makeAIMove(currentGame) {
    if (currentGame.isGameOver()) { handleGameOver(currentGame); return; }

    const moves = currentGame.moves();
    if (!moves.length) return;

    const aiMove = moves[Math.floor(Math.random() * moves.length)];
    let aiMoveResult;
    try { aiMoveResult = currentGame.move(aiMove); } catch { addLog('AI engine error.', 'error'); return; }

    // Track capture
    if (aiMoveResult.captured) {
      setCapturedPieces(prev => ({
        ...prev,
        w: [...prev.w, aiMoveResult.captured],  // AI captured a white piece
      }));
    }

    const newGame = new Chess(currentGame.fen());
    setGame(newGame);
    setMoveCount(prev => prev + 1);
    setStatus('WAITING');
    addLog(`AI responds: ${aiMove}`, 'info');
    addLog('Probability matrix recalculated.', 'info');

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
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(0);
    setGameStatus(null);
    setStatus('IDLE');
    setCapturedPieces({ w: [], b: [] });
    setLogs([{ message: 'System reset. Click a piece to begin.', type: 'info' }]);
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="title">
          <span className="neon-text">AGE</span>{' '}
          <span className="dim">OF</span>{' '}
          <span className="neon-text-pink">AI</span>
        </h1>
        <p className="subtitle">NEURAL CHESS ENGINE v9.2</p>
      </header>

      <div className="game-container">
        <AILog logs={logs} status={status} />

        <div className="board-wrapper">
          <CapturedPieces captured={capturedPieces.b} color="black" label="AI LOSSES" />
          <CustomBoard
            game={game}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            onSquareClick={handleSquareClick}
          />
          <CapturedPieces captured={capturedPieces.w} color="white" label="YOUR LOSSES" />
          <div className="board-controls">
            <button className="reset-btn" onClick={resetGame}>↻ RESET NEURAL MATCH</button>
          </div>
        </div>

        <Metrics moveCount={moveCount} gameStatus={gameStatus} />
      </div>

      <footer className="app-footer">
        <span className="dim">// SYSTEM ACTIVE — ENCRYPTED CHANNEL — MOVE DATA LOGGED //</span>
      </footer>
    </div>
  );
}
