module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: 'postcss-loader',
                        options: {
                            precision: 10,
                            plugins: [
                                require('autoprefixer')(),
                                require('postcss-calc')()
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                precision: 10,
                                fiber: require('fibers')
                            }
                        }
                    }
                ]
            }
        ]
    }
};