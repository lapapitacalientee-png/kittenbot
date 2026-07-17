const { getElixir, spendElixir } = require('../utils/elixir');
const { addCredits } = require('../utils/credits');

const ELIXIR_PER_CREDIT = 2;

module.exports = {
  data: {
    name: 'convert',
  },
  execute(message, args) {
    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid amount of elixir to convert. Usage: `j?convert <elixir amount>`');
    }

    const balance = getElixir(message.author.id);
    if (balance < amount) {
      return message.reply(`❌ You only have **${balance} 🍥**, but tried to convert ${amount}.`);
    }

    const credits = Math.floor(amount / ELIXIR_PER_CREDIT);
    if (credits <= 0) {
      return message.reply(`❌ You need at least ${ELIXIR_PER_CREDIT} elixir to get 1 credit.`);
    }

    const elixirUsed = credits * ELIXIR_PER_CREDIT;
    const remainingElixir = spendElixir(message.author.id, elixirUsed);
    const newCreditTotal = addCredits(message.author.id, credits);

    message.reply(`✅ Converted **${elixirUsed} 🍥** into **${credits} credit(s)**. Remaining elixir: **${remainingElixir} 🍥**. Total credits: **${newCreditTotal}**`);
  },
};
