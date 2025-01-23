const fs = require('fs').promises;
const path = require('path');
const defaultFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function clearDir(dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      await fs.unlink(filePath);
    } else if (stat.isDirectory()) {
      await clearDir(filePath);
      await fs.rmdir(filePath);
    }
  }
}

async function copyDir(defaultFolder, newFolder) {
  try {
    await fs.mkdir(newFolder, { recursive: true });
    await clearDir(newFolder);
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
  clearDir,
};
