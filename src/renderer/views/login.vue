<template>
  <div class="login">
    <p class="l_we">
      <span> {{ loginTitle }} </span>
    </p>
    <p class="l_title">
      {{
        ["xsxx", "lhxx", "zxxx"].includes(appName)
          ? `${appTitle}学生评价系统`
          : "评价系统"
      }}
    </p>
    <div class="login_form">
      <div class="l_ct">
        <van-tabs v-model="activeName" color="#1989fa" @change="onChangeTab">
          <van-tab title="班级登录" :name="2">
            <div v-if="['xsxx', 'lhxx', 'zxxx'].includes(appName)">
              <p class="l_label">班级</p>
              <p class="l_input">
                <input
                  placeholder="请选择班级"
                  v-model="className"
                  readonly
                  type="text"
                  @click="clickClass"
                />
              </p>
            </div>

            <p class="l_label">班级登录口令</p>
            <p class="l_input">
              <input
                :placeholder="placeholderText"
                v-model="passwordPc"
                type="password"
              />
            </p>

            <label for="ck" class="pwd_check"
              ><span class="checkBox" :class="checkWord ? 'active' : ''">
                <input id="ck" v-model="checkWord" type="checkbox" /></span
              >记住口令</label
            >
            <p class="l_btn" @click="loginPc">登录</p>
            <p class="l_btn" @click="checkupdateVersion">检测更新</p>
          </van-tab>
        </van-tabs>
      </div>

      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="classList"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        >
          <template #columns-top>
            <van-search
              v-model="searchValue"
              show-action
              placeholder="请输入搜索关键词"
              @search="getClassList"
            >
              <template #action>
                <div @click="getClassList">搜索</div>
              </template>
            </van-search>
          </template>
        </van-picker>
      </van-popup>
    </div>
    <div class="footer_link" v-if="['dcxx'].includes(appName)">
      <div>
        备案号：
        <a :href="beianLink" target="_blank">
          {{ filingNumber }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
import { getStorage, setStorage, delStorage } from "../common/common";
import { setCookies } from "../common/cookie.js";
import config from "../config";
export default {
  data() {
    return {
      checkPwd: true,
      phone: "17620464277",
      password: "464277",
      passwordPc: "",
      appTitle: config.title,
      loginTitle: config.loginTitle,
      appName: config.appName,
      activeName: 2,
      checkWord: true,
      showPicker: false,
      classId: "",
      className: "",
      classList: [], // 班级列表
      searchValue: "",
      filingNumber: config.filingNumber || "",
      beianLink: config.beianLink || "",
    };
  },
  components: {},
  mounted() {
    console.log(666666, config);
    if (getStorage("passwordPc")) {
      this.passwordPc = getStorage("passwordPc");
      this.checkWord = getStorage("usercheckWord");
      if (["xsxx", "lhxx", "zxxx"].includes(this.appName)) {
        this.classId = getStorage("classId");
        this.className = getStorage("className");
      }
    }
    if (
      ["xsxx", "lhxx", "zxxx"].includes(this.appName) &&
      this.activeName === 2
    ) {
      this.getClassList();
    }
  },
  // 请输入4位班级登录口令
  computed: {
    placeholderText() {
      return ["xsxx", "lhxx"].includes(this.appName)
        ? "请输入7位班级登录口令"
        : "请输入4位班级登录口令";
    },
  },
  filters: {},
  methods: {
    checkupdateVersion() {
      const { send } = window.electronApi;
      send("checkupdateVersion");
    },
    clickClass() {
      this.showPicker = true;
    },
    onConfirm(value) {
      console.log("value", value);
      this.classId = value.id;
      this.className = value.text;
      this.showPicker = false;
    },
    onChangeTab(name) {
      if (name === 2 && ["xsxx", "lhxx", "zxxx"].includes(this.appName)) {
        this.getClassList();
      }
    },
    getClassList() {
      Indicator.open();
      this.$ajax({
        method: "get",
        url: "classLoginList",
        params: {
          clazzName: this.searchValue,
        },
      }).then((res) => {
        Indicator.close();
        const { data } = res;
        if (data.code === "0000") {
          this.classList = data.data.map((item) => {
            return {
              id: item.id,
              text: item.clazzName,
            };
          });
        }
      });
    },
    loginPc() {
      if (!this.passwordPc) {
        Toast("口令不能为空！");
        return;
      }

      let payload = {
        passWord: this.passwordPc,
        loginType: ["xsxx", "lhxx", "zxxx"].includes(this.appName) ? 2 : 1,
      };
      if (["xsxx", "lhxx", "zxxx"].includes(this.appName)) {
        if (!this.classId) {
          Toast("班级不能为空！");
          return;
        }
        payload.id = this.classId;
      }
      Indicator.open();
      this.$ajax({
        method: "post",
        url: "loginPc",
        params: payload,
      }).then((res) => {
        Indicator.close();
        console.log("res", res.data);
        const { code, data, message } = res.data;
        if (code === "0000") {
          Toast("登录成功");
          if (this.checkWord) {
            setStorage("passwordPc", this.passwordPc);
            setStorage("usercheckWord", this.checkWord);
            if (["xsxx", "lhxx", "zxxx"].includes(this.appName)) {
              setStorage("className", this.className);
              setStorage("classId", this.classId);
            }
          } else {
            delStorage("passwordPc");
            if (["xsxx", "lhxx", "zxxx"].includes(this.appName)) {
              delStorage("classId");
              delStorage("className");
            }
          }
          this.$store.dispatch("pcStore/changeClassDetail", data);
          setCookies("token", data.TOKEN, 24 * 60 * 60);
          sessionStorage.setItem("token", res.data.data.TOKEN);
          this.$router.push("/pc");
        } else {
          Toast(message || "登录失败");
        }
      });
    },
  },
};
</script>
<style scoped>
@import "../assets/css/login.css";

.login_form {
  width: 320px;
  margin: 0 auto;
}

.l_btn {
  cursor: pointer;
}
.footer_link {
  z-index: 99;
}

/deep/ .van-tab__pane {
  margin-top: 10px;
}
</style>
