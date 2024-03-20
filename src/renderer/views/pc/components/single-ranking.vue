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
    gotoEvaluate() {
      // this.$store.dispatch("pcStore/changeSingleStudentId", item.studentId);
      // this.$router.push({
      //   path: "/pc-evaluate",
      // });
    },
  },
};
</script>
<style scoped lang="scss">
.single {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 60px);
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
      background: url(../../../assets/pc/avatar_2.png) no-repeat center / cover;
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
</style>
