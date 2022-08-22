const path = require('path');

module.exports = {
    process(sourceText, sourcePath, options) {
        return `module.exports = ${JSON.stringify(path.basename(sourcePath))};`;
    },
};
