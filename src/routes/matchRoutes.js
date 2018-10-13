/* eslint-disable no-unused-vars */
export default (app, db) => {
    app.get('/match/:id', (req, res) => {
        res.send(`getting match ${req.params.id}`);
    });

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
