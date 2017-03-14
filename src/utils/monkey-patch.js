/**
 * Asar does not allow `process.chdir`, which is used by `steam-resources`.
 *
 * - https://github.com/scholtzm/punk/issues/22
 * - https://github.com/electron/electron/issues/8206
 */

const fs = require('fs');
const path = require('path');
const originalReadFileSync = fs.readFileSync;

let cwd = '';

const specialFiles = [
  'steammsg.steamd',
  'header.steamd',
  'emsg.steamd',
  'eresult.steamd',
  'enums.steamd',
  'netheader.steamd',
  'gamecoordinator.steamd'
];

process.chdir = newPath => {
  cwd = newPath;
};

fs.readFileSync = (filePath, ...args) => {
  let newPath = filePath;

  if (specialFiles.includes(filePath)) {
    newPath = path.join(cwd, filePath);
  }

  return originalReadFileSync(newPath, ...args);
};
