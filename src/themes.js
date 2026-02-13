// ============================================================
//  THEME DEFINITIONS
//  Each theme fully customizes the visual and textual experience.
// ============================================================

export const THEMES = {
    cyberpunk: {
        id: 'cyberpunk',
        name: 'CYBERPUNK',
        icon: '⚡',
        description: 'Neon-lit hacker aesthetic',

        cssVars: {
            '--bg-deep': '#060610',
            '--bg-panel': 'rgba(12, 12, 24, 0.85)',
            '--accent-1': '#00f3ff',
            '--accent-2': '#ff0055',
            '--accent-1-dim': 'rgba(0, 243, 255, 0.3)',
            '--accent-2-dim': 'rgba(255, 0, 85, 0.3)',
            '--text-primary': '#d4d4d8',
            '--text-dim': '#6b7280',
            '--border-glow': 'rgba(0, 243, 255, 0.25)',
            '--font-display': "'Orbitron', sans-serif",
            '--font-body': "'Share Tech Mono', monospace",
            '--sq-light': 'rgba(96, 165, 250, 0.55)',
            '--sq-dark': 'rgba(30, 58, 138, 0.75)',
            '--sq-selected': 'rgba(0, 243, 255, 0.35)',
            '--board-shadow': '0 0 30px rgba(0,243,255,0.2), 0 0 60px rgba(0,243,255,0.08)',
            '--bg-gradient-1': 'rgba(0, 243, 255, 0.08)',
            '--bg-gradient-2': 'rgba(255, 0, 85, 0.06)',
            '--grid-color': 'rgba(0, 243, 255, 0.04)',
        },

        fonts: [
            'Share+Tech+Mono',
            'Orbitron:wght@400;700;900',
        ],

        pieceMap: {
            wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
            bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
        },

        labels: {
            title: ['AGE', 'OF', 'AI'],
            subtitle: 'NEURAL CHESS ENGINE v9.2',
            logTitle: '⟨ NEURAL FEED ⟩',
            metricsTitle: '⟨ METRICS ⟩',
            statusLabel: 'STATUS:',
            capturedTop: 'AI LOSSES',
            capturedBottom: 'YOUR LOSSES',
            resetButton: '↻ RESET NEURAL MATCH',
            footer: '// SYSTEM ACTIVE — ENCRYPTED CHANNEL — MOVE DATA LOGGED //',
            statLabels: { prob: 'WIN PROBABILITY', resources: 'RESOURCES', latency: 'LATENCY', moves: 'MOVES', engine: 'ENGINE', engineVal: 'ACTIVE' },
        },

        flavorText: [
            'Probability matrix recalculated.',
            'Neural pathways optimized.',
            'Scanning threat vectors...',
            'Quantum evaluation complete.',
            'Deploying counter-strategy.',
            'Firewall integrity stable.',
            'Pattern recognized. Adapting.',
            'Memory banks updated.',
        ],

        initMessages: [
            'Neural Engine v9.2 online.',
            'Click a piece to begin.',
        ],
    },

    dnd: {
        id: 'dnd',
        name: 'D&D',
        icon: '🐉',
        description: 'Realm of the Dragon',

        cssVars: {
            '--bg-deep': '#1a1510',
            '--bg-panel': 'rgba(30, 24, 16, 0.9)',
            '--accent-1': '#f59e0b',
            '--accent-2': '#dc2626',
            '--accent-1-dim': 'rgba(245, 158, 11, 0.3)',
            '--accent-2-dim': 'rgba(220, 38, 38, 0.3)',
            '--text-primary': '#e8dcc8',
            '--text-dim': '#8a7a62',
            '--border-glow': 'rgba(245, 158, 11, 0.3)',
            '--font-display': "'Cinzel', serif",
            '--font-body': "'IM Fell English', serif",
            '--sq-light': 'rgba(194, 168, 125, 0.65)',
            '--sq-dark': 'rgba(61, 43, 31, 0.85)',
            '--sq-selected': 'rgba(245, 158, 11, 0.4)',
            '--board-shadow': '0 0 30px rgba(245,158,11,0.15), 0 0 60px rgba(245,158,11,0.06)',
            '--bg-gradient-1': 'rgba(245, 158, 11, 0.06)',
            '--bg-gradient-2': 'rgba(220, 38, 38, 0.04)',
            '--grid-color': 'rgba(245, 158, 11, 0.02)',
        },

        fonts: [
            'Cinzel:wght@400;700;900',
            'IM+Fell+English',
        ],

        pieceMap: {
            wp: '⚔', wn: '🐴', wb: '🧝', wr: '🏰', wq: '🧙', wk: '👑',
            bp: '💀', bn: '🐲', bb: '🦇', br: '🗼', bq: '🧟', bk: '👿',
        },

        labels: {
            title: ['REALM', 'OF THE', 'DRAGON'],
            subtitle: 'A GAME OF STRATEGY & FATE',
            logTitle: '📜 Quest Log',
            metricsTitle: '⚔ Character Stats',
            statusLabel: 'QUEST:',
            capturedTop: 'VANQUISHED FOES',
            capturedBottom: 'FALLEN ALLIES',
            resetButton: '⚔ NEW QUEST',
            footer: '— The dice have been cast. May fortune favor the bold. —',
            statLabels: { prob: 'MORALE', resources: 'MANA', latency: 'INITIATIVE', moves: 'TURNS', engine: 'DUNGEON MASTER', engineVal: 'WATCHING' },
        },

        flavorText: [
            'The Dragon contemplates its next move.',
            'Ancient runes shimmer across the board.',
            'A spectral wind stirs the tavern...',
            'The Dungeon Master smiles grimly.',
            'Fate weaves a new thread.',
            'The oracle whispers a warning.',
            'A critical roll determines the outcome.',
            'The adventurer steels their resolve.',
        ],

        initMessages: [
            'The Dungeon Master awaits your challenge.',
            'Choose your champion wisely.',
        ],
    },

    daggerheart: {
        id: 'daggerheart',
        name: 'DAGGERHEART',
        icon: '🗡',
        description: 'The Twilight Realm',

        cssVars: {
            '--bg-deep': '#0f0a1e',
            '--bg-panel': 'rgba(18, 12, 32, 0.88)',
            '--accent-1': '#a78bfa',
            '--accent-2': '#10b981',
            '--accent-1-dim': 'rgba(167, 139, 250, 0.3)',
            '--accent-2-dim': 'rgba(16, 185, 129, 0.3)',
            '--text-primary': '#e0d8ef',
            '--text-dim': '#7c6f99',
            '--border-glow': 'rgba(167, 139, 250, 0.25)',
            '--font-display': "'Uncial Antiqua', cursive",
            '--font-body': "'IM Fell English', serif",
            '--sq-light': 'rgba(109, 74, 141, 0.5)',
            '--sq-dark': 'rgba(30, 16, 53, 0.8)',
            '--sq-selected': 'rgba(167, 139, 250, 0.4)',
            '--board-shadow': '0 0 30px rgba(167,139,250,0.2), 0 0 60px rgba(16,185,129,0.08)',
            '--bg-gradient-1': 'rgba(167, 139, 250, 0.06)',
            '--bg-gradient-2': 'rgba(16, 185, 129, 0.05)',
            '--grid-color': 'rgba(167, 139, 250, 0.03)',
        },

        fonts: [
            'Uncial+Antiqua',
            'IM+Fell+English',
        ],

        pieceMap: {
            wp: '◆', wn: '♞', wb: '✦', wr: '▣', wq: '❖', wk: '♛',
            bp: '◇', bn: '♘', bb: '✧', br: '▢', bq: '❉', bk: '♕',
        },

        labels: {
            title: ['DAGGER', 'OF', 'HEART'],
            subtitle: 'THE TWILIGHT REALM BECKONS',
            logTitle: '🌙 Fate Chronicle',
            metricsTitle: '✨ Omens',
            statusLabel: 'FATE:',
            capturedTop: 'SPIRITS CLAIMED',
            capturedBottom: 'SPIRITS LOST',
            resetButton: '🗡 NEW DESTINY',
            footer: '— Between light and shadow, the game endures. —',
            statLabels: { prob: 'HOPE', resources: 'ESSENCE', latency: 'RESONANCE', moves: 'CYCLES', engine: 'THE WEAVE', engineVal: 'ALIVE' },
        },

        flavorText: [
            'The twilight stirs with ancient power.',
            'Threads of fate realign.',
            'A rune pulses beneath the board.',
            'The spirits murmur their counsel.',
            'Destiny shifts like moonlight on water.',
            'The Weave tightens around both players.',
            'An omen forms in the shadows.',
            'The dagger trembles in its sheath.',
        ],

        initMessages: [
            'The Weave awakens.',
            'Touch a piece to alter fate.',
        ],
    },
};

export const THEME_IDS = Object.keys(THEMES);
export const DEFAULT_THEME = 'cyberpunk';
