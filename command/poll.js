const { EmbedBuilder } = require('discord.js');

const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
  data: {
    name: 'poll',
  },
  async execute(message) {
    const raw = message.content.slice(message.content.indexOf(' ') + 1);
    const matches = [...raw.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

    if (matches.length < 3) {
      return message.reply('❌ You need a question and at least 2 answers, all in quotes. Usage: `j?poll "Question" "Answer 1" "Answer 2" ...` (up to 10 answers)');
    }

    const question = matches[0];
    const answers = matches.slice(1, 11);

    if (answers.length > 10) {
      return message.reply('❌ Maximum of 10 answers allowed.');
    }

    const optionsText = answers
      .map((answer, i) => `${NUMBER_EMOJIS[i]} ${answer}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle(`📊 ${question}`)
      .setDescription(optionsText)
      .setFooter({ text: `Poll started by ${message.author.username}` });

    const pollMessage = await message.channel.send({ embeds: [embed] });

    for (let i = 0; i < answers.length; i++) {
      await pollMessage.react(NUMBER_EMOJIS[i]);
    }
  },
};
