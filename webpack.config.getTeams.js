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
    entry: './src/lambdas/user/getTeams.js',
    target: 'node',
    output: {
        path: path.join(__dirname, '/lambdas-dist/get-teams'),
        filename: 'getTeams.js',
        libraryTarget: 'commonjs',
        library: 'getTeams',
    },
    plugins: [new webpack.DefinePlugin(GLOBALS)],
};
