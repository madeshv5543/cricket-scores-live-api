const express = require('express');

const app = express();

const port = 8000;

require('./app/routes')(app, {});

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
