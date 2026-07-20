const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'searchmesh',
  },
  async execute(message, args) {
    const query = args.join(' ').trim();

    if (!query) {
      return message.reply('❌ You must provide a mesh name. Usage: `j?searchmesh <name>`');
    }

    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.roblox.com/catalog?Category=Meshes&Keyword=${encodedQuery}`;

    let resultsFound = null;
    let resultsCount = 0;

    try {
      const apiUrl = `https://catalog.roblox.com/v1/search/items/details?Category=13&Keyword=${encodedQuery}&Limit=10`;
      const response = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        resultsCount = data?.data?.length || 0;
        resultsFound = true;
      } else {
        resultsFound = false;
      }
    } catch (err) {
      resultsFound = false;
    }

    const embed = new EmbedBuilder()
      .setColor('#2980B9')
      .setTitle('🔎 Mesh Search')
      .setDescription(`Search results for: **${query}**`)
      .addFields({ name: '🔗 Search URL', value: searchUrl, inline: false });

    if (resultsFound && resultsCount > 0) {
      embed.addFields({ name: '✅ Detected', value: `Found approximately **${resultsCount}** matching result(s) on Roblox.`, inline: false });
    } else if (resultsFound === false) {
      embed.addFields({ name: 'ℹ️ Note', value: 'Could not verify results directly (Roblox may be blocking unauthenticated requests). Use the link above to check manually.', inline: false });
    } else {
      embed.addFields({ name: 'ℹ️ Note', value: 'No matching results detected — the link above may still work manually.', inline: false });
    }

    message.reply({ embeds: [embed] });
  },
};
