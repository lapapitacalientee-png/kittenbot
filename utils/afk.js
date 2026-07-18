const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'afk.json');

function loadAfk() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveAfk(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function setAfk(userId, reason) {
  const data = loadAfk();
  data[userId] = { reason, since: Date.now() };
  saveAfk(data);
}

function getAfk(userId) {
  const data = loadAfk();
  return data[userId] || null;
}

function removeAfk(userId) {
  const data = loadAfk();
  if (!data[userId]) return null;
  const entry = data[userId];
  delete data[userId];
  saveAfk(data);
  return entry;
}

module.exports = { loadAfk, saveAfk, setAfk, getAfk, removeAfk };
