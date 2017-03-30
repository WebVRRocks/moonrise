#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');

const packager = require('electron-packager');
const rimraf = require('rimraf');
const shell = require('shelljs');
const zip = require('bestzip');

const packageJson = require('./../package.json');

const productName = packageJson.productName;
const appVersion = packageJson.version;
const electronVersion = packageJson.dependencies.electron;
const outputFolder = 'releases';

let platform = 'darwin';
let arch = 'x64';
let icon = 'resources/icon.icns';

if (process.argv[2] === '--win32') {
  platform = 'win32';
  arch = 'ia32';
  icon = 'resources/icon.ico';
} else if (process.argv[2] === '--win64') {
  platform = 'win64';
  icon = 'resources/icon.ico';
}

const options = {
  asar: true,
  dir: '.',
  name: productName,
  overwrite: true,
  out: outputFolder,
  platform: platform,
  arch: arch,
  electronVersion: electronVersion,
  prune: true,
  icon: icon,
  ignore: [
    '/src($|/)',
    '/scripts($|/)',
    '/style($|/)'
  ]
};

rimraf(path.join('.', outputFolder), removeErr => {
  if (removeErr) {
    console.log('Failed to remove files');
    console.log(removeErr);
    process.exit(1);
  }

  packager(options, (err, appPaths) => {
    if (err) {
      console.log('electron-packager failed with the following error:');
      console.log(err);
      process.exit(1);
    } else {
      var appPath = appPaths[0];

      console.log('electron-packager finished packaging ' + productName);
      console.log('App path: %s', appPath);
      console.log('Platform: %s', platform);
      console.log('Arch: %s', arch);

      if (platform === 'darwin') {
        createMacPackage(appPath);
      } else if (platform === 'win32') {
        createWindowsPackage();
      }
    }
  });
});

function createMacPackage (appPath) {
  process.chdir(path.join('.', appPath));

  const zipName = `${productName}-v${appVersion}-mac.zip`;
  const appName = `${productName}.app`;
  const dittoCommand = `ditto -c -k --sequesterRsrc --keepParent ${appName} ${zipName}`;

  shell.exec(dittoCommand, exitCode => {
    console.log('Ditto command exit code:', exitCode);
  });
}

function createWindowsPackage () {
  process.chdir(path.join('.', outputFolder));

  const folderName = `${productName}-${platform}-${arch}`;
  const appName = `${productName}-v${appVersion}-${platform}`;
  const zipName = `${appName}.zip`;

  shell.exec(`mv ${folderName} ${appName}`, renameExitCode => {
    console.log('Rename exit code:', renameExitCode);

    zip(zipName, appName, err => {
      if (err) {
        console.error('Could not compress "%s%s"', folderName, zipName);
        console.error(err.stack);
        process.exit(1);
      } else {
        console.log('Successfully compressed "%s" to "%s"', folderName, zipName);
      }
    });
  });
}
