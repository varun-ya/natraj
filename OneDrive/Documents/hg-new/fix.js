const fs = require('fs');
const f = 'C:\\Users\\varun\\OneDrive\\Documents\\hg-new\\hg-app\\src\\app\\[role]\\dashboard\\search\\page.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\{",1"\}\{teacher\.price\}/g, '{"₹"}{teacher.price}');
c = c.replace(/\{",1"\}\{t\.price\}/g, '{"₹"}{t.price}');
fs.writeFileSync(f, c, 'utf8');
console.log('done');
