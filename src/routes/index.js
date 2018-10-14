import matchRoutes from './matchRoutes';

export default (app, db, checkJwt) => {
    matchRoutes(app, db, checkJwt);
};
