import React from 'react';

const PlayerAvatar = ({ player, size = "md", borderClass = "" }) => {
    // Exact pixel sizes to guarantee consistency
    const dimensions = {
        sm: 32,
        md: 48,
        lg: 80,
        xl: 112
    };

    const s = dimensions[size] || dimensions.md;

    return (
        <div
            style={{
                width: `${s}px`,
                height: `${s}px`,
                minWidth: `${s}px`,
                minHeight: `${s}px`
            }}
            className={`rounded-full bg-[#121212] overflow-hidden flex items-center justify-center border border-white/10 shrink-0 ${borderClass}`}
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
                    style={{ fontSize: `${s * 0.5}px` }}
                    className="leading-none select-none"
                >
                    {player?.avatar || '👤'}
                </span>
            )}
        </div>
    );
};

export default PlayerAvatar;
