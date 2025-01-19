const fs = require('fs').promises;
const path = require('path');
const defaultFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function copyDir(defaultFolder, newFolder) {
  try {
    await fs.mkdir(newFolder, { recursive: true });
    const files = await fs.readdir(defaultFolder);
    for (const file of files) {
      const defaultFile = path.join(defaultFolder, file);
      const newFile = path.join(newFolder, file);

      const stat = await fs.stat(defaultFile);
      if (stat.isDirectory()) {
        await fs.mkdir(newFile, { recursive: true });
        await copyDir(defaultFile, newFile);
      } else {
        await fs.copyFile(defaultFile, newFile);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
copyDir(defaultFolder, newFolder);

module.exports = {
  copyDir,
};
