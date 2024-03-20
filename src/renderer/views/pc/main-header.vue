<template>
  <div class="main-header">
    <div class="header-left">
      <div class="title">{{ loginTitle }}学生评价系统</div>
      <div class="menu">
        <div
          v-for="item in menuList"
          :key="item.path"
          class="menu-item"
          :class="$store.state.pcStore.menuPath === item.path ? 'active' : ''"
          @click="handleChangeMenu(item)"
        >
          {{ item.meta.title }}
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="clazz">
        {{ classDetail.gradeName }}{{ classDetail.className }}
      </div>
      <div class="logout" @click="logout">
        <van-icon name="manager" style="margin-right: 10px" />
        <div>退出</div>
      </div>
      <div class="logout" @click="handleFullScreen">
        <van-icon name="enlarge" style="margin-right: 10px" />
        <div>{{ fullscreen ? "退出全屏" : "全屏" }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import pcRouter from "@/router/pc";
import config from "../../config";
import { Dialog, Toast } from "vant";
import { removeCookies } from "../../common/cookie.js";
export default {
  name: "main-header",
  data() {
    return {
      loginTitle: config.loginTitle,
      menuList: [],
      fullscreen: false,
      classDetail: this.$store.state.pcStore.classDetail,
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    getMenuList() {
      this.menuList = pcRouter.children.filter((item) => !item.meta.hiddenMenu);
    },
    handleChangeMenu(item) {
      this.$store.dispatch("pcStore/changeMenuPath", item.path);
      this.$router.push({
        path: item.path,
      });
    },
    logout() {
      Dialog.confirm({ title: "提示", message: "确定退出登录?" })
        .then(() => {
          this.$ajax({
            method: "post",
            url: "logout",
          }).then(({ data }) => {
            if (data.code == "0000") {
              sessionStorage.clear();
              localStorage.clear();
              this.$store.dispatch("pcStore/resetPcStore");
              removeCookies("token");
              Toast.success("退出成功");
              this.$router.push({ path: "/" });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="scss">
.main-header {
  height: 80px;
  background: #1596fc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0 35px;
  .header-left {
    display: flex;
    align-items: center;
    .title {
      font-size: 30px;
      margin-right: 15px;
    }
    .menu {
      display: flex;
      align-items: center;
      // padding-left: 50px;
      .menu-item {
        padding: 25px 0;
        font-size: 22px;
        cursor: pointer;
        margin: 0 50px;
      }
      .active {
        font-weight: bold;
        border-bottom: 4px solid #fff;
      }
    }
  }
  .right-box {
    display: flex;
    align-items: center;
    font-size: 20px;
    .logout {
      display: flex;
      align-items: center;
      border-left: 1px solid #fff;
      padding: 0 15px;
      cursor: pointer;
    }
    .clazz {
      padding-right: 15px;
    }
  }
}
</style>
