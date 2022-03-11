/* eslint-disable import/no-unresolved */
const {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
// @ts-ignore
} = require('electron');
const path = require('path');

let show = 0;

function createWindow(width, height) {
  const win = new BrowserWindow({
    width: 650,
    height: 55,
    x: width * 0.5 - 325,
    y: height * 0.15,
    show: false,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    movable: false,
    alwaysOnTop: true,
    type: 'desktop',
    webPreferences: {
      devTools: false,
      scrollBounce: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('../dist/index.html');
  win.once('ready-to-show', () => {
    if (show) {
      win.show();
    }
  });
  return win;
}

app.whenReady().then(() => {
  app.dock.hide();
  const {
    size: {
      width,
      height,
    },
  } = screen.getPrimaryDisplay();
  const win = createWindow(width, height);
  // 注册一个 'CommandOrControl+Y' 快捷键监听器.
  globalShortcut.register('Ctrl+Space', () => {
    if (show) {
      show = 0;
      win.hide();
    } else {
      show = 1;
      win.show();
    }
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
