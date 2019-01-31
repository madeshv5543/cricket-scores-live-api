import jwtDecode from 'jwt-decode';
import util from 'util';

export default (app, db, checkJwt) => {
    const handleError = (err, req, res) => {
        if (err.message && err.message === 'notfound') {
            res.status(404);
            res.send(`match with id ${req.params.id} not found`);
        } else {
            res.sendStatus(500);
        }
    };

    const getUser = req => jwtDecode(req.headers.authorization.split(' ')[1]).sub;

    app.get('/user/teams', checkJwt, (req, res) => {
        util.promisify(db.getUserTeams)(getUser(req))
            .then(result => res.send(result))
            .catch(err => handleError(err, req, res));
    });
};
