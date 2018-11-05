import jwtDecode from 'jwt-decode';

export default (app, db, checkJwt) => {
    const handleError = (err, req, res) => {
        if (err.message === 'notfound') {
            res.status(404);
            res.send(`match with id ${req.params.id} not found`);
        } else {
            res.sendStatus(500);
        }
    };

    const getUser = req => jwtDecode(req.headers.authorization.split(' ')[1]).sub;

    const checkUser = (user, match, validCallback, inValidCallback) => {
        if (match && user === match.user) {
            validCallback();
        } else {
            inValidCallback();
        }
    };

    app.get('/match/:id', (req, res) => {
        db.get(req.params.id, (err, result) => {
            if (err) {
                handleError(err, req, res);
            } else {
                res.send(result);
            }
        });
    });

    app.get('/match', (req, res) => {
        db.getAll(req.query, (err, result) => {
            res.send(result.map(item => ({
                id: item.id,
                date: item.match.date,
                user: item.match.user,
                homeTeam: item.match.homeTeam.name,
                awayTeam: item.match.awayTeam.name,
                status: item.match.status,
                version: item.version || 0,
                lastEvent: item.lastEvent,
            })));
        });
    });

    app.post('/match', checkJwt, (req, res) => {
        db.add(req.body, getUser(req), (err, result) => {
            res.send(result);
        });
    });

    app.put('/match/:id', checkJwt, (req, res) => {
        checkUser(
            getUser(req),
            req.body.match,
            () => {
                db.update(req.params.id, req.body, (err, result) => {
                    if (err) {
                        handleError(err, req, res);
                    } else {
                        res.send(result);
                    }
                });
            },
            () => res.sendStatus(401)
        );
    });

    app.delete('/match/:id', checkJwt, (req, res) => {
        db.get(req.params.id, (getErr, result) => {
            if (!getErr) {
                checkUser(
                    getUser(req), result.match, () => {
                        db.remove(req.params.id, (err) => {
                            if (err) {
                                handleError(err, req, res);
                            } else {
                                res.sendStatus(204);
                            }
                        });
                    },
                    () => res.sendStatus(401)
                );
            } else {
                handleError(getErr);
            }
        });
    });
};
