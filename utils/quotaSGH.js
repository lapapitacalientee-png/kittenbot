const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'quota-sgh.json');

function loadQuotaSGH() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify({ active: false }));
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveQuotaSGH(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = { loadQuotaSGH, saveQuotaSGH };
