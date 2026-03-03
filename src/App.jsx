import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import MatchForm from './components/MatchForm';
import MatchHistory from './components/MatchHistory';
import PlayerForm from './components/PlayerForm';
import SeasonArchive from './components/SeasonArchive';
import { calculateSeasonStats } from './utils/stats';

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

  const [archivedSessions, setArchivedSessions] = useState(() => {
    const saved = localStorage.getItem('tm_archived_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [round, setRound] = useState(() => {
    const saved = localStorage.getItem('tm_round');
    return saved ? parseInt(saved) : (archivedSessions.length + 14);
  });

  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('tm_start_date');
    if (saved) return saved;
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() <= 15 ? 1 : 16).toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const saved = localStorage.getItem('tm_end_date');
    if (saved) return saved;
    const now = new Date();
    const isFirstHalf = now.getDate() <= 15;
    return new Date(now.getFullYear(), now.getMonth(), isFirstHalf ? 15 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).toISOString().split('T')[0];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tm_players', JSON.stringify(players));
    localStorage.setItem('tm_matches', JSON.stringify(matches));
    localStorage.setItem('tm_archived_sessions', JSON.stringify(archivedSessions));
    localStorage.setItem('tm_start_date', startDate);
    localStorage.setItem('tm_end_date', endDate);
    localStorage.setItem('tm_round', round.toString());
  }, [players, matches, archivedSessions, startDate, endDate, round]);

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

  const finalizeSeason = () => {
    if (matches.length === 0) {
      alert("Não há partidas para arquivar!");
      return;
    }

    if (!window.confirm("Deseja FINALIZAR a temporada atual? Isso irá arquivar os resultados e zerar o ranking.")) return;

    const stats = calculateSeasonStats(matches, players);
    const newSession = {
      id: Date.now(),
      round: round,
      startDate: new Date(startDate).toLocaleDateString('pt-BR'),
      endDate: new Date(endDate).toLocaleDateString('pt-BR'),
      matches: matches,
      winners: {
        mele: stats.mele,
        exterminador: stats.exterminador
      }
    };

    setArchivedSessions([newSession, ...archivedSessions]);
    setMatches([]);
    setRound(prev => prev + 1);

    // Set next period (roughly)
    const nextStart = new Date(endDate);
    nextStart.setDate(nextStart.getDate() + 1);
    const nextEnd = new Date(nextStart);
    nextEnd.setDate(nextEnd.getDate() + 14);

    setStartDate(nextStart.toISOString().split('T')[0]);
    setEndDate(nextEnd.toISOString().split('T')[0]);
    setIsSettingsOpen(false);
    setActiveTab('seasons');
  };

  const competitionPeriod = useMemo(() => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);

    const format = (iso) => {
      const d = new Date(iso);
      return d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');
    };

    return {
      start: format(startDate),
      end: format(endDate),
      isEnding: diff <= 2 && diff >= 0
    };
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen text-slate-100 font-sans max-w-md mx-auto relative pb-24">
      {/* Header Section */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-4 px-6 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-40"
      >
        <div className="flex flex-col items-center mb-6 relative">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute right-0 top-1 bg-white/5 hover:bg-white/10 text-white transition-colors p-3 rounded-xl border border-white/5"
            title="Configurações"
          >
            ⚙️
          </button>
          <h1 className="text-3xl font-black italic tracking-tighter text-white">
            PONG <span className="text-[#0076FF]">STARS</span>
          </h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="mt-1 flex flex-col items-center group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#0076FF] transition-colors">
              Round {round} • {competitionPeriod.start} - {competitionPeriod.end}
            </span>
            <span className="text-[8px] font-bold text-[#0076FF] opacity-0 group-hover:opacity-100 transition-opacity uppercase mt-0.5">Clique para Editar</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-between items-center border-b border-white/5 px-2">
          {['dashboard', 'history', 'seasons'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#0076FF] border-b-2 border-[#0076FF]' : 'text-slate-500'}`}
            >
              {tab === 'dashboard' ? 'Dashboard' : tab === 'history' ? 'Histórico' : 'Temporadas'}
            </button>
          ))}
        </div>
      </motion.header>

      <main className="px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
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
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <MatchHistory matches={matches} players={players} />
            </motion.div>
          )}

          {activeTab === 'seasons' && (
            <motion.div
              key="seasons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SeasonArchive sessions={archivedSessions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full bg-[#1E1E1E] rounded-[2rem] p-8 border border-white/5 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Competição</h2>

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Número do Round</label>
                  <input
                    type="number"
                    value={round}
                    onChange={(e) => setRound(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white font-black text-xl focus:ring-2 focus:ring-[#0076FF]/50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Início</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white font-bold focus:ring-2 focus:ring-[#0076FF]/50 outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Término</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white font-bold focus:ring-2 focus:ring-[#0076FF]/50 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full bg-[#0076FF] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#0076FF]/20 uppercase tracking-widest text-xs"
                >
                  Confirmar Ajustes
                </button>
                <div className="h-[1px] bg-white/5 my-4" />
                <button
                  onClick={finalizeSeason}
                  className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-black py-4 rounded-2xl uppercase tracking-widest text-[10px]"
                >
                  Finalizar & Arquivar Round
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
          Pong Stars Engine v3.6 • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
