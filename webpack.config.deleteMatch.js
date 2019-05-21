const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify('production'),
        MONGO_CONNECTION: JSON.stringify(process.env.MONGO_CONNECTION),
    },
};

module.exports = {
    mode: 'production',
    entry: './src/lambdas/match/deleteMatch.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist/delete-match'),
        filename: 'deleteMatch.js',
        libraryTarget: 'commonjs',
        library: 'deleteMatch',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
};
