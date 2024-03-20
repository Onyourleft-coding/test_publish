const path = require("path");
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  runtimeCompiler: true,
  publicPath: "./",
  chainWebpack: (config) => {
    // 由于我们修改了渲染进程目录，修改'@'的alias
    config.resolve.alias.set("@", resolve("src/renderer"));
  },
  configureWebpack: {
    // plugins: [new NodePolyfillPlugin()]
  },
  pages: {
    index: {
      entry: "src/renderer/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "vue-cli-electron",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    // loader: 'src/loader/main.js' // 多页loader页
  },
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.js",
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
      mainProcessFile: "src/main/index.js", // 主进程入口文件
      mainProcessWatch: ["src/main"], // 检测主进程文件在更改时将重新编译主进程并重新启动
      // builderOptions是electron的打包配置:(参考=>https://www.electron.build/configuration/configuration)
      builderOptions: {
        appId: process.env.VUE_APP_APPID,
        productName: process.env.VUE_APP_PRODUCTNAME,
        // 本来electron的name及version是读取package.json里面的值的,这里使用extraMetadata把这两个值注入进package.json
        extraMetadata: {
          name: process.env.VUE_APP_APPID.split(".").pop(),
          version: process.env.VUE_APP_VERSION,
        },

        asar: true,
        // directories: {
        //   output: "dist_electron",
        //   buildResources: "build",
        //   app: "dist_electron/bundled",
        // },
        // files: [
        //   {
        //     filter: ["main.js", "preload.js", "./dist"],
        //   },
        // ],
        extends: null,
        electronVersion: "11.3.0",
        extraResources: [],
        electronDownload: {
          mirror: "https://npmmirror.com/mirrors/electron/",
        },
        dmg: {
          contents: [
            {
              type: "link",
              path: "/Applications",
              x: 410,
              y: 150,
            },
            {
              type: "file",
              x: 130,
              y: 150,
            },
          ],
        },
        mac: {
          icon: "public/icons/icon.icns",
        },
        nsis: {
          oneClick: false, //是否创建一键安装程序或辅助
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
          installerIcon: "public/icons/icon.ico", // 安装时的图标
          uninstallerIcon: "public/icons/icon.ico",
          installerHeaderIcon: "public/icons/icon.ico",
          createDesktopShortcut: true, //是否创建桌面快捷方式
          createStartMenuShortcut: true, //是否创建开始菜单快捷方式
          perMachine: true,
          warningsAsErrors: false,
        },
        win: {
          target: "nsis",
          icon: "public/icons/icon.ico",
          requestedExecutionLevel: "highestAvailable",
        },
        linux: {
          icon: "public/icons",
        },
        publish: [
          'github'
        ]
        // publish: {
        //   // provider: "generic",
        //   // url: 'http://127.0.0.1:9005/'
        //   // url: "http://www.dcxxpj.com",
        // },
      },
    },
  },
};
