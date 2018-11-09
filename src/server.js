import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import routes from './routes';
import inMemoryDb from './db/inMemory';
import mongoDb from './db/mongo';
import liveUpdates from './liveUpdates';

dotenv.config();

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.ISSUER}.well-known/jwks.json`,
    }),
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: ['RS256'],
});

const app = express();
const server = http.Server(app);

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.sendStatus(200);
});

const port = process.env.PORT || 8000;

routes(
    app,
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
    checkJwt,
    liveUpdates(server),
);

server.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
