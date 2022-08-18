module.exports = (client) => {
    const logger = require('log4js').getLogger('Aram');
    const config = require('../data/config.json')
    client.login(config.bot.token.test)
    const settings = require('../data/settings.json')
    const Discord = require('discord.js')
    client.slash = new Discord.Collection();
    client.events = new Discord.Collection();
    client.logs = new Discord.Collection();
    client.mongo = new Discord.Collection();

    ["events", "slash", "mongo", "logs", settings.antiCrash ? "antiCrash" : null]
        .filter(Boolean)
        .forEach(h => {
            require(`./${h}`)(client);
        })
    client.on('ready', async () => {
        logger.info(`✅ | index.js 최종 가동완료`);
    })
};