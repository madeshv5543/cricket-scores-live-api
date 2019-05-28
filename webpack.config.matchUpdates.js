const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const externalsWhitelist = require('./externalsWhitelist');

require('dotenv').config();

const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify('production'),
    },
};

module.exports = {
    mode: 'production',
    entry: './src/lambdas/match/matchUpdates.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist/match-updates'),
        filename: 'matchUpdates.js',
        libraryTarget: 'commonjs',
        library: 'matchUpdates',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
    externals: [nodeExternals({ whitelist: externalsWhitelist })],
};
