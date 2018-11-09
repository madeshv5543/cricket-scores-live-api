import matchRoutes from './matchRoutes';

export default (app, db, checkJwt, updates) => {
    matchRoutes(app, db, checkJwt, updates);
};
