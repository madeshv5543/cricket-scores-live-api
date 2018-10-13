import express from 'express';
import routes from './routes';

const app = express();

const port = process.env.PORT || 8000;

routes(app, {});

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
