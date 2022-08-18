const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
data: new SlashCommandBuilder()
    .setName("핑")
    .setDescription("핑을 알려줘요!"),
async execute(interaction,client) {
    interaction.reply(client.ws.ping + 'ms')
  }
}