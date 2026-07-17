const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'ratings.json');

function loadRatings() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}');
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveRatings(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addRating(userId, stars) {
  const data = loadRatings();
  if (!data[userId]) data[userId] = [];
  data[userId].push(stars);
  saveRatings(data);
  return getAverage(userId);
}

function getAverage(userId) {
  const data = loadRatings();
  const ratings = data[userId] || [];
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    average: sum / ratings.length,
    count: ratings.length,
  };
}

module.exports = { loadRatings, saveRatings, addRating, getAverage };
