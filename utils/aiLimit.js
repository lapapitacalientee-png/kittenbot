const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'ai-limit.json');
const DAILY_LIMIT = 90;

function loadLimits() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveLimits(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsage(userId) {
  const data = loadLimits();
  const entry = data[userId];
  const today = todayKey();

  if (!entry || entry.date !== today) {
    return { used: 0, remaining: DAILY_LIMIT };
  }

  return { used: entry.count, remaining: DAILY_LIMIT - entry.count };
}

function incrementUsage(userId) {
  const data = loadLimits();
  const today = todayKey();

  if (!data[userId] || data[userId].date !== today) {
    data[userId] = { date: today, count: 1 };
  } else {
    data[userId].count++;
  }

  saveLimits(data);
  return DAILY_LIMIT - data[userId].count;
}

module.exports = { getUsage, incrementUsage, DAILY_LIMIT };
