<template>
  <div class="pc-add-group">
    <van-row class="form">
      <van-col :span="6">
        <van-field v-model="groupName" label="输入组名：" />
      </van-col>
      <van-col :span="8">
        <div class="random-num">
          <van-field type="digit" v-model="randomNum" label="学生个数" />
          <van-button type="info" @click="getRandomArr">确认</van-button>
        </div>
      </van-col>
    </van-row>
    <van-checkbox-group v-model="checkObj" class="multiple" ref="checkboxGroup">
      <van-checkbox
        v-for="item in studentList"
        :key="item.id"
        :name="item.id"
        class="student"
        :class="checkObj.includes(item.id) ? 'actvie' : ''"
      >
        <div class="avatar">
          {{ item.studentKeyId }}
          <img
            v-if="false"
            :src="
              item.headUrl
                ? imgChange(item.headUrl)
                : require('../../assets/img/boy.png')
            "
            alt=""
          />
        </div>
        <div class="score">
          <div class="praise">{{ item.praise }}</div>
          <div class="tobeimproved">{{ item.tobeimproved }}</div>
        </div>
        <div class="user-name van-ellipsis">
          {{ item.studentName }}
        </div>
      </van-checkbox>
    </van-checkbox-group>
    <div class="btns">
      <div>
        <van-button type="info" @click="groupSubmit">提交</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { Dialog, Toast } from "vant";
export default {
  name: "pc-ad-group",
  data() {
    return {
      groupId: this.$route.query.groupId,
      studentList: [],
      classDetail: this.$store.state.pcStore.classDetail,
      groupName: "",
      randomNum: 1,
      checkObj: [],
    };
  },
  mounted() {
    this.getStudent();
    if (this.groupId) {
      this.getCheck();
    }
  },
  methods: {
    imgChange() {
      return require("../../assets/img/boy.png");
    },
    getStudent() {
      try {
        Indicator.open("加载中...");

        this.$ajax({
          method: "post",
          url: "student/clazzStudent",
          params: {
            clazzId: this.classDetail.clazzId,
            pageNum: 1,
            pageSize: 100,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.studentList = data.data;
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    async groupSubmit() {
      if (!this.groupName) {
        Toast.fail("请输入组名");
        return;
      }
      if (this.checkObj.length === 0) {
        Toast.fail("请选择添加学生！");
        return;
      }
      const confirm = await Dialog.confirm({
        title: "提示",
        message: "确认提交小组吗？",
      });
      if (confirm === "confirm") {
        this.$ajax({
          method: "post",
          url: this.groupId ? "studentGroup/update" : "studentGroup/add",
          params: {
            groupId: this.groupId,
            clazzId: this.classDetail.clazzId,
            studentIds: this.checkObj.join(","),
            clazzGroupName: this.groupName,
          },
        }).then(({ data }) => {
          if (data.code == "0000") {
            Toast.success(data.message);
            this.$router.back();
          }
        });
      }
    },
    getCheck() {
      this.$ajax({
        method: "post",
        url: "clazzGroup/detail",
        params: {
          groupId: this.groupId,
        },
      }).then(({ data }) => {
        if (data.code == "0000") {
          this.groupName = data.data[0].groupName;
          this.checkObj = data.data
            .filter((item) => item.selectFlag)
            .map((item) => item.studentId);
        }
      });
    },
    getRandomArr() {
      if (!this.randomNum) {
        Toast.fail("请输入大于0的数字");
        return;
      }
      const temp = new Array(); // temp存放生成的随机数组
      const arr = this.studentList.slice();
      for (var i = 0; i < this.randomNum; i++) {
        const num = Math.floor(Math.random() * arr.length); // 生成随机数num
        temp.push(arr[num]); // 获取arr[num]并放入temp
        arr.splice(num, 1);
      }
      this.checkObj = temp.map((item) => item.id);
    },
  },
  watch: {
    randomNum: function (newV) {
      if (this.groupId && this.studentList.length > 0) {
        if (newV > this.studentList.length) {
          Toast.fail("数量不能超过班级学生数量,请重新输入");
          this.randomNum = 1;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.pc-add-group {
  padding: 15px 35px;
  .form {
    display: flex;
    align-items: center;
    .random-num {
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-button {
        width: 100px;
        margin-left: 15px;
        height: 52px;
        font-size: 20px;
      }
    }
    .van-col {
      margin-right: 15px;
    }
    .van-field {
      font-size: 20px;
      padding: 15px;
    }
  }
  .multiple {
    height: 750px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0;
    width: calc(100% + 35px);
    align-content: flex-start;
    .actvie {
      border: 2px solid #1596fc;
      border-radius: 10px;
    }
    .student {
      width: 100px;
      height: 148px;
      margin: 0 45px 15px 0;
      cursor: pointer;
      /deep/ .van-checkbox__icon {
        display: none;
      }
      /deep/.van-checkbox {
        display: block;
        overflow: visible;
      }
      /deep/ .van-checkbox__label {
        margin-left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }
      .avatar {
        width: 84px;
        height: 84px;
        background: url(../../assets/pc/avatar_2.png) no-repeat center / cover;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: bold;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
      .score {
        display: flex;
        margin: 10px 0;
        .praise,
        .tobeimproved {
          width: 47px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        }
        .praise {
          background: #def2ff;
          color: #1596fc;
          border-radius: 10px 0 0 10px;
        }
        .tobeimproved {
          background: #ffeaea;
          color: #fa3636;
          border-radius: 0 10px 10px 0;
        }
      }
      .user-name {
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
  .btns {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%);

    div {
      .van-button {
        width: 340px;
        font-size: 20px;
        height: 60px;
        margin: 10px 0;
      }
    }
  }
}
</style>
