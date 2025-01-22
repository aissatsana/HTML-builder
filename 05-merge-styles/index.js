const fs = require('fs');
const path = require('path');
const styleFolder = path.join(__dirname, 'styles');
const bundleFolder = path.join(__dirname, 'project-dist');

async function bundleCss(styleFolder, bundleFolder, name) {
  try {
    const styles = [];
    const cssFiles = await fs.promises.readdir(styleFolder);
    for (const file of cssFiles) {
      const filePath = path.join(styleFolder, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile() && path.extname(filePath) === '.css') {
        const data = await fs.promises.readFile(filePath, 'utf8');
        styles.push(data);
      }
    }
    const bundleFile = path.join(bundleFolder, name + '.css');

    try {
      await fs.promises.stat(bundleFile);
      await fs.promises.unlink(bundleFile);
    } catch (e) {}

    const writableStream = fs.createWriteStream(bundleFile);
    for (const style of styles) {
      writableStream.write(style + '\n');
    }
    writableStream.end();
  } catch (e) {
    console.error(e);
  }
}
bundleCss(styleFolder, bundleFolder, 'bundle');

module.exports = {
  bundleCss,
};
