const { PermissionsBitField } = require('discord.js');
const { loadData, saveData } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'addhoster',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?addhoster @user`');
    }

    const data = loadData();
    if (data[user.id] !== undefined) {
      return message.reply(`ℹ️ ${user.username} is already on the leaderboard.`);
    }

    data[user.id] = 0;
    saveData(data);

    message.reply(`✅ ${user.username} has been added to the hoster leaderboard.`);
  },
};
