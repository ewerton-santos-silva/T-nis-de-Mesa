import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MatchForm = ({ players, onAddMatch, onCancel }) => {
    const [player1Id, setPlayer1Id] = useState('');
    const [player2Id, setPlayer2Id] = useState('');
    const [score1, setScore1] = useState('');
    const [score2, setScore2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!player1Id || !player2Id || score1 === '' || score2 === '') return;
        if (player1Id === player2Id) {
            alert("Selecione jogadores diferentes!");
            return;
        }

        onAddMatch({
            player1Id: parseInt(player1Id),
            player2Id: parseInt(player2Id),
            score1: parseInt(score1),
            score2: parseInt(score2),
        });

        setScore1('');
        setScore2('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-4 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10">
                    <span className="text-4xl font-black italic">VS</span>
                </div>

                {/* Player 1 */}
                <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">Atleta 01</label>
                    <div className="relative">
                        <select
                            value={player1Id}
                            onChange={(e) => setPlayer1Id(e.target.value)}
                            className="w-full bg-[#121212] border border-white/5 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-[#0076FF]/50 transition-all appearance-none text-sm pr-10"
                        >
                            <option value="">Selecionar</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="number"
                        placeholder="0"
                        value={score1}
                        onChange={(e) => setScore1(e.target.value)}
                        className="w-full bg-[#121212] border border-white/5 rounded-3xl p-6 text-5xl font-black text-center text-[#0076FF] focus:border-[#0076FF]/50 transition-all placeholder:opacity-20"
                        min="0"
                    />
                </div>

                {/* Player 2 */}
                <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">Atleta 02</label>
                    <div className="relative">
                        <select
                            value={player2Id}
                            onChange={(e) => setPlayer2Id(e.target.value)}
                            className="w-full bg-[#121212] border border-white/5 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-[#0076FF]/50 transition-all appearance-none text-sm pr-10"
                        >
                            <option value="">Selecionar</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="number"
                        placeholder="0"
                        value={score2}
                        onChange={(e) => setScore2(e.target.value)}
                        className="w-full bg-[#121212] border border-white/5 rounded-3xl p-6 text-5xl font-black text-center text-[#0076FF] focus:border-[#0076FF]/50 transition-all placeholder:opacity-20"
                        min="0"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-[#0076FF] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#0076FF]/20 uppercase tracking-widest text-xs"
                >
                    Registrar Resultado
                </motion.button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default MatchForm;
