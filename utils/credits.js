const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'credits.json');

function loadCredits() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveCredits(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addCredits(userId, amount) {
  const data = loadCredits();
  if (!data[userId]) data[userId] = [];
  data[userId].push({ amount, date: Date.now() });
  saveCredits(data);
  return getTotal(userId);
}

function removeCredits(userId, amount) {
  const data = loadCredits();
  if (!data[userId]) data[userId] = [];
  data[userId].push({ amount: -amount, date: Date.now() });
  saveCredits(data);
  return getTotal(userId);
}

function getTotal(userId) {
  const data = loadCredits();
  const history = data[userId] || [];
  return history.reduce((sum, entry) => sum + entry.amount, 0);
}

function getHistory(userId) {
  const data = loadCredits();
  return data[userId] || [];
}

module.exports = { loadCredits, saveCredits, addCredits, removeCredits, getTotal, getHistory };
