const { contextBridge, ipcRenderer, shell } = require('electron');
console.log(999999);
// 把 ipcRenderer 暴露给渲染进程
contextBridge.exposeInMainWorld('electronApi', {
  ipcRenderer,
  // 发送消息
  send: (channel, data) => {
    let validChannels = ["mouse-up", "move-suspend", "createSuspensionMenu", "suspensionWindowMove", "getFilePath", "downloadFile"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  //接收消息
  receive: (channel, func) => {
    let validChannels = ["replyFilePath"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    }
  },
  showItemInFolder: (url) => {
    shell.showItemInFolder(url)
  }


});