module.exports = async (client) => {
    const logger = require('log4js').getLogger('Aram');
    const mongoose = require("mongoose")
    const config = require('../data/config.json')
    mongoose.connect(config.db.url, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(logger.info("✅ | MongoDB Connected"))
};