module.exports = (client) => {
    const log4js = require('log4js');
    const path = require('path');
    log4js.configure(path.join(__dirname, '../data/log4js.json'));
};