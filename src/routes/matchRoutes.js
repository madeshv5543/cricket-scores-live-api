export default (app, db, checkJwt) => {
    const handleError = (err, req, res) => {
        if (err.message === 'notfound') {
            res.status(404);
            res.send(`match with id ${req.params.id} not found`);
        } else {
            res.sendStatus(500);
        }
    };

    app.get('/match/:id', (req, res) => {
        db.get(req.params.id, (err, result) => {
            if (typeof err !== 'undefined') {
                handleError(err, req, res);
            } else {
                res.send(result);
            }
        });
    });

    app.get('/match', (req, res) => {
        db.getAll((err, result) => {
            res.send(result.map(item => ({
                id: item.id,
                date: item.match.date,
                homeTeam: item.match.homeTeam.name,
                awayTeam: item.match.awayTeam.name,
                status: item.match.status,
            })));
        });
    });

    app.post('/match', checkJwt, (req, res) => {
        db.add(req.body, (err, result) => {
            res.send(result);
        });
    });

    app.put('/match/:id', checkJwt, (req, res) => {
        db.update(req.params.id, req.body, (err, result) => {
            if (typeof err !== 'undefined') {
                handleError(err, req, res);
            } else {
                res.send(result);
            }
        });
    });
};
