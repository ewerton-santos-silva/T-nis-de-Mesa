```javascript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerAvatar = ({ player, size = "md", borderClass = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Exact pixel sizes to guarantee consistency
    const dimensions = {
        sm: 32,
        md: 48,
        lg: 80,
        xl: 112
    };

    const s = dimensions[size] || dimensions.md;

    return (
        <>
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                }}
                style={{ 
                    width: `${ s } px`, 
                    height: `${ s } px`,
                    minWidth: `${ s } px`,
                    minHeight: `${ s } px`
                }}
                className={`rounded - full bg - [#121212] overflow - hidden flex items - center justify - center border border - white / 10 shrink - 0 cursor - pointer hover: ring - 2 hover: ring - [#0076FF] / 50 transition - all ${ borderClass } `}
            >
                {player?.photo ? (
                    <img 
                        src={player.photo} 
                        alt={player.name} 
                        className="w-full h-full object-cover block"
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <span 
                        style={{ fontSize: `${ s * 0.5 } px` }}
                        className="leading-none select-none"
                    >
                        {player?.avatar || '👤'}
                    </span>
                )}
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="relative max-w-lg w-full aspect-square bg-[#121212] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center"
                        >
                            {player?.photo ? (
                                <img 
                                    src={player.photo} 
                                    alt={player.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-9xl">{player?.avatar || '👤'}</span>
                            )}
                            
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl font-black text-center">{player?.name}</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-[#0076FF] text-center mt-2">Toque para fechar</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PlayerAvatar;
```
