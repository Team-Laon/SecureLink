module.exports = client => {
    const logger = require('log4js').getLogger('Aram');
    process.on('unhandledRejection', (err, reason, p) => {
        if (err == "DiscordAPIError: Missing Access") return logger.log("봇에게 슬래쉬 커맨드를 서버에 푸쉬 할 권한이 없어서 서버에 슬래쉬 커맨드를 푸쉬하지 못했습니다.")
        logger.error(err, reason, p)
    });
    process.on("uncaughtException", (err, origin) => {
        logger.info(' [antiCrash] :: Uncaught Exception/Catch');
        logger.error(err, origin);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        logger.info(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        logger.error(err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        logger.info(' [antiCrash] :: Multiple Resolves');
        // logger.info(type, promise, reason);
    });
}