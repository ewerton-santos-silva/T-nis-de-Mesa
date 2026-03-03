import React from 'react';
import { motion } from 'framer-motion';

const PlayerAvatar = ({ player, size = "md", borderClass = "" }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-xl",
        lg: "w-20 h-20 text-3xl",
        xl: "w-28 h-28 text-5xl"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-[#121212] overflow-hidden flex items-center justify-center border border-white/10 shrink-0 ${borderClass}`}>
            {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            ) : (
                <span>{player.avatar || '👤'}</span>
            )}
        </div>
    );
};

const Dashboard = ({ matches, players, period }) => {
    const getBiweeklyMatches = (allMatches) => {
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return allMatches.filter(m => {
            const matchDate = new Date(m.date);
            const isSameMonth = matchDate.getMonth() === currentMonth && matchDate.getFullYear() === currentYear;
            if (!isSameMonth) return false;

            const matchDay = matchDate.getDate();
            if (currentDay <= 15) return matchDay <= 15;
            return matchDay > 15;
        });
    };

    const currentMatches = getBiweeklyMatches(matches);

    const stats = players.reduce((acc, player) => {
        acc[player.id] = {
            id: player.id,
            winsZero: 0,
            lossesZero: 0,
            name: player.name,
            avatar: player.avatar,
            photo: player.photo
        };
        return acc;
    }, {});

    currentMatches.forEach(match => {
        if (match.score1 === 0) {
            stats[match.player1Id].lossesZero += 1;
            stats[match.player2Id].winsZero += 1;
        }
        if (match.score2 === 0) {
            stats[match.player2Id].lossesZero += 1;
            stats[match.player1Id].winsZero += 1;
        }
    });

    const sortedByLosses = Object.values(stats).sort((a, b) => b.lossesZero - a.lossesZero);
    const sortedByWins = Object.values(stats).sort((a, b) => b.winsZero - a.winsZero);

    const mele = sortedByLosses[0]?.lossesZero > 0 ? sortedByLosses[0] : null;
    const viceMele = sortedByLosses[1]?.lossesZero > 0 ? sortedByLosses[1] : null;
    const exterminador = sortedByWins[0]?.winsZero > 0 ? sortedByWins[0] : null;

    // Overall ranking for the bottom list
    const ranking = Object.values(stats).sort((a, b) => b.winsZero - a.winsZero);

    return (
        <div className="space-y-10">
            {/* Highlight Cards Grid */}
            <div className="grid grid-cols-12 gap-4 items-end">
                {/* Left Card: O Exterminador */}
                <div className="col-span-3">
                    {exterminador && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#1E1E1E] rounded-2xl p-3 pt-6 flex flex-col items-center border-[2px] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.1)] relative"
                        >
                            <span className="absolute -top-4 text-2xl">👑</span>
                            <PlayerAvatar player={exterminador} size="md" />
                            <h4 className="text-[10px] font-black uppercase mt-3 tracking-tighter truncate w-full text-center">{exterminador.name}</h4>
                            <p className="text-[#FFD700] text-[9px] font-bold mt-1">{exterminador.winsZero} Vitórias de 0</p>
                        </motion.div>
                    )}
                </div>

                {/* Central Card: O Melé (Maior) */}
                <div className="col-span-6">
                    {mele ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1E1E1E] rounded-[2.5rem] p-6 flex flex-col items-center border-[2px] border-[#FF3B30] shadow-[0_0_30px_rgba(255,59,48,0.2)] melee-glow animate-float"
                        >
                            <span className="text-4xl mb-2">🛞</span>
                            <h3 className="text-[#FF3B30] text-[10px] font-black uppercase tracking-[0.2em] mb-4">O MELÉ</h3>
                            <PlayerAvatar player={mele} size="xl" borderClass="border-2 border-[#FF3B30]/30" />
                            <h2 className="text-xl font-black mt-4 tracking-tighter">{mele.name}</h2>
                            <div className="mt-2 bg-[#FF3B30]/10 px-4 py-1.5 rounded-full border border-[#FF3B30]/20">
                                <p className="text-[#FF3B30] text-xs font-black uppercase">{mele.lossesZero} Derrotas de 0</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-[#1E1E1E]/50 rounded-[2.5rem] p-10 border-2 border-dashed border-white/5 flex flex-col items-center">
                            <span className="text-4xl opacity-20 mb-4">🏓</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Aguardando o primeiro pneu...</p>
                        </div>
                    )}
                </div>

                {/* Right Card: Vice-Melé */}
                <div className="col-span-3">
                    {viceMele && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#1E1E1E] rounded-2xl p-3 pt-6 flex flex-col items-center border-[2px] border-[#8B0000] shadow-lg relative"
                        >
                            <span className="absolute -top-3 text-lg opacity-50">🥈</span>
                            <PlayerAvatar player={viceMele} size="md" />
                            <h4 className="text-[10px] font-black uppercase mt-3 tracking-tighter truncate w-full text-center">{viceMele.name}</h4>
                            <p className="text-[#8B0000] text-[9px] font-bold mt-1">{viceMele.lossesZero} Derrotas de 0</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Ranking List */}
            <div className="bg-[#1E1E1E] rounded-[2rem] p-6 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 px-2 flex items-center justify-between">
                    Ranking Geral Quinzenal
                    <span className="bg-[#121212] px-2 py-1 rounded text-white/30 tracking-normal">{ranking.length} Atletas</span>
                </h3>

                <div className="space-y-4">
                    {ranking.map((p, index) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-2xl bg-[#121212]/50 hover:bg-[#121212] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-black w-4 ${index === 0 ? 'text-[#FFD700]' : 'text-slate-600'}`}>
                                    {index + 1}
                                </span>
                                <PlayerAvatar player={p} size="sm" />
                                <span className="font-bold text-sm tracking-tight">{p.name}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-slate-500 uppercase">Ganhos</p>
                                    <p className="text-xs font-black text-[#0076FF]">{p.winsZero}</p>
                                </div>
                                <div className="w-[1px] h-6 bg-white/5" />
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-slate-500 uppercase">Melés</p>
                                    <p className="text-xs font-black text-[#FF3B30]">{p.lossesZero}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
