const { PermissionsBitField } = require('discord.js');
const { addWarn } = require('../utils/warns');

module.exports = {
  data: {
    name: 'warn',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?warn @user <reason>`');
    }
    if (!reason) {
      return message.reply('❌ You must provide a reason. Usage: `j?warn @user <reason>`');
    }

    const activeWarns = addWarn(user.id, reason);
    message.reply(`⚠️ ${user.username} has been warned. Reason: **${reason}**. Active warns: **${activeWarns.length}**`);
  },
};
