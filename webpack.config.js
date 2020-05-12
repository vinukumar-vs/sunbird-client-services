const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
    entry: {
        'dist/index': './src/index.ts',
        'dist/core/index': './src/core/index.ts',
        'dist/core/http-service/index': './src/core/http-service/index.ts',
        'dist/core/http-service/utilities/interceptors/index': './src/core/http-service/utilities/interceptors/index.ts',
        'dist/services/content/index': './src/services/content/index.ts',
        'dist/services/content/utilities/content-group-generator/index': './src/services/content/utilities/content-group-generator/index.ts',
        'dist/services/group/index': './src/services/group/index.ts',
    },
    externals: [
        // externals here
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname),
        libraryTarget: 'umd'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            sourceMap: true
        })],
    },
    performance: {
        hints: false
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};