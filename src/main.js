const path = require('path');
const spawn = require('child_process').spawn;

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const appMenu = require('./ui/menus/app-menu.js');
const Logger = require('./utils/logger.js')('main');
const Settings = require('./utils/settings.js');

const IS_DEV = process.execPath.indexOf('electron') > -1;
const LOBBY_URL = IS_DEV ? 'http://localhost:8000/' : 'https://lobby.webvr.rocks/';
let electronConnectClient;
let firefoxChild;
const qbrt = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'qbrt');

// TODO: Get this working later? Requires submit URL.
// require('crash-reporter').start();

let mainWindow = null;
let title = app.getName();
const WINDOW_DEFAULTS = {
  width: 800,
  height: 600
};
let WINDOW_STATE_KEY = 'lastMainWindowState';

if (IS_DEV) {
  title += ` [v${app.getVersion()}]`;
  electronConnectClient = require('electron-connect').client;
}

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  Settings.get(WINDOW_STATE_KEY, (err, data) => {
    let lastWindowsState = err && WINDOW_DEFAULTS || data;

    let firefoxQuitting = false;

    require('promise.prototype.finally').shim();

    let exitCode = 0;

    new Promise((resolve, reject) => {
      const outputRegex = /opened (.*) in new window/;
      firefoxChild = spawn('node', [qbrt, 'run', LOBBY_URL]);

      let totalOutput = '';
      firefoxChild.stdout.on('data', data => {
        const output = data.toString('utf8');
        totalOutput += output;
        console.log('[firefox] Child process output: %s', output.trim());
        if (outputRegex.test(totalOutput)) {
          console.log('[firefox] Child process opened');
        }
      });

      firefoxChild.stderr.on('data', data => {
        console.error('[firefox] Child process error: %s', data.toString('utf8').trim());
      });

      firefoxChild.on('exit', exitCode => {
        if (!outputRegex.test(totalOutput)) {
          console.error('[firefox] Child process failed to open');
        }

        if (process.platform === 'win32') {
          console.log('[firefox] Child process exited with "SIGINT"');
        } else {
          console.log('[firefox] Child process exited with success code "%s" (0)',
            exitCode);
        }
      });

      firefoxChild.on('close', exitCode => {
        console.log('[firefox] Child process exited with code "%s"', exitCode);
        resolve();
      });
    }).catch(error => {
      console.error('[firefox]', error);
      exitCode = 1;
    }).finally(() => {
      console.log('[firefox] Child process exited with code "%s"', exitCode);
      process.exit(exitCode);
    });

    mainWindow = new BrowserWindow({
      x: lastWindowsState.x,
      y: lastWindowsState.y,
      width: lastWindowsState.width,
      height: lastWindowsState.height,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true
    });

    mainWindow.loadURL(`file://${__dirname}/../../static/index.html`);

    if (electronConnectClient) {
      electronConnectClient.create(mainWindow);
    }

    mainWindow.on('closed', () => {
      firefoxChild.kill('SIGINT');
      firefoxQuitting = true;
      mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.setTitle(title);
      if (lastWindowsState.maximized) {
        mainWindow.maximize();
      }
    });

    mainWindow.on('focus', () => {
      mainWindow.flashFrame(false);
    });

    function preserveWindowState () {
      let currentWindowsState = mainWindow.getBounds();
      currentWindowsState.maximized = mainWindow.isMaximized();

      Settings.set(WINDOW_STATE_KEY, currentWindowsState, setErr => {
        if (setErr) {
          Logger.error('Failed to save last window state.');
          Logger.error(setErr);
        }
      });
    }

    mainWindow.on('move', preserveWindowState);
    mainWindow.on('resize', preserveWindowState);
    mainWindow.on('maximize', preserveWindowState);
    mainWindow.on('unmaximize', preserveWindowState);

    // Register main app menu.
    appMenu.register();
  });
});
