module.exports = {
    // https://stackoverflow.com/questions/72720744/module-not-found-error-cant-resolve-url-in-webpack-5-angular-14
    resolve: {
        fallback: { "url": require.resolve("url/") }
      },

    // https://stackoverflow.com/questions/65941637/making-webpack-and-cra-emit-files-in-watch-mode
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
    },

    // https://blog.logrocket.com/creating-chrome-extension-react-typescript/
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                    background: './src/chromeServices/background.ts',
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        },
    }
 }