const { EmbedBuilder } = require('discord.js');
const { askGemini } = require('../utils/gemini');
const { getUsage, incrementUsage, getCooldown, DAILY_LIMIT } = require('../utils/aiLimit');

const SYSTEM_PROMPT = `You are an assistant that suggests historical roleplay (RP) hosting ideas for a Discord roleplay server. 
When asked what to host, suggest a historical event, era, or war (e.g. World War 2, the Roman Empire, the Cold War, etc.) and briefly explain why it would make a fun RP. 
Always answer in English. Keep answers concise, under 100 words.`;

module.exports = {
  data: {
    name: 'whatrp',
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
      return message.reply('❌ You must ask a question. Usage: `j?whatrp <question>`');
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
        .setColor('#8E44AD')
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle('🎖️ RP Suggestion')
        .setDescription(answer)
        .setFooter({ text: `${remaining}/${DAILY_LIMIT} AI questions remaining today` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply(`❌ AI request failed: ${err.message}`);
    }
  },
};
