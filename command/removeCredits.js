const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getTotal, removeCredits } = require('../utils/credits');

module.exports = {
  data: {
    name: 'removecredits',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?removeCredits @user <amount>`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid amount. Usage: `j?removeCredits @user <amount>`');
    }

    const before = getTotal(user.id);
    const removed = Math.min(amount, before);
    const remaining = removeCredits(user.id, removed);

    const embed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('💳 Credits Removed')
      .setDescription(`Removed **${removed} credit(s)** from ${user}.`)
      .addFields({ name: 'New Balance', value: `${remaining} credits`, inline: true })
      .setFooter({ text: `Removed by ${message.author.username}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
