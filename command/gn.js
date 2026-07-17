const { addGamenights } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'gn',
  },
  execute(message, args) {
    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `!gn @user number`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number. Usage: `!gn @user number`');
    }

    const total = addGamenights(user.id, amount);
    message.reply(`✅ Added ${amount} gamenight(s) to ${user.username}. Total: **${total}**`);
  },
};
