const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify('production'),
        AUDIENCE: JSON.stringify(process.env.AUDIENCE),
        ISSUER: JSON.stringify(process.env.ISSUER),
    },
};

module.exports = {
    mode: 'production',
    entry: './src/lambdas/authoriser/index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist/authoriser'),
        filename: 'index.js',
        libraryTarget: 'commonjs',
        library: 'authoriser',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
};
