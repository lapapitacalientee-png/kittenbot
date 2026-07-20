const { EmbedBuilder } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_MS = 30 * 1000;

module.exports = {
  data: {
    name: 'searchmesh',
  },
  async execute(message, args) {
    const lastUsed = cooldowns.get(message.author.id);
    if (lastUsed && Date.now() - lastUsed < COOLDOWN_MS) {
      const secondsLeft = Math.ceil((COOLDOWN_MS - (Date.now() - lastUsed)) / 1000);
      return message.reply(`⏳ You're on cooldown. Try again in **${secondsLeft}s**.`);
    }

    const query = args.join(' ').trim();

    if (!query) {
      return message.reply('❌ You must provide a mesh name. Usage: `j?searchmesh <name>`');
    }

    cooldowns.set(message.author.id, Date.now());

    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://create.roblox.com/store/category/3d/meshparts?keyword=${encodedQuery}`;

    const embed = new EmbedBuilder()
      .setColor('#2980B9')
      .setTitle('🔎 Mesh Search')
      .setDescription(`Search results for: **${query}**`)
      .addFields({ name: '🔗 Search URL', value: searchUrl, inline: false })
      .setFooter({ text: 'Opens the Roblox Creator Store filtered to Mesh Parts' });

    message.reply({ embeds: [embed] });
  },
};
