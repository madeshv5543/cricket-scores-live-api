import BadWords from 'bad-words';

export default (req, res, next) => {
    const filter = new BadWords();
    req.body.match = {
        ...req.body.match,
        homeTeam: {
            ...req.body.match.homeTeam,
            name: filter.clean(req.body.match.homeTeam.name),
            players: req.body.match.homeTeam.players.map(player => filter.clean(player)),
        },
        awayTeam: {
            ...req.body.match.awayTeam,
            name: filter.clean(req.body.match.awayTeam.name),
            players: req.body.match.awayTeam.players.map(player => filter.clean(player)),
        },
    };
    next();
};
