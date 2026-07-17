const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { setBreak } = require('../utils/breaks');

module.exports = {
  data: {
    name: 'break',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const durationArg = args[1];

    if (!user || !durationArg) {
      return message.reply('❌ Usage: `j?break @user <duration>` (e.g. `24h` or `29d`)');
    }

    const match = durationArg.match(/^(\d+)(h|d)$/i);
    if (!match) {
      return message.reply('❌ Invalid format. Use a number followed by `h` (hours) or `d` (days). Example: `24h` or `29d`');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit === 'h' && (value < 0 || value > 24)) {
      return message.reply('❌ Hours must be between 0 and 24. Use `d` for longer breaks.');
    }
    if (unit === 'd' && (value < 0 || value > 30)) {
      return message.reply('❌ Days must be between 0 and 30.');
    }
    if (value === 0) {
      return message.reply('❌ Duration cannot be 0.');
    }

    const durationMs = unit === 'h' ? value * 60 * 60 * 1000 : value * 24 * 60 * 60 * 1000;
    const startedAt = Date.now();
    const endsAt = startedAt + durationMs;

    setBreak(user.id, endsAt);

    const startTimestamp = Math.floor(startedAt / 1000);
    const endTimestamp = Math.floor(endsAt / 1000);
    const durationLabel = unit === 'h' ? `${value} hour${value !== 1 ? 's' : ''}` : `${value} day${value !== 1 ? 's' : ''}`;

    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setAuthor({ name: `${user.username} • Break Started`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTitle('💤 Time to Rest')
      .setDescription(
        `${user} has officially clocked out for a well-deserved break.\n` +
        `No hosting duties or quota pressure until they're back. 🌙`
      )
      .addFields(
        { name: '⏳ Duration', value: `\`${durationLabel}\``, inline: true },
        { name: '📅 Started', value: `<t:${startTimestamp}:t>`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '🔔 Returns', value: `<t:${endTimestamp}:F>`, inline: false },
        { name: '⏱️ Time Remaining', value: `<t:${endTimestamp}:R>`, inline: false },
      )
      .setImage('https://i.imgur.com/6z7Y9Zb.png')
      .setFooter({ text: `Break granted by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
