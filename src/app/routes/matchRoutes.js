/* eslint-disable no-unused-vars */
module.exports = (app, db) => {
    app.get('/match', (req, res) => {
        res.send('getting matches');
    });

    app.post('/match', (req, res) => {
        res.send('creating match');
    });

    app.put('/match', (req, res) => {
        res.send('updating match');
    });
};
