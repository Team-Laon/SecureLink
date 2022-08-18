const { MessageEmbed, Formatters } = require('discord.js');
const { stripIndents } = require('common-tags');
const client = require('../../../index')


client.on('ready', async () => {
	const webPortal = require('./server');
	webPortal.load(client);
});

client.on('guildCreate', async guild => {
	if (!guild.available) return;

	await db.createServer(guild.id);

	console.log(`Joined server: ${guild.name}`);
});