const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const isDev = process.argv.indexOf('--develop') >= 0;
const isWatch = process.argv.indexOf('--watch') >= 0;
const demoSrc = path.resolve(__dirname, './demo');
const demoDist = path.resolve(__dirname, '../miniprogram_dev');
const src = path.resolve(__dirname, '../src');
const dev = path.join(demoDist, 'components');
const dist = path.resolve(__dirname, '../miniprogram_dist');

module.exports = {
    entry: ['index', 'recycle-item', 'recycle-view'],

    isDev,
    isWatch,
    srcPath: src,
    distPath: isDev ? dev : dist,

    demoSrc,
    demoDist,

    wxss: {
        less: true,
        sourcemap: false,
    },
    
    webpack: {
        mode: 'production',
        output: {
            filename: '[name].js',
            libraryTarget: 'commonjs2',
        },
        target: 'node',
        externals: [nodeExternals()], // ignore node_modules
        module: {
            rules: [{
                test: /\.js$/i,
                use: 'babel-loader',
                exclude: /node_modules/
            }],
        },
        resolve: {
            modules: [src, 'node_modules'],
            extensions: ['.js', '.json'],
        },
        plugins: [
            new webpack.DefinePlugin({}),
            new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        ],
        optimization: {
            minimize: false,
        },
        // devtool: 'nosources-source-map',
        performance: {
            hints: 'warning',
            assetFilter: assetFilename => {
                return assetFilename.endsWith('.js');
            }
        }
    },
    copy: ['./wxml', './wxss', './wxs', './images'],
};
