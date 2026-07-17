const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'gamenights.json');

function loadData() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addGamenights(userId, amount) {
  const data = loadData();
  data[userId] = (data[userId] || 0) + amount;
  saveData(data);
  return data[userId];
}

function removeGamenights(userId, amount) {
  const data = loadData();
  const current = data[userId] || 0;
  data[userId] = Math.max(0, current - amount);
  saveData(data);
  return data[userId];
}

module.exports = { loadData, saveData, addGamenights, removeGamenights };
