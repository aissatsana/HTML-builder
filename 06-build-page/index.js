const fs = require('fs');
const path = require('path');
const { bundleCss } = require('../05-merge-styles/index.js');
const { copyDir } = require('../04-copy-directory/index.js');
const assetsFolder = path.join(__dirname, 'assets');
const styleFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');

async function clearDir(dir) {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isFile()) {
      await fs.promises.unlink(filePath);
    } else if (stat.isDirectory()) {
      await clearDir(filePath);
    }
  }
}

async function generateHTML() {
  let templateData = await fs.promises.readFile(templateFile, 'utf8');

  const componentFiles = await fs.promises.readdir(componentsFolder);
  for (const file of componentFiles) {
    const filePath = path.join(componentsFolder, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isFile() && path.extname(file) === '.html') {
      const component = path.basename(file, '.html');
      const tag = `{{${component}}}`;

      if (templateData.includes(tag)) {
        const componentData = await fs.promises.readFile(filePath, 'utf8');
        templateData = templateData.replace(tag, componentData);
      }
    }
  }
  await fs.promises.mkdir(distFolder, { recursive: true });
  await clearDir(distFolder);
  const distHTMLFile = path.join(distFolder, 'index.html');
  await fs.promises.writeFile(distHTMLFile, templateData, 'utf8');
}

async function buildPage() {
  await generateHTML();
  await copyDir(assetsFolder, distFolder);
  await bundleCss(styleFolder, distFolder);
}

buildPage();
