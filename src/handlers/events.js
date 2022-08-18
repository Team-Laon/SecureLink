const fs = require("fs");
module.exports = async (client) => {
    const logger = require('log4js').getLogger('Aram');
    fs.readdirSync(`./src/events`).forEach(dirs3 => {
        const eventFiles = fs.readdirSync(`./src/events/${dirs3}/`).filter(file => file.endsWith('.js'));

        eventFiles.forEach(file => {
            const event = require(`../events/${dirs3}/${file}`);
            if (event.once) {
                client.once(event.name, async (...args) => await event.run(...args, client));
            } else {
                client.on(event.name, async (...args) => await event.run(...args, client));
            }
        })
    })
    client.on('ready', async () => {
        logger.info(`✅ | Event Handler`);
    })

};