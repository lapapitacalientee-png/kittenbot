const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../utils/logs');

const PREFIX = 'j?';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName);
    if (!command) return;

    await command.execute(message, args);

    const logChannelId = getLogChannel(message.guild.id);
    if (logChannelId && commandName !== 'setuplogs') {
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#95A5A6')
          .setDescription(
            `**Command:** \`${PREFIX}${commandName}\`\n` +
            `**Used by:** <@${message.author.id}>\n` +
            `**Channel:** ${message.channel}\n` +
            `**Full message:** ${message.content}`
          )
          .setTimestamp();
        logChannel.send({ embeds: [embed] }).catch(() => {});
      }
    }
  },
};
