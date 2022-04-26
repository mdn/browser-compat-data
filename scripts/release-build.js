import { promises as fs } from 'node:fs';
import path from 'node:path';

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md', 'index.d.ts', 'types.d.ts'];

// Returns a string representing data ready for writing to JSON file
async function createDataBundle() {
  const { default: bcd } = await import('../index.js');
  const string = JSON.stringify(bcd);
  return string;
}

// Returns a promise for writing the data to JSON file
async function writeData(data) {
  const dest = path.resolve(directory, 'data.json');
  await fs.writeFile(dest, data);
}

async function writeIndexCJS() {
  const dest = path.resolve(directory, 'index.cjs');
  const content = `module.exports = require("./data.json");\n`;
  await fs.writeFile(dest, content);
}

async function writeIndexJS(data) {
  const dest = path.resolve(directory, 'index.js');
  const content = `export default ${data};\n`;
  await fs.writeFile(dest, content);
}

// Returns an array of promises for copying of all files that don't need transformation
async function copyFiles() {
  for (const file of verbatimFiles) {
    const src = path.join('./', file);
    const dest = path.join(directory, file);
    await fs.copyFile(src, dest);
  }
}

async function createManifest() {
  const packageJSONRaw = await fs.readFile(
    new URL('../package.json', import.meta.url),
    'utf-8',
  );
  const full = JSON.parse(packageJSONRaw);
  const minimal = {
    main: 'index.cjs',
    exports: { import: './index.js', require: './index.cjs' },
    type: 'module',
  };

  const minimalKeys = [
    'name',
    'version',
    'description',
    'repository',
    'keywords',
    'author',
    'license',
    'bugs',
    'homepage',
    'types',
  ];

  for (const key of minimalKeys) {
    if (key in full) {
      minimal[key] = full[key];
    } else {
      throw `Could not create a complete manifest! ${key} is missing!`;
    }
  }
  return JSON.stringify(minimal);
}

async function writeManifest() {
  const dest = path.resolve(directory, 'package.json');
  const manifest = await createManifest();
  await fs.writeFile(dest, manifest);
}

async function main() {
  // Remove existing files, if there are any
  await fs
    .rm(directory, {
      force: true,
      recursive: true,
    })
    .catch((e) => {
      // Missing folder is not an issue since we wanted to delete it anyway
      if (e.code !== 'ENOENT') throw e;
    });

  // Crate a new directory
  await fs.mkdir(directory);

  const data = await createDataBundle();

  await writeManifest();
  await writeData(data);
  await writeIndexCJS();
  await writeIndexJS(data);
  await copyFiles();

  console.log('Data bundle is ready');
}

await main();
