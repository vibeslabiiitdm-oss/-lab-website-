const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GROQ_API_KEY=(.*)/);
if (match) {
  fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': 'Bearer ' + match[1].trim() }
  })
  .then(res => res.json())
  .then(data => {
    if (data.data) {
      console.log(data.data.map(m => m.id).filter(id => id.includes('vision') || id.includes('3.2')).join('\n'));
    } else {
      console.log(data);
    }
  });
}
