import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import inMemoryDb from './db/inMemory';

const app = express();
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

routes(app, inMemoryDb);

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
