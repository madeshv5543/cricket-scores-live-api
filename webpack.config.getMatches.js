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
    mode: 'development',
    entry: './src/lambdas/match/getMatches.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist'),
        filename: 'getMatches.js',
        libraryTarget: 'commonjs',
        library: 'getMatches',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
};
