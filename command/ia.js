const { EmbedBuilder } = require('discord.js');
const { askGemini } = require('../utils/gemini');
const { getUsage, incrementUsage, getCooldown, DAILY_LIMIT } = require('../utils/aiLimit');

const SYSTEM_PROMPT = `You are a helpful general-purpose assistant for a Discord roleplay hosting server. Answer questions clearly and concisely.`;

module.exports = {
  data: {
    name: 'ia',
  },
  async execute(message, args) {
    const cooldown = getCooldown(message.author.id);
    if (cooldown.onCooldown) {
      const secondsLeft = Math.ceil(cooldown.remainingMs / 1000);
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      return message.reply(`⏳ You're on cooldown. Try again in **${minutes}m ${seconds}s**.`);
    }

    const question = args.join(' ');
    if (!question) {
      return message.reply('❌ You must ask a question. Usage: `j?IA <question>`');
    }

    const usage = getUsage(message.author.id);
    if (usage.remaining <= 0) {
      return message.reply(`❌ You've reached your daily limit of ${DAILY_LIMIT} AI questions. Try again tomorrow.`);
    }

    await message.channel.sendTyping();

    try {
      const answer = await askGemini(SYSTEM_PROMPT, question);
      const remaining = incrementUsage(message.author.id);

      const embed = new EmbedBuilder()
        .setColor('#2C3E50')
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle('🤖 AI Response')
        .setDescription(answer)
        .setFooter({ text: `${remaining}/${DAILY_LIMIT} AI questions remaining today` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply(`❌ AI request failed: ${err.message}`);
    }
  },
};
