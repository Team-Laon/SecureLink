const client = require("../../../index")
const config = require('../../data/config.json')

client.once("ready", async () => {
    const logger = require('log4js').getLogger('Aram');
    client.status = '정상 운영중...'
    logger.info(`✅ | ${client.user.username}봇 상태메세지 정상가동`);

    setInterval(() => {
        switch (Math.floor(Math.random() * 1)) {
            case 0:
                client.user.setActivity(`${config.bot.cmd.status_msg}`, { type: "WATCHING" })
                break;
        }
    }, 10000);
});