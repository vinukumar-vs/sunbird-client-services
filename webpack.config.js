const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    entry: {
        'dist/index': './src/index.ts',
        'dist/core/index': './src/core/index.ts',
        'dist/core/http-service/index': './src/core/http-service/index.ts',
        'dist/core/http-service/utilities/interceptors/index': './src/core/http-service/utilities/interceptors/index.ts',
        'dist/models/index': './src/models/index.ts',
        'dist/models/channel/index': './src/models/channel/index.ts',
        'dist/models/content/index': './src/models/content/index.ts',
        'dist/models/course/index': './src/models/course/index.ts',
        'dist/models/device/index': './src/models/device/index.ts',
        'dist/models/faq/index': './src/models/faq/index.ts',
        'dist/models/form/index': './src/models/form/index.ts',
        'dist/models/group/index': './src/models/group/index.ts',
        'dist/models/location/index': './src/models/location/index.ts',
        'dist/models/organisation/index': './src/models/organisation/index.ts',
        'dist/models/page/index': './src/models/page/index.ts',
        'dist/models/user/index': './src/models/user/index.ts',
        'dist/services/content/index': './src/services/content/index.ts',
        'dist/services/content/utilities/content-group-generator/index': './src/services/content/utilities/content-group-generator/index.ts',
        'dist/services/content/utilities/content-progress-calculator/index': './src/services/content/utilities/content-progress-calculator/index.ts',
        'dist/services/content/utilities/mime-type-facet-to-mime-type-category-aggregator/index': './src/services/content/utilities/mime-type-facet-to-mime-type-category-aggregator/index.ts',
        'dist/services/content/utilities/primary-category-mapper/index': './src/services/content/utilities/primary-category-mapper/index.ts',
        'dist/services/group/index': './src/services/group/index.ts',
        'dist/services/group/activity/index': './src/services/group/activity/index.ts',
        'dist/services/location/index': './src/services/location/index.ts',
        'dist/services/framework/index': './src/services/framework/index.ts',
        'dist/services/course/index': './src/services/course/index.ts',
        'dist/services/user/index': './src/services/user/index.ts',
        'dist/services/system-settings/index': './src/services/system-settings/index.ts',
        'dist/blocs/index': './src/blocs/index.ts',
        'dist/utilities/aggregator/index': './src/utilities/aggregator/index.ts',
        'dist/telemetry/index': './src/telemetry/index.ts',
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
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        unused: false
                    }
                }
            })
        ],
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
