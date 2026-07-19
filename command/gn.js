const { PermissionsBitField } = require('discord.js');
const { addGamenights } = require('../utils/gamenights');
const { recordHost } = require('../utils/hostActivity');

module.exports = {
  data: {
    name: 'gn',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?gn @user number`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number. Usage: `j?gn @user number`');
    }

    const total = addGamenights(user.id, amount);
    recordHost(user.id);

    message.reply(`✅ Added ${amount} gamenight(s) to ${user.username}. Total: **${total}**`);
    message.channel.send(`💡 If you attended this gamenight, remember you can rate it with \`j?rate @${user.username} <0-10>\`!`);
  },
};
