const { EmbedBuilder } = require('discord.js');
const { setAfk } = require('../utils/afk');

module.exports = {
  data: {
    name: 'afk',
  },
  execute(message, args) {
    const reason = args.join(' ') || 'No reason given';

    setAfk(message.author.id, reason);

    const embed = new EmbedBuilder()
      .setColor('#95A5A6')
      .setAuthor({ name: `${message.author.username} • Now AFK`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTitle('🌙 Gone AFK')
      .setDescription(`${message.author} stepped away for a bit. Anyone who mentions or replies to them will be gently reminded.`)
      .addFields({ name: '📝 Reason', value: reason, inline: false })
      .setFooter({ text: 'Send any message to come back and clear your AFK status' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
