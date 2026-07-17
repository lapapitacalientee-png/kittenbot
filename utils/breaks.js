const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'breaks.json');

function loadBreaks() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveBreaks(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function setBreak(userId, endsAt) {
  const data = loadBreaks();
  data[userId] = endsAt;
  saveBreaks(data);
}

function removeBreak(userId) {
  const data = loadBreaks();
  delete data[userId];
  saveBreaks(data);
}

function getBreak(userId) {
  const data = loadBreaks();
  const endsAt = data[userId];
  if (!endsAt) return null;

  if (Date.now() >= endsAt) {
    removeBreak(userId);
    return null;
  }

  return endsAt;
}

module.exports = { loadBreaks, saveBreaks, setBreak, removeBreak, getBreak };
