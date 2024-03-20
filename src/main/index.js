"use strict";
// "release": "cross-env GH_TOKEN=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 vue-cli-service electron:build --mode prod --win --x64"

import {
  dialog,
  app,
  protocol,
  BrowserWindow,
  Notification,
  Tray,
  Menu,
  nativeImage,
  screen,
  ipcMain,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
// 安装vuejs devtools插件。需要kexue上网才能安装成功
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";


const isDevelopment = process.env.NODE_ENV !== "production";
// const checkUpdate = require('./update')
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
const NOTIFICATION_TITLE = "通知";
const NOTIFICATION_SUBTITLE = "这是通知的副标题"; //mac 才有
const NOTIFICATION_BODY = "欢迎使用创智互联智能评价系统";

function showNotification() {
  new Notification({
    title: NOTIFICATION_TITLE,
    subtitle: NOTIFICATION_SUBTITLE,
    body: NOTIFICATION_BODY,
  }).show();
}

function checkUpdate() {
  win2.show();
  console.log('process', process);
  if (process.platform == 'darwin') {

    //我们使用koa-static将静态目录设置成了static文件夹，
    //所以访问http://127.0.0.1:9005/darwin，就相当于访问了static/darwin文件夹，win32同理
    autoUpdater.setFeedURL('http://127.0.0.1:9005/darwin')  //设置要检测更新的路径

  } else {
    autoUpdater.setFeedURL('http://127.0.0.1:9005/win32')
  }

  //检测更新
  autoUpdater.checkForUpdates()

  //监听'error'事件
  autoUpdater.on('error', (err) => {
    console.log(err)
  })

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    console.log('found new version')
  })

  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
        autoUpdater.quitAndInstall()
        app.quit()
      }
    })
  })
}



ipcMain.on('move-suspend', (e, args) => {
  if (win2) {
    const workAread = screen.getPrimaryDisplay().workArea
    // if (args.baseX < workAread.width - 100 && args.baseY < workAread.height - 100) {
    win2.setPosition(args.biasX, args.biasY)
    // }
  }
})
ipcMain.on('checkupdateVersion', () => {
  console.log('监听更新事件');
  checkUpdate()
})

ipcMain.on('mouse-up', (e, args) => {
  let isVisible = win.isVisible() //窗口是否可见
  let isNormal = win.isNormal() //窗口是否处于正常状态（未最大化，未最小化，不在全屏模式下）
  // 如果窗口不可见那就显示
  if (!isVisible) {
    win.show()
    win2.hide()
  }
  if (!isNormal) {
    win.show()
    win2.hide()

  }
})


// 主窗口
let win;

// session模块
// let ses;

// 创建圆形窗口函数
let win2 = null;



async function createSBallWindow() {
  win2 = new BrowserWindow({
    width: 80, //悬浮窗口的宽度 比实际DIV的宽度要多2px 因为有1px的边框
    height: 80, //悬浮窗口的高度 比实际DIV的高度要多2px 因为有1px的边框
    type: "toolbar", //创建的窗口类型为工具栏窗口
    frame: false, //无边框
    resizable: false, //禁止窗口大小缩放
    show: false, //先让窗口不显示
    webPreferences: {
      devTools: false, //关闭调试工具
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'), //通过预加载将electorn中的一些node的API挂载到Window对象上

    },
    transparent: true, //设置透明
    hasShadow: false, //不显示阴影
    alwaysOnTop: true, //窗口总是显示再其他窗口之前
    // backgroundColor: '#eee'
  });
  // 通过获取用户屏幕的宽高来设置悬浮球的初始位置
  const size = screen.getPrimaryDisplay().workAreaSize;
  // const winSize = win2.getSize();
  const winURL =
    isDevelopment
      ? `http://localhost:8080/#/ball`
      : `file://${__dirname}/index.html/#/ball`;
  win2.setPosition(size.width - 100, 100);
  win2.setSkipTaskbar(true) //任务栏不显示它
  win2.loadURL(winURL);

  win2.once("ready-to-show", () => {
  });
  win2.on("close", () => {
    win2 = null;
  });
}

