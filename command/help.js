module.exports = {
  data: {
    name: 'help',
  },
  execute(message) {
    const commandNames = [...message.client.commands.keys()].sort();

    const list = commandNames.map((name) => `  ${name}`).join('\n');

    const content =
      '```\n' +
      'No Category:\n' +
      `${list}\n\n` +
      'Type j?help command for more info on a command.\n' +
      '```';

    message.reply(content);
  },
};
