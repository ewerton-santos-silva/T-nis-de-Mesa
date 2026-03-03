export const calculateSeasonStats = (matches, players) => {
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

    matches.forEach(match => {
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

    return {
        mele: sortedByLosses[0]?.lossesZero > 0 ? sortedByLosses[0] : null,
        viceMele: sortedByLosses[1]?.lossesZero > 0 ? sortedByLosses[1] : null,
        exterminador: sortedByWins[0]?.winsZero > 0 ? sortedByWins[0] : null,
        ranking: Object.values(stats).sort((a, b) => b.winsZero - a.winsZero)
    };
};
