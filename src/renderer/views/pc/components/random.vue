<template>
  <div class="random">
    <div class="cla_random" v-if="randomFlag">
      <div class="title">请选择人数</div>
      <div class="cla_num">
        <div class="cal_btn" @click="minus">-</div>
        <div class="random-num">{{ randomNum }}</div>
        <div class="cal_btn" @click="addNum">+</div>
      </div>
    </div>
    <div class="single" v-else>
      <div v-for="item in randomArr" :key="item.studentId" class="student">
        <div class="avatar">
          {{ item.studentKeyId }}
          <img
            v-if="false"
            :src="
              item.headUrl
                ? imgChange(item.headUrl)
                : require('../../../assets/img/boy.png')
            "
            alt=""
          />
        </div>
        <div class="score">
          <div class="praise">{{ item.praise }}</div>
          <div class="tobeimproved">{{ item.tobeimproved }}</div>
        </div>
        <div class="user-name van-ellipsis">
          {{ item.student_name }}
        </div>
        <div class="o_name">
          <span
            class="o_transform animate__animated animate__fadeOutUp animate__slower"
            :style="{ color: item.creditType === 1 ? 'green' : 'red' }"
            v-if="item.creditType && item.creditNum"
          >
            {{ item.creditType === 1 ? "+" : "-" }}{{ item.creditNum }}
          </span>
        </div>
      </div>
    </div>
    <div class="btns">
      <div>
        <van-button
          v-if="!randomFlag"
          type="info"
          @click="randomFlag = !randomFlag"
        >
          取消
        </van-button>
        <van-button v-if="randomFlag" type="info" @click="getRandomArr">
          开始抽选
        </van-button>
        <van-button v-if="!randomFlag" type="info" @click="gotoEvaluate">
          立即点评
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "random",
  props: {
    data: Array,
  },
  data() {
    return {
      randomNum: 1,
      randomArr: [],
      randomFlag: true,
    };
  },
  methods: {
    imgChange() {
      return require("../../../assets/img/boy.png");
    },
    minus() {
      if (this.randomNum === 1) {
        Toast.fail("人数不能小于1");
        return;
      }
      this.randomNum--;
    },
    addNum() {
      if (this.randomNum === this.data.length) {
        Toast.fail("人数不能大于班级总人数");
        return;
      }
      this.randomNum++;
    },
    getRandomArr() {
      let temp = new Array(); // temp存放生成的随机数组
      const arr = this.data.slice();
      for (let i = 0; i < this.randomNum; i++) {
        const num = Math.floor(Math.random() * arr.length); // 生成随机数num
        temp.push(arr[num]); // 获取arr[num]并放入temp
        arr.splice(num, 1);
      }
      this.randomArr = temp;
      this.randomFlag = false;
    },
    gotoEvaluate() {
      const studentId = this.randomArr.map((item) => item.studentId);
      if (studentId.length === 0) {
        Toast.fail("请随机抽选学生！");
        return;
      }
      this.$store.dispatch(
        "pcStore/changeSingleStudentId",
        studentId.join(",")
      );
      this.$router.push({
        path: "/pc-evaluate",
      });
    },
  },
};
</script>
<style scoped lang="scss">
.random {
  height: 100%;
  box-sizing: border-box;
  .cla_random {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    padding-top: 10%;
    .title {
      font-size: 32px;
      margin: 15px 0;
    }
    .cla_num {
      font-size: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      .cal_btn {
        border: 2px solid #1596fc;
        border-radius: 50%;
      }
      .cal_btn,
      .random-num {
        cursor: pointer;
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
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
        margin: 10px 5px;
      }
    }
  }
  .single {
    display: flex;
    flex-wrap: wrap;
    height: 600px;
    overflow-y: auto;
    width: calc(100% + 35px);
    align-content: flex-start;
    .student {
      width: 100px;
      height: 148px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      margin: 0 45px 15px 0;
      cursor: pointer;
      .avatar {
        width: 84px;
        height: 84px;
        background: url(../../../assets/pc/avatar_2.png) no-repeat center /
          cover;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: bold;
        line-height: 50px;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
      .score {
        display: flex;
        margin-top: -20px;

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
          margin-right: 2px;

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
}
</style>
