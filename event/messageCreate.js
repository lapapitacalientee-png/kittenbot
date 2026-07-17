const PREFIX = 'j?';

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName);
    if (!command) return;

    command.execute(message, args);
  },
};
