const fs = require('fs').promises;
const path = require('path');
const { bundleCss } = require('../05-merge-styles/index.js');
const { copyDir, clearDir } = require('../04-copy-directory/index.js');
const styleFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(distFolder, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const distHTMLFile = path.join(distFolder, 'index.html');
const componentsFolder = path.join(__dirname, 'components');

async function generateHTML() {
  let templateData = await fs.readFile(templateFile, 'utf8');

  const componentFiles = await fs.readdir(componentsFolder);
  for (const file of componentFiles) {
    const filePath = path.join(componentsFolder, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile() && path.extname(file) === '.html') {
      const component = path.basename(file, '.html');
      const tag = `{{${component}}}`;

      if (templateData.includes(tag)) {
        const componentData = await fs.readFile(filePath, 'utf8');
        templateData = templateData.replace(tag, componentData);
      }
    }
  }
  await fs.mkdir(distFolder, { recursive: true });
  await clearDir(distFolder);
  await fs.mkdir(distAssetsFolder, { recursive: true });
  await fs.writeFile(distHTMLFile, templateData, 'utf8');
}

async function buildPage() {
  await generateHTML();
  await copyDir(assetsFolder, distAssetsFolder);
  await bundleCss(styleFolder, distFolder, 'style');
}

buildPage();
