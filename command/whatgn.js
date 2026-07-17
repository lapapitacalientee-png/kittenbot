const { EmbedBuilder } = require('discord.js');
const { askGemini } = require('../utils/gemini');
const { getUsage, incrementUsage, getCooldown, DAILY_LIMIT } = require('../utils/aiLimit');

const SYSTEM_PROMPT = `You are an assistant that suggests what Roblox game to host a gamenight (GN) in for a Discord server.
You must ONLY suggest games from this approved list, never anything outside it:

Current approved Roblox games:
- LOCOfficial!
- LAST TO LEAVE CIRCLE
- Ink Games
- Plate of Fates Remastered
- Rise of Nations
- MM2
- Naval Warfare
- Doomspire Brickbattles
- Guess the drawing!
- Word Bomb
- Super Bomb Survival
- Gold Frenzy
- item asylum

Non Roblox Approved Games:
- Among Us
- Fortnite

If someone has a game to suggest that isn't on this list, tell them to go suggest it in the suggestions channel.
Always answer in English. Keep answers concise, under 100 words.`;

module.exports = {
  data: {
    name: 'whatgn',
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
      return message.reply('❌ You must ask a question. Usage: `j?whatgn <question>`');
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
        .setColor('#16A085')
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle('🎮 GN Suggestion')
        .setDescription(answer)
        .setFooter({ text: `${remaining}/${DAILY_LIMIT} AI questions remaining today` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply(`❌ AI request failed: ${err.message}`);
    }
  },
};
