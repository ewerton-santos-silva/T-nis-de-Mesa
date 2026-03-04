import React from 'react';
import { motion } from 'framer-motion';
import PlayerAvatar from './PlayerAvatar';

const PlayerIdentity = ({ player, isWinner }) => (
    <div className="flex flex-col items-center gap-2">
        <PlayerAvatar
            player={player}
            size="md"
            borderClass={isWinner ? 'border-[#0076FF] scale-110 shadow-lg !border-2' : 'border-white/5 opacity-40 grayscale !border-2'}
        />
        <span className={`text-[8px] font-black uppercase tracking-tighter truncate w-16 text-center ${isWinner ? 'text-white' : 'text-slate-600'}`}>
            {player.name}
        </span>
    </div>
);

const MatchHistory = ({ matches, players }) => {
    const getPlayer = (id) => players.find(p => p.id === id) || { name: '???', avatar: '👤', photo: null };

    if (matches.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
                <span className="text-6xl mb-4">📜</span>
                <p className="font-black text-[10px] uppercase tracking-[0.3em]">Histórico Vazio</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {matches.map((match, index) => {
                const p1 = getPlayer(match.player1Id);
                const p2 = getPlayer(match.player2Id);
                const isMele = match.score1 === 0 || match.score2 === 0;

                return (
                    <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-[#1E1E1E] rounded-3xl p-4 border border-white/5 flex items-center justify-between relative overflow-hidden ${isMele ? 'melee-glow' : ''}`}
                    >
                        {isMele && (
                            <div className="absolute top-0 right-0 p-2">
                                <span className="text-xs">🛞</span>
                            </div>
                        )}

                        <PlayerIdentity player={p1} isWinner={match.score1 > match.score2} />

                        <div className="flex flex-col items-center px-4">
                            <div className="flex items-center gap-3">
                                <span className={`text-2xl font-black italic tracking-tighter ${match.score1 > match.score2 ? 'text-white' : 'text-slate-600'}`}>
                                    {match.score1}
                                </span>
                                <span className="text-slate-800 font-black italic text-[10px]">VS</span>
                                <span className={`text-2xl font-black italic tracking-tighter ${match.score2 > match.score1 ? 'text-white' : 'text-slate-600'}`}>
                                    {match.score2}
                                </span>
                            </div>
                            <div className="mt-2 text-[7px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md text-slate-500">
                                {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} • {new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <PlayerIdentity player={p2} isWinner={match.score2 > match.score1} />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default MatchHistory;
