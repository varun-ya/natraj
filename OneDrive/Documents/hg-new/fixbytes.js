const fs = require('fs');
const f = 'C:\\Users\\varun\\OneDrive\\Documents\\hg-new\\hg-app\\src\\app\\[role]\\dashboard\\search\\page.tsx';

// Read as buffer to fix byte-level corruption
let buf = fs.readFileSync(f);

// The corrupted rupee is e2 20 1a b9 (4 bytes) or e2 80 1a b9
// Correct rupee UTF-8 is e2 82 b9 (3 bytes)
// Find and replace the corrupted sequence
const corrupted = Buffer.from([0xe2, 0x20, 0x1a, 0xb9]);
const correct   = Buffer.from('₹', 'utf8'); // e2 82 b9

let hex = buf.toString('hex');
// corrupted as hex: e2201ab9
hex = hex.split('e2201ab9').join('e282b9');
// also try e2801ab9
hex = hex.split('e2801ab9').join('e282b9');

const fixed = Buffer.from(hex, 'hex');
fs.writeFileSync(f, fixed);
console.log('done, replacements made');
