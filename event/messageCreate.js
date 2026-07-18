const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../utils/logs');
const { getAfk, removeAfk } = require('../utils/afk');

const PREFIX = 'j?';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check if the author was AFK and just came back
    const wasAfk = getAfk(message.author.id);
    if (wasAfk && !message.content.startsWith(`${PREFIX}afk`)) {
      removeAfk(message.author.id);
      const sinceMinutes = Math.floor((Date.now() - wasAfk.since) / 60000);
      const timeLabel = sinceMinutes < 1 ? 'less than a minute' : `${sinceMinutes} minute${sinceMinutes !== 1 ? 's' : ''}`;

      const welcomeBackEmbed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setDescription(`👋 Welcome back, ${message.author}! You were AFK for **${timeLabel}**.`);

      message.channel.send({ embeds: [welcomeBackEmbed] }).then((msg) => {
        setTimeout(() => msg.delete().catch(() => {}), 8000);
      });
    }

    // Check if any mentioned user is AFK
    if (message.mentions.users.size > 0) {
      for (const [, user] of message.mentions.users) {
        const afkStatus = getAfk(user.id);
        if (afkStatus) {
          const afkEmbed = new EmbedBuilder()
            .setColor('#95A5A6')
            .setDescription(`💤 **${user.username}** is currently AFK: _${afkStatus.reason}_`);
          message.reply({ embeds: [afkEmbed] });
        }
      }
    }

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
        const logEmbed = new EmbedBuilder()
          .setColor('#95A5A6')
          .setDescription(
            `**Command:** \`${PREFIX}${commandName}\`\n` +
            `**Used by:** <@${message.author.id}>\n` +
            `**Channel:** ${message.channel}\n` +
            `**Full message:** ${message.content}`
          )
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }
  },
};
