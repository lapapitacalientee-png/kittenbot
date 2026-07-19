const { EmbedBuilder } = require('discord.js');
const { loadData } = require('./gamenights');
const { getActivity, markNotified } = require('./hostActivity');

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

async function checkInactiveHosters(client) {
  const gnData = loadData();
  const hosterIds = Object.keys(gnData);

  for (const id of hosterIds) {
    const activity = getActivity(id);
    if (!activity || !activity.lastHosted) continue;

    const inactiveFor = Date.now() - activity.lastHosted;
    if (inactiveFor < THREE_DAYS_MS) continue;

    if (activity.lastNotified && Date.now() - activity.lastNotified < THREE_DAYS_MS) continue;

    try {
      const user = await client.users.fetch(id);
      const days = Math.floor(inactiveFor / (24 * 60 * 60 * 1000));

      const embed = new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('⏰ Hosting Reminder')
        .setDescription(
          `You haven't hosted a gamenight in **${days} day(s)**.\n` +
          `Keep your hosting activity up to stay in good standing as a Hoster.`
        )
        .setTimestamp();

      await user.send({ embeds: [embed] });
      markNotified(id);
    } catch (err) {
      console.log(`Could not DM inactive hoster ${id}: ${err.message}`);
    }
  }
}

module.exports = { checkInactiveHosters };
