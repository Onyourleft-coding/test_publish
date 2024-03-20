<template>
  <van-nav-bar
    :title="$store.state.NavTitle.navTitle"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
</template>
<script>
export default {
  name: "nav-bar",
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
  },
};
</script>
<style scoped lang="scss">
/deep/.van-nav-bar__left {
  font-size: 20px;
}
/deep/ .van-nav-bar__arrow {
  font-size: 20px;
}
/deep/ .van-nav-bar__title {
  font-size: 22px;
  font-weight: bold;
}
</style>
