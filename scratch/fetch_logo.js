const http = require('http');

http.get('http://127.0.0.1:3002/api/produits?limit=1', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log(JSON.stringify(data['hydra:member'][0].logo, null, 2));
    } catch(e) {
      console.error('Parse error', e);
    }
  });
}).on('error', e => console.error(e));
