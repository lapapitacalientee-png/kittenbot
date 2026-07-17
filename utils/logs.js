const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'logs.json');

function loadLogConfig() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveLogConfig(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function setLogChannel(guildId, channelId) {
  const data = loadLogConfig();
  data[guildId] = channelId;
  saveLogConfig(data);
}

function getLogChannel(guildId) {
  const data = loadLogConfig();
  return data[guildId] || null;
}

module.exports = { loadLogConfig, saveLogConfig, setLogChannel, getLogChannel };
