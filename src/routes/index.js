import matchRoutes from './matchRoutes';
import userRoutes from './userRoutes';

export default (app, db, checkJwt, updates) => {
    matchRoutes(app, db, checkJwt, updates);
    userRoutes(app, db, checkJwt);
};
