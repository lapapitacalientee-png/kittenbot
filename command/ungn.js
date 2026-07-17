const { PermissionsBitField } = require('discord.js');
const { removeGamenights } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'ungn',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?ungn @user number`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number. Usage: `j?ungn @user number`');
    }

    const total = removeGamenights(user.id, amount);
    message.reply(`↩️ Removed ${amount} gamenight(s) from ${user.username}. Total: **${total}**`);
  },
};
