const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'host-activity.json');

function loadActivity() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveActivity(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function recordHost(userId) {
  const data = loadActivity();
  if (!data[userId]) data[userId] = {};
  data[userId].lastHosted = Date.now();
  saveActivity(data);
}

function initHoster(userId) {
  const data = loadActivity();
  if (!data[userId]) {
    data[userId] = { lastHosted: Date.now(), lastNotified: null };
    saveActivity(data);
  }
}

function getActivity(userId) {
  const data = loadActivity();
  return data[userId] || null;
}

function markNotified(userId) {
  const data = loadActivity();
  if (!data[userId]) data[userId] = {};
  data[userId].lastNotified = Date.now();
  saveActivity(data);
}

module.exports = { loadActivity, saveActivity, recordHost, initHoster, getActivity, markNotified };
