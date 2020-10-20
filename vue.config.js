const webpack = require('webpack');

const packageVersion = JSON.stringify(require('./package.json').version);
const web = process.env.WEB || false;

console.log(`Building package ${packageVersion} for Web: ${web}`);

module.exports = {
    configureWebpack: () => {
        return {
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        PACKAGE_VERSION: packageVersion,
                        WEB: web,
                    },
                }),
            ],
        };
    },
};
