const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '/secret-folder');

async function readFolder() {
  try {
    const files = await fs.readdir(filePath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(filePath, file.name);
      if (file.isFile()) {
        const fileStats = await fs.stat(fullPath);
        const fileName = path.parse(file.name).name;
        const fileExt = path.parse(file.name).ext.slice(1);
        console.log(
          `${fileName} - ${fileExt} - ${(fileStats.size / 1024).toFixed(3)}kb`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
readFolder();
