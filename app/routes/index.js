const matchRoutes = require('./matchRoutes');

module.exports = (app, db) => {
    matchRoutes(app, db);
};
