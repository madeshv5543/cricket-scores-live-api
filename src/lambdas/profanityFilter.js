import BadWords from 'bad-words';

export default body => {
    const filter = new BadWords();
    return {
        ...body,
        match: {
            ...body.match,
            homeTeam: {
                ...body.match.homeTeam,
                name: filter.clean(body.match.homeTeam.name),
                players: body.match.homeTeam.players.map(player => filter.clean(player)),
            },
            awayTeam: {
                ...body.match.awayTeam,
                name: filter.clean(body.match.awayTeam.name),
                players: body.match.awayTeam.players.map(player => filter.clean(player)),
            },
        },
    };
};
