const { ShardingManager } = require('discord.js')
const manager = new ShardingManager('./index.js', { token: require('./src/data/config.json').bot.token.test });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();