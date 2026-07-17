const { getElixir, costForGamenights, spendElixir } = require('../utils/elixir');
const { addGamenights } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'cashout',
  },
  execute(message, args) {
    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number of gamenights to cash out. Usage: `j?cashout <amount>`');
    }

    const cost = costForGamenights(amount);
    const balance = getElixir(message.author.id);

    if (balance < cost) {
      return message.reply(`❌ Not enough elixir. You have **${balance} 🍥**, but cashing out ${amount} gamenight(s) costs **${cost} 🍥**.`);
    }

    const remaining = spendElixir(message.author.id, cost);
    const newTotal = addGamenights(message.author.id, amount);

    message.reply(`✅ Cashed out **${amount} gamenight(s)** for **${cost} 🍥**. Remaining elixir: **${remaining} 🍥**. Total gamenights: **${newTotal}**`);
  },
};
