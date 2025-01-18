const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath);

function endWriting() {
  console.log('\nThis is the end!');
  process.exit();
}
console.log('Enter you text. For stop enter ctrl+c');
process.stdin.pipe(writableStream);
process.on('SIGINT', () => {
  endWriting();
});
process.stdin.on('data', (data) => {
  const text = data.toString().trim();
  if (text.endsWith('exit')) {
    endWriting();
  }
});
