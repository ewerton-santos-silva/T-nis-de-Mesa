import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerAvatar from './PlayerAvatar';

const PlayerForm = ({ onAddPlayer, players, onDeletePlayer }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('🏓');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const avatars = ['🏓', '🔥', '⚡', '🎯', '🤴', '🏆', '👽', '👻', '🤖', '🦖'];

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPG for better storage efficiency
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.9);
                    setPhoto(compressedBase64);
                    setPreview(compressedBase64);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddPlayer({ name, avatar, photo });
        setName('');
        setPhoto(null);
        setPreview(null);
        setIsOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Player List for Deletion */}
            <div className="space-y-3">
                {players.map(player => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1E1E1E] p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <PlayerAvatar player={player} size="md" />
                            <span className="font-bold text-sm tracking-tight">{player.name}</span>
                        </div>
                        <button
                            onClick={() => onDeletePlayer(player.id)}
                            className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 bg-[#0076FF]/10 text-[#0076FF] border border-[#0076FF]/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
                {isOpen ? '✕ Cancelar' : '+ Novo Jogador'}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="overflow-hidden space-y-6 bg-[#1E1E1E] p-6 rounded-[2rem] border border-white/5 shadow-2xl"
                    >
                        {/* Photo Upload Area */}
                        <div className="flex flex-col items-center gap-4">
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <PlayerAvatar
                                    player={{ photo: preview || photo, name: 'Preview', avatar: '📸' }}
                                    size="lg"
                                    borderClass="border-2 border-dashed border-white/20 !bg-transparent"
                                />
                                {!preview && !photo && (
                                    <span className="text-[8px] font-black uppercase opacity-30 mt-1 block text-center">Foto</span>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Nome do Atleta</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: João das Neves"
                                className="w-full bg-[#121212] border border-white/5 rounded-2xl p-4 text-white font-bold placeholder:opacity-30 focus:ring-2 focus:ring-[#0076FF]/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Avatar (Opção 2)</label>
                            <div className="flex flex-wrap gap-2">
                                {avatars.map(a => (
                                    <button
                                        key={a}
                                        type="button"
                                        onClick={() => setAvatar(a)}
                                        className={`text-xl p-3 rounded-xl transition-all ${avatar === a ? 'bg-[#0076FF] shadow-[0_4px_15px_rgba(0,118,255,0.3)] scale-110' : 'bg-[#121212] border border-white/5 opacity-50'}`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0076FF] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#0076FF]/20"
                        >
                            Salvar Atleta
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerForm;
