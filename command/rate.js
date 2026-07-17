const { PermissionsBitField } = require('discord.js');
const { addRating } = require('../utils/ratings');

module.exports = {
  data: {
    name: 'rate',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const stars = parseFloat(args[1]);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?rate @user <0-10>`');
    }
    if (isNaN(stars) || stars < 0 || stars > 10) {
      return message.reply('❌ Rating must be a number between 0 and 10 (decimals allowed, e.g. `7.5`). Usage: `j?rate @user <0-10>`');
    }

    const result = addRating(user.id, stars);
    message.reply(`⭐ Rated ${user.username} **${stars}/10**. New average: **${result.average.toFixed(1)}/10** (${result.count} rating${result.count !== 1 ? 's' : ''})`);
  },
};
