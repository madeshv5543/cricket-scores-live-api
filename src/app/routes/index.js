// const matchRoutes = require('./matchRoutes');
import matchRoutes from './matchRoutes';

export default (app, db) => {
    matchRoutes(app, db);
};
