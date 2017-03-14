#!/usr/bin/env node

var path = require('path');

var packager = require('electron-packager');
var rimraf = require('rimraf');
var shell = require('shelljs');
var zip = require('bestzip');

var packageJson = require('./../package.json');

var productName = packageJson.productName;
var appVersion = packageJson.version;
var electronVersion = packageJson.dependencies.electron;
var outputFolder = 'package';

var platform = 'darwin';
var arch = 'x64';
var icon = 'resources/icon.icns';

if (process.argv[2] === '--win32') {
  platform = 'win32';
  arch = 'ia32';
  icon = 'resources/icon.ico';
} else if (process.argv[2] === '--win64') {
  platform = 'win64';
  arch = 'ia64';
  icon = 'resources/icon.ico';
}

var options = {
  asar: true,
  dir: '.',
  name: productName,
  overwrite: true,
  out: outputFolder,
  platform: platform,
  arch: arch,
  version: electronVersion,
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
    var appPath = appPaths[0];

    if (err) {
      console.log('electron-packager failed with the following error:');
      console.log(err);
      process.exit(1);
    } else {
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

  var zipName = `${productName}-v${appVersion}-mac.zip`;
  var appName = `${productName}.app`;
  var dittoCommand = `ditto -c -k --sequesterRsrc --keepParent ${appName} ${zipName}`;

  shell.exec(dittoCommand, exitCode => {
    console.log('Ditto command exit code:', exitCode);
  });
}

function createWindowsPackage () {
  process.chdir(path.join('.', outputFolder));

  var folderName = `${productName}-${platform}-${arch}`;
  var appName = `${productName}-v${appVersion}-${platform}`;
  var zipName = `${appName}.zip`;

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
