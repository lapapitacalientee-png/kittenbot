const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getElixir, spendElixir } = require('../utils/elixir');

module.exports = {
  data: {
    name: 'removeelixir',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?removeElixir @user <amount>`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid amount. Usage: `j?removeElixir @user <amount>`');
    }

    const before = getElixir(user.id);
    const removed = Math.min(amount, before);
    const remaining = spendElixir(user.id, removed);

    const embed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('🍥 Elixir Removed')
      .setDescription(`Removed **${removed} 🍥** from ${user}.`)
      .addFields({ name: 'New Balance', value: `${remaining} 🍥`, inline: true })
      .setFooter({ text: `Removed by ${message.author.username}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
