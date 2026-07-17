const { PermissionsBitField } = require('discord.js');
const { removeLatestWarn } = require('../utils/warns');

module.exports = {
  data: {
    name: 'unwarn',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?unwarn @user`');
    }

    const remaining = removeLatestWarn(user.id);

    if (remaining === null) {
      return message.reply(`ℹ️ ${user.username} has no active warns to remove.`);
    }

    message.reply(`↩️ Removed a warn from ${user.username}. Active warns: **${remaining.length}**`);
  },
};
