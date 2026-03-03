import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import MatchForm from './components/MatchForm';
import MatchHistory from './components/MatchHistory';
import PlayerForm from './components/PlayerForm';

const INITIAL_PLAYERS = [
  { id: 1, name: 'Ewerton', avatar: '🏓', photo: null },
  { id: 2, name: 'Rodrigo', avatar: '🔥', photo: null },
  { id: 3, name: 'Filipe', avatar: '⚡', photo: null },
  { id: 4, name: 'Junior', avatar: '🎯', photo: null },
  { id: 5, name: 'Sávio', avatar: '🤴', photo: null },
];

const App = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('tm_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('tm_matches');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tm_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('tm_matches', JSON.stringify(matches));
  }, [matches]);

  const addPlayer = (newPlayer) => {
    const player = { ...newPlayer, id: Date.now() };
    setPlayers([...players, player]);
  };

  const deletePlayer = (id) => {
    if (window.confirm('Excluir este jogador?')) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const addMatch = (match) => {
    const newMatch = {
      ...match,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setMatches([newMatch, ...matches]);
    setIsMatchFormOpen(false);
  };

  const competitionPeriod = useMemo(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const startDay = day <= 15 ? 1 : 16;
    const endDay = day <= 15 ? 15 : new Date(year, month + 1, 0).getDate();

    const formatDate = (d) => d.toString().padStart(2, '0') + '/' + (month + 1).toString().padStart(2, '0');

    return {
      start: formatDate(startDay),
      end: formatDate(endDay),
      isEnding: (endDay - day) <= 2 && (endDay - day) >= 0
    };
  }, []);

  return (
    <div className="min-h-screen text-slate-100 font-sans max-w-md mx-auto relative pb-24">
      {/* Header Section */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-4 px-6 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-40"
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-black italic tracking-tighter text-white">
            QUINZENAL <span className="text-[#0076FF]">PONG</span>
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Round 14 • {competitionPeriod.start} - {competitionPeriod.end}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'tab-active' : 'text-slate-500'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 text-sm font-bold transition-all ${activeTab === 'history' ? 'tab-active' : 'text-slate-500'}`}
          >
            Histórico
          </button>
        </div>
      </motion.header>

      <main className="px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              <Dashboard matches={matches} players={players} period={competitionPeriod} />

              <div className="pt-4">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 px-2">
                  <span className="text-[#0076FF]">#</span> Jogadores
                </h2>
                <PlayerForm
                  onAddPlayer={addPlayer}
                  players={players}
                  onDeletePlayer={deletePlayer}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <MatchHistory matches={matches} players={players} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMatchFormOpen(true)}
        className="fixed bottom-8 right-6 w-16 h-16 bg-[#0076FF] rounded-full shadow-[0_8px_30px_rgb(0,118,255,0.4)] flex items-center justify-center text-3xl text-white z-50"
      >
        +
      </motion.button>

      {/* Match Registration Modal */}
      <AnimatePresence>
        {isMatchFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMatchFormOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#1E1E1E] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-6 text-center">Registrar Partida</h2>
              <MatchForm players={players} onAddMatch={addMatch} onCancel={() => setIsMatchFormOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-8 mb-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
          Quinzenal Pong Engine v3.0
        </p>
      </footer>
    </div>
  );
};

export default App;
