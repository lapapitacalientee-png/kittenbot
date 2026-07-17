const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'ai-limit.json');
const DAILY_LIMIT = 90;
const COOLDOWN_MS = 5 * 60 * 1000;

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

function getCooldown(userId) {
  const data = loadLimits();
  const entry = data[userId];

  if (!entry || !entry.lastUsed) {
    return { onCooldown: false, remainingMs: 0 };
  }

  const elapsed = Date.now() - entry.lastUsed;
  if (elapsed >= COOLDOWN_MS) {
    return { onCooldown: false, remainingMs: 0 };
  }

  return { onCooldown: true, remainingMs: COOLDOWN_MS - elapsed };
}

function incrementUsage(userId) {
  const data = loadLimits();
  const today = todayKey();

  if (!data[userId] || data[userId].date !== today) {
    data[userId] = { date: today, count: 1, lastUsed: Date.now() };
  } else {
    data[userId].count++;
    data[userId].lastUsed = Date.now();
  }

  saveLimits(data);
  return DAILY_LIMIT - data[userId].count;
}

module.exports = { getUsage, incrementUsage, getCooldown, DAILY_LIMIT, COOLDOWN_MS };
