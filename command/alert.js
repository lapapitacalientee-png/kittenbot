const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'alert',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?alert @user`');
    }

    const dmEmbed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setTitle('⚠️ Hoster Activity Alert')
      .setDescription(
        `Hey! This is a reminder that you're currently registered as a **Hoster**.\n\n` +
        `We haven't seen any recent gamenight activity from you. If you don't host in the coming days, you risk being **demoted** from your hoster role.\n\n` +
        `If you're going through something or need time off, use \`j?break\` (ask an admin) instead of going silent — we're happy to work with you.`
      )
      .setFooter({ text: `Sent by ${message.author.username}` })
      .setTimestamp();

    try {
      await user.send({ embeds: [dmEmbed] });

      const successEmbed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle('✅ Alert Sent')
        .setDescription(`${user} has been DM'd an activity alert.`)
        .setFooter({ text: `Sent by ${message.author.username}` })
        .setTimestamp();

      message.reply({ embeds: [successEmbed] });
    } catch (err) {
      const failEmbed = new EmbedBuilder()
        .setColor('#E74C3C')
        .setTitle('❌ Failed to Send Alert')
        .setDescription(`Could not DM ${user} — they likely have DMs disabled.`)
        .setTimestamp();

      message.reply({ embeds: [failEmbed] });
    }
  },
};
