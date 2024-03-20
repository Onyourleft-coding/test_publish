<template>
  <div class="coin-ranking">
    <div v-for="item in data" :key="item.studentId" class="student">
      <div class="avatar">{{ item.remainAmount }}个</div>
      <div class="user-name van-ellipsis">
        {{ item.studentName }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "coin-ranking",
  props: {
    data: { require: true, type: Array, default: () => [] },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.coin-ranking {
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
      font-size: 25px;
      font-weight: bold;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
    }
    .user-name {
      font-weight: bold;
      font-size: 22px;
    }
  }
}
</style>
