const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'warnlogs.json');

function loadWarnLogConfig() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveWarnLogConfig(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function setWarnLogChannel(guildId, channelId) {
  const data = loadWarnLogConfig();
  data[guildId] = channelId;
  saveWarnLogConfig(data);
}

function getWarnLogChannel(guildId) {
  const data = loadWarnLogConfig();
  return data[guildId] || null;
}

module.exports = { loadWarnLogConfig, saveWarnLogConfig, setWarnLogChannel, getWarnLogChannel };
