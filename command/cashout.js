const { EmbedBuilder } = require('discord.js');
const { getElixir, costForGamenights, spendElixir } = require('../utils/elixir');
const { addGamenights } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'cashout',
  },
  execute(message, args) {
    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number of gamenights to cash out. Usage: `j?cashout <amount>`');
    }

    const cost = costForGamenights(amount);
    const balanceBefore = getElixir(message.author.id);

    if (balanceBefore < cost) {
      const embed = new EmbedBuilder()
        .setColor('#E74C3C')
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle('❌ Cashout Failed')
        .setDescription(`Not enough elixir to cash out **${amount} gamenight(s)**.`)
        .addFields(
          { name: 'Required', value: `${cost} 🍥`, inline: true },
          { name: 'Your Balance', value: `${balanceBefore} 🍥`, inline: true },
          { name: 'Missing', value: `${cost - balanceBefore} 🍥`, inline: true },
        )
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    const remaining = spendElixir(message.author.id, cost);
    const newGnTotal = addGamenights(message.author.id, amount);

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTitle('✅ Cashout Successful')
      .setDescription(`Exchanged **${cost} 🍥** for **${amount} gamenight(s)**.`)
      .addFields(
        { name: '🍥 Elixir Spent', value: `${cost}`, inline: true },
        { name: '🍥 Elixir Remaining', value: `${remaining}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '🎮 Gamenights Gained', value: `+${amount}`, inline: true },
        { name: '🎮 Total Gamenights', value: `${newGnTotal}`, inline: true },
      )
      .setFooter({ text: 'Rate 2.5 elixir per gamenight' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
