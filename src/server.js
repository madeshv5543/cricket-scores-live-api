import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import inMemoryDb from './db/inMemory';

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

routes(app, inMemoryDb);

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
