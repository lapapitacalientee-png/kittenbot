const { PermissionsBitField } = require('discord.js');
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
    const endsAt = Date.now() + durationMs;

    setBreak(user.id, endsAt);

    const endTimestamp = Math.floor(endsAt / 1000);
    message.reply(`✅ ${user.username} is now on break until <t:${endTimestamp}:F> (<t:${endTimestamp}:R>).`);
  },
};
