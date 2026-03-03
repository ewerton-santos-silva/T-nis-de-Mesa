import React from 'react';
import { motion } from 'framer-motion';

const SeasonArchive = ({ sessions }) => {
    if (sessions.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
                <span className="text-6xl mb-4">📂</span>
                <p className="font-black text-[10px] uppercase tracking-[0.3em]">Sem Temporadas Arquivadas</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {sessions.map((session, index) => (
                <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-4xl">🏆</span>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-black tracking-tighter text-white">Temporada #{sessions.length - index}</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {session.startDate} — {session.endDate}
                            </p>
                        </div>
                        <div className="bg-[#0076FF]/10 px-3 py-1 rounded-full border border-[#0076FF]/20">
                            <span className="text-[#0076FF] text-[9px] font-black uppercase">{session.matches.length} Partidas</span>
                        </div>
                    </div>

                    {/* Winners Summary if any */}
                    {session.winners && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Exterminador</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">👑</span>
                                    <span className="font-bold text-xs truncate">{session.winners.exterminador?.name || '---'}</span>
                                </div>
                            </div>
                            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Melé</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🛞</span>
                                    <span className="font-bold text-xs truncate">{session.winners.mele?.name || '---'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default SeasonArchive;
