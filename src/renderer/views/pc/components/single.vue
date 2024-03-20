<template>
  <div class="single">
    <div
      v-for="item in data"
      :key="item.studentId"
      class="student"
      @click="gotoEvaluate(item)"
    >
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
</template>
<script>
export default {
  name: "single",
  props: {
    data: Array,
  },
  data() {
    return {};
  },
  methods: {
    imgChange() {
      return require("../../../assets/img/boy.png");
    },
    gotoEvaluate(item) {
      this.$store.dispatch("pcStore/changeSingleStudentId", item.studentId);
      this.$router.push({
        path: "/pc-evaluate",
      });
    },
  },
};
</script>
<style scoped lang="scss">
.single {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 60px);
  justify-content: flex-start;
  .student {
    width: 100px;
    height: 148px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin: 0 45px 15px 0;
    cursor: pointer;
    position: relative;
    .avatar {
      width: 84px;
      height: 84px;
      background: url(../../../assets/pc/avatar_2.png) no-repeat center / cover;
      // background: #eaf7ff;
      // border-radius: 50%;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      font-weight: 600;
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
    .o_name {
      font-size: 50px;
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
</style>
