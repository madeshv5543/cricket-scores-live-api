const express = require('express');

const app = express();

const port = process.env.PORT || 8000;

require('./app/routes')(app, {});

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
});
