const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'setpfp',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    await message.reply('📸 Send the image, GIF, or custom emoji you want to use as the bot\'s new profile picture within **60 seconds**.');

    const filter = (m) => m.author.id === message.author.id;
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });

    if (collected.size === 0) {
      return message.channel.send('⌛ Timed out. No image received, profile picture was not changed.');
    }

    const reply = collected.first();
    let imageUrl = null;

    const attachment = reply.attachments.first();
    if (attachment) {
      imageUrl = attachment.url;
    } else {
      const customEmojiMatch = reply.content.match(/<a?:\w+:(\d+)>/);
      if (customEmojiMatch) {
        const emojiId = customEmojiMatch[1];
        const isAnimated = reply.content.startsWith('<a:');
        imageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`;
      } else if (/^https?:\/\/\S+\.(png|jpe?g|gif|webp)$/i.test(reply.content.trim())) {
        imageUrl = reply.content.trim();
      }
    }

    if (!imageUrl) {
      return message.channel.send('❌ That wasn\'t a valid image, GIF, custom emoji, or direct image link. Unicode emojis (like 😀) can\'t be used as an avatar. Try again with `j?setpfp`.');
    }

    try {
      await message.client.user.setAvatar(imageUrl);

      const embed = new EmbedBuilder()
        .setColor('#9B59B6')
        .setTitle('✅ Profile Picture Updated')
        .setDescription('The bot\'s avatar has been changed successfully.')
        .setThumbnail(imageUrl)
        .setFooter({ text: `Changed by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.channel.send(`❌ Failed to update avatar: ${err.message}. Discord limits avatar changes to a few times per hour, this might be why.`);
    }
  },
};
