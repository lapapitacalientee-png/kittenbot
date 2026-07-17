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
    const hours = parseInt(args[1], 10);
    const days = parseInt(args[2], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?break @user (0-24hrs) (0-30d)`');
    }
    if (isNaN(hours) || hours < 0 || hours > 24 || isNaN(days) || days < 0 || days > 30) {
      return message.reply('❌ Invalid duration. Hours must be 0-24 and days must be 0-30. Usage: `j?break @user (0-24hrs) (0-30d)`');
    }
    if (hours === 0 && days === 0) {
      return message.reply('❌ Duration cannot be 0. Provide hours and/or days.');
    }

    const durationMs = (hours * 60 * 60 * 1000) + (days * 24 * 60 * 60 * 1000);
    const endsAt = Date.now() + durationMs;

    setBreak(user.id, endsAt);

    const endTimestamp = Math.floor(endsAt / 1000);
    message.reply(`✅ ${user.username} is now on break until <t:${endTimestamp}:F> (<t:${endTimestamp}:R>).`);
  },
};
