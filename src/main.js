const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const appMenu = require('./ui/menus/app-menu.js');
const Logger = require('./utils/logger.js')('main');
const Settings = require('./utils/settings.js');

let electronConnectClient;
const IS_DEV = process.execPath.indexOf('electron') > -1;

// TODO: Get this working later? Requires submit URL.
// require('crash-reporter').start();

let mainWindow = null;
let title = app.getName();
let WINDOW_STATE_KEY = 'lastMainWindowState';

if (IS_DEV) {
  title += ` [v${app.getVersion()}]`;
  electronConnectClient = require('electron-connect').client;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  Settings.get(WINDOW_STATE_KEY, (err, data) => {
    var lastWindowsState = err && {width: 800, height: 600} || data;

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
      var currentWindowsState = mainWindow.getBounds();
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
