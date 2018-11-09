import matchRoutes from './matchRoutes';

export default (app, db, checkJwt, updated) => {
    matchRoutes(app, db, checkJwt, updated);
};