//移动悬浮球
// ipcMain.on("suspensionWindowMove", (event, message) => {
//   console.log('suspensionWindowMove移动悬浮球');
//   win2.setPosition(message.x, message.y);
// });

// 主窗口
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: true, //无边框
    transparent: false, //透明窗口
    autoHideMenuBar: true,
    show: true,
    alwaysOnTop: false,
    minHeight: 800,
    minWidth: 1450,
    width: isDevelopment ? 1450 : screen.getPrimaryDisplay().workAreaSize.width,
    height: isDevelopment ? 800 : screen.getPrimaryDisplay().workAreaSize.height,
    fullscreen: false, //默认全屏
    simpleFullscreen: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), //通过预加载将electorn中的一些node的API挂载到Window对象上
      // webSecurity: false, // 跨域
      // nodeIntegration: true,
    },
  });
  // ses = win.webContents.session
  // console.log('getUserAgent', ses.getUserAgent());
  // // 设置代理
  // ses.setProxy({
  //   proxyRules: 'http=http://proxy-server:8080;https=http://proxy-server:8080'
  // }, () => {
  //   // 这是webwiew的代理

  // })
  const icon = nativeImage.createFromPath(__static + "/icons/logo.png");
  tray = new Tray(icon);
  // 注意:contextMenu Tooltip Title代码需要写在这里
  let contextMenu = Menu.buildFromTemplate([
    {
      label: "首页",
      click() {
        win.show();
      },
    },
    {
      id: "min2-window",
      label: `开启悬浮窗`,
      click() {
        win2.show();
      },
    },
    {
      id: "min2-window",
      label: `关闭悬浮窗`,
      click() {
        win2.hide();
      },
    },
    {
      label: "最小化",
      click() {
        win.hide();
      },
    },
    { label: "退出", role: "quit" },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("创智互联评价系统");
  tray.setTitle("这是标题");

  // 托盘图标被双击
  tray.on("double-click", () => {
    // 显示窗口
    win.show();
    // win2.hide()
  });

  // 窗口最小化
  win.on("minimize", (e) => {
    // 阻止最小化
    e.preventDefault();
    win.hide();
    // 开启悬浮窗
    win2.show();
  });

  // 避免开启多个客户端窗口
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  }


  // 监听窗口关闭事件
  win.on("close", (e) => {
    // 阻止窗口关闭,执行一些清理工作或弹出确认对话框
    e.preventDefault();
    // 做一些清理工作
    // ...
    // 弹出确认对话框
    let choice = dialog.showMessageBoxSync(win, {
      type: "info",
      buttons: ["最小化"],
      title: "确认关闭",
      message: "您确定要关闭当前窗口吗?",
    });
    if (choice === 0) {
      e.preventDefault();
      win.minimize(); //调用最小实例化方法
    } else {
      // 用户选择关闭窗口
      win = null;
      // app.quit() //不要用quit(),会弹两次确认框
      app.exit();
    }
  });

  win.loadFile("index.html");

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
let tray;

app.whenReady().then(() => {
  showNotification();

});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
let clearTimeFlag = 0;
app.on("win-show", () => {
  if (win) {
    win.setAlwaysOnTop(true);
    clearTimeout(clearTimeFlag);
    clearTimeFlag = setTimeout(() => {
      win.setAlwaysOnTop(false);
    }, 100);
    win.maximize()
    win.show();
    // if (win.isMaximized()) {
    //   win.unmaximize(); // 如果窗口已经最大化，则还原窗口大小
    // } else {
    //   win.maximize(); // 否则最大化窗口
    // }
  }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS);
  //   } catch (e) {
  //     console.error("Vue Devtools failed to install:", e.toString());
  //   }
  // }
  createWindow();
  // 创建球形窗口
  createSBallWindow();
  // checkUpdate(win, ipcMain)
  checkUpdate()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
