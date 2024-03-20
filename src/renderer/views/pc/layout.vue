<template>
  <div class="layout">
    <van-sticky>
      <mainHeader />
      <navBar v-if="$route.meta.navBar" />
    </van-sticky>
    <div class="page">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>
<script>
import mainHeader from "./main-header.vue";
import navBar from "./components/nav-bar.vue";
export default {
  name: "layout",
  data() {
    return {};
  },
  components: { mainHeader, navBar },
  mounted() {},
  methods: {},
};
</script>
<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  background: #f1f1ff;
}
.page {
  overflow-y: hidden;
}
</style>
