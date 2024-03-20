<template>
  <div class="multiple-list">
    <div class="operation">
      <van-checkbox v-model="checkAll" @change="handleCheckAll">
        全选
      </van-checkbox>
      <van-checkbox v-model="unCheckAll" @change="handleUnCheckAll">
        反选
      </van-checkbox>
      <div>已选（{{ checkObj.length }}）</div>
      <div
        v-show="checkObj.length > 0"
        style="color: red; cursor: pointer"
        @click="resetCheck"
      >
        清除已选
      </div>
    </div>

    <van-checkbox-group v-model="checkObj" class="multiple" ref="checkboxGroup">
      <van-checkbox
        v-for="item in data"
        :key="item.studentId"
        :name="item.studentId"
        class="student"
        :class="checkObj.includes(item.studentId) ? 'actvie' : ''"
      >
        <div class="avatar">
          {{ item.studentKeyId }}
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
      </van-checkbox>
    </van-checkbox-group>
    <div class="btns">
      <div>
        <van-button type="info" @click="gotoEvaluate">立即点评</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "single",
  props: {
    data: Array,
  },
  data() {
    return {
      checkObj: this.$store.state.pcStore.checkObj || [],
      checkAll: false,
      unCheckAll: false,
    };
  },
  methods: {
    resetCheck() {
      this.checkObj = [];
      this.$store.dispatch("pcStore/changeCheckObj", []);
    },
    imgChange() {
      return require("../../../assets/img/boy.png");
    },
    handleCheckAll(checked) {
      this.$refs.checkboxGroup.toggleAll(checked);
    },
    handleUnCheckAll() {
      this.$refs.checkboxGroup.toggleAll();
    },
    gotoEvaluate() {
      if (this.checkObj.length === 0) {
        Toast.fail("请选择学生！");
        return;
      }
      this.$store.dispatch(
        "pcStore/changeSingleStudentId",
        this.checkObj.join(",")
      );
      this.$router.push({
        path: "/pc-evaluate",
      });
    },
  },
  watch: {
    checkObj: {
      handler(newValue) {
        this.$store.dispatch("pcStore/changeCheckObj", newValue);
      },
    },
    "$store.state.pcStore.headTeacher": {
      handler() {
        this.$store.dispatch("pcStore/changeCheckObj", []);
        this.$store.dispatch("pcStore/changeSingleStudentId", "");
        this.checkObj = [];
      },
    },
  },
};
</script>
<style scoped lang="scss">
.multiple-list {
  position: relative;
  .operation {
    display: flex;
    margin-bottom: 30px;
    font-size: 22px;
    color: #1596fc;
  }
  .van-checkbox {
    margin-right: 20px;
  }
  .multiple {
    height: 650px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
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
      position: relative;
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
        padding: 11px 8px;
      }
      .avatar {
        width: 84px;
        height: 84px;
        background: url(../../../assets/pc/avatar_2.png) no-repeat center /
          cover;
        background-size: 100% 100%;
        // background: #eaf7ff;
        // border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: 600;
        line-height: 50px;
        color: #000;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
      .score {
        display: flex;
        margin: -10px 0 10px 0;

        .praise,
        .tobeimproved {
          width: 44px;
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
          margin-right: 2px;
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
      .o_name {
        font-size: 30px;
        font-weight: bold;
        color: #333333;
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .o_transform {
          position: absolute;
          left: 50%;
          top: 70%;
          transform: translate(-50%, -50%);
        }
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
