const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'elixir.json');
const RATE_PER_GN = 2.5;

function loadElixir() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveElixir(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addElixir(userId, amount) {
  const data = loadElixir();
  data[userId] = (data[userId] || 0) + amount;
  saveElixir(data);
  return data[userId];
}

function getElixir(userId) {
  const data = loadElixir();
  return data[userId] || 0;
}

function costForGamenights(amount) {
  return Math.floor(amount * RATE_PER_GN);
}

function spendElixir(userId, cost) {
  const data = loadElixir();
  data[userId] = (data[userId] || 0) - cost;
  saveElixir(data);
  return data[userId];
}

module.exports = { loadElixir, saveElixir, addElixir, getElixir, costForGamenights, spendElixir };
