const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'addrole',
  },
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?addrole <role name> @user`');
    }

    const roleName = args.filter((a) => !/^<@!?\d+>$/.test(a)).join(' ').trim();
    if (!roleName) {
      return message.reply('❌ You must provide a role name. Usage: `j?addrole <role name> @user`');
    }

    const role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());

    if (!role) {
      return message.reply(`❌ No role named "${roleName}" exists in this server. Create it manually first in Server Settings → Roles.`);
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply('❌ Could not find that member in this server.');
    }

    try {
      await member.roles.add(role);
    } catch (err) {
      return message.reply(`❌ Failed to assign role: ${err.message} (make sure the bot's role is above "${role.name}" in the role list)`);
    }

    const embed = new EmbedBuilder()
      .setColor(role.hexColor || '#3498DB')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('✅ Role Added')
      .setDescription(`${user} has been given the **${role.name}** role.`)
      .setFooter({ text: `Assigned by ${message.author.username}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
