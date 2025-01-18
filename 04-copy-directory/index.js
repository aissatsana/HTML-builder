const fs = require('fs').promises;
const path = require('path');
const defaultFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    const copiedFiles = await fs.readdir(newFolder);
    for (const file of copiedFiles) {
      const filePath = path.join(newFolder, file);
      await fs.unlink(filePath);
    }

    await fs.mkdir(newFolder, { recursive: true });
    const files = await fs.readdir(defaultFolder);
    for (const file of files) {
      const defaultFile = path.join(defaultFolder, file);
      const newFile = path.join(newFolder, file);
      await fs.copyFile(defaultFile, newFile);
    }
  } catch (e) {
    console.error(e);
  }
}
copyDir();
