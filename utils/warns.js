const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'warns.json');
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function loadWarns() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveWarns(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addWarn(userId, reason) {
  const data = loadWarns();
  if (!data[userId]) data[userId] = [];

  data[userId].push({
    reason,
    issuedAt: Date.now(),
    expiresAt: Date.now() + TWO_WEEKS_MS,
  });

  saveWarns(data);
  return getActiveWarns(userId);
}

function removeLatestWarn(userId) {
  const data = loadWarns();
  const active = (data[userId] || []).filter(w => Date.now() < w.expiresAt);

  if (active.length === 0) {
    data[userId] = [];
    saveWarns(data);
    return null;
  }

  active.pop();
  data[userId] = active;
  saveWarns(data);
  return active;
}

function getActiveWarns(userId) {
  const data = loadWarns();
  const active = (data[userId] || []).filter(w => Date.now() < w.expiresAt);

  if (!data[userId] || data[userId].length !== active.length) {
    data[userId] = active;
    saveWarns(data);
  }

  return active;
}

module.exports = { loadWarns, saveWarns, addWarn, removeLatestWarn, getActiveWarns };
