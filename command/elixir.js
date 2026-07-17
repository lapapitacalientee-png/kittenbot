const { PermissionsBitField } = require('discord.js');
const { addElixir } = require('../utils/elixir');

module.exports = {
  data: {
    name: 'elixir',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?elixir @user <amount>`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid amount. Usage: `j?elixir @user <amount>`');
    }

    const total = addElixir(user.id, amount);
    message.reply(`🍥 Added ${amount} elixir to ${user.username}. Total: **${total} 🍥**`);
  },
};
