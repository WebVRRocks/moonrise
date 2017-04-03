const BrowserWindow = require('electron').remote.BrowserWindow;

const UserStore = require('../../stores/user-store.js');
const Logger = require('../../utils/logger.js')('sc-window');
const urlHelper = require('../../utils/url-helper.js');
const Settings = require('../../utils/settings.js');

// Official Steam client uses this as its `User-Agent`.
const USER_AGENT = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; Valve Steam Client/1451445940; ) ' +  // eslint-disable-line no-unused-vars
                   'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.49 Safari/537.36';
const WINDOW_DEFAULTS = {
  width: 1024,
  height: 768
};
const WINDOW_STATE_KEY = 'lastSteamCommunityWindowState';
let win;

function open (url) {
  var cookies = UserStore.getWebSession().cookies;

  // If we don't have cookies, abort.
  if (!cookies.length) {
    Logger.debug('SteamCommunityWindow: cookies are missing');
    return;
  }

  if (win) {
    Logger.debug('SteamCommunityWindow: reusing existing instance');
    win.loadURL(url);
    return win;
  }

  Logger.debug('SteamCommunityWindow: creating new instance');

  Settings.get(WINDOW_STATE_KEY, function (err, data) {
    var lastWindowsState = err && WINDOW_DEFAULTS || data;

    win = new BrowserWindow({
      x: lastWindowsState.x,
      y: lastWindowsState.y,
      width: lastWindowsState.width,
      height: lastWindowsState.height,
      show: false,
      title: 'Loading…',
      webPreferences: {
        nodeIntegration: false,
        allowDisplayingInsecureContent: true,
        allowRunningInsecureContent: true
      },
      autoHideMenuBar: true
    });

    win.on('closed', () => {
      win = null;
    });

    win.webContents.on('new-window', (evt, newUrl) => {
      evt.preventDefault();

      if (urlHelper.isSteamUrl(newUrl)) {
        win.loadURL(newUrl);
      } else {
        urlHelper.openExternal(newUrl);
      }
    });

    win.webContents.on('did-finish-load', () => {
      if (lastWindowsState.maximized) {
        win.maximize();
      }
    });

    cookies.forEach(function (cookie) {
      var split = cookie.split('=');

      win.webContents.session.cookies.set({
        url : 'https://steamcommunity.com',
        name : split[0],
        value : split[1],
        session: split[0].indexOf('steamLogin') > -1,
        secure: split[0] === 'steamLoginSecure'
      }, function () {
      });

      win.webContents.session.cookies.set({
        url : 'https://store.steampowered.com',
        name : split[0],
        value : split[1],
        session: split[0].indexOf('steamLogin') > -1,
        secure: split[0] === 'steamLoginSecure'
      }, function () {
      });
    });

    function preserveWindowState () {
      var currentWindowsState = win.getBounds();
      currentWindowsState.maximized = win.isMaximized();

      Settings.set(WINDOW_STATE_KEY, currentWindowsState, setErr => {
        if (setErr) {
          Logger.error('Failed to save last window state.');
          Logger.error(setErr);
        }
      });
    }

    win.on('move', preserveWindowState);
    win.on('resize', preserveWindowState);
    win.on('maximize', preserveWindowState);
    win.on('unmaximize', preserveWindowState);

    win.loadURL(url);
    win.show();
  });
}

const SteamCommunityWindow = {
  open: open
};

module.exports = SteamCommunityWindow;
