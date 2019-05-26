const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const externalsWhitelist = require('./externalsWhitelist');

require('dotenv').config();

const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify('production'),
        MONGO_CONNECTION: JSON.stringify(process.env.MONGO_CONNECTION),
    },
};

module.exports = {
    mode: 'production',
    entry: './src/lambdas/match/addMatch.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist/add-match'),
        filename: 'addMatch.js',
        libraryTarget: 'commonjs',
        library: 'addMatch',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
    externals: [nodeExternals({ whitelist: externalsWhitelist })],
};
