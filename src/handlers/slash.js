module.exports = (client) => {
	const logger = require('log4js').getLogger('Aram');
	const fs = require('fs')
	const { REST } = require("@discordjs/rest")
	const { Routes } = require("discord-api-types/v9")
	const { Collection, MessageEmbed } = require('discord.js')
	const config = require('../data/config.json')
	const commands = []
	client.slashcommands = new Collection()
	fs.readdirSync("./src/command/slash").forEach(dirs => {
		const commandfolder = fs.readdirSync(`./src/command/slash/${dirs}/`).filter(file => file.endsWith(".js"))
		for (const file of commandfolder) {
			const command = require(`../command/slash/${dirs}/${file}`)
			commands.push(command.data.toJSON());
			client.slashcommands.set(command.data.name, command)
		}
	})
	const rest = new REST({ version: '9' }).setToken(config.bot.token.test)
	client.on("interactionCreate", async interaction => {
		if (!interaction.guild) return;
		if (!interaction.isCommand() || interaction.isContextMenu) {
			const command = client.slashcommands.get(interaction.commandName)
			if (!command) return;
			try {
				await command.execute(interaction,client);
			} catch (err) {
				logger.error(err)
				const embed = new MessageEmbed()
					.setTitle("<a:error:977576443301232680>에러 발생! Error Occured! <a:error:977576443301232680>")
					.setColor("#FF0000")
				await interaction.reply({
					embeds: [embed],
					ephemeral: true,
				});
			}
		}
	})
	client.once('ready', async () => {
		try {
			logger.info(`❓ | Pushing Slash Command . . .`)
			await rest.put(
				Routes.applicationCommands(config.bot.tclientId),
				{ body: commands }
			)
			logger.info(`✅ | Successfully pushed Slash Command`)
		} catch (e) {
			logger.error(e)
		}
	})
};