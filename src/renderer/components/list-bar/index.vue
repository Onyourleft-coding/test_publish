<template>
  <div class="list-container">
    <template v-if="emptyLoading">
      <div class="loading">
        <van-loading vertical type="spinner" color="#2c9af1" size="40px">
          数据加载中...
        </van-loading>
      </div>
    </template>
    <van-pull-refresh
      v-if="length"
      v-model="refreshing"
      success-text="刷新成功"
      @refresh="onRefresh"
      :disabled="disabled"
    >
      <van-list
        v-model="loading"
        @load="onLoadMore"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
      >
        <slot />
      </van-list>
    </van-pull-refresh>
    <van-empty v-else description="暂无数据" />
  </div>
</template>
<script type="es6">
export default {
  name: 'app',
  props: {
    total: { require: true, type: Number, default: 0 },
    length: { require: true, type: Number, default: -1 },
    emptyLoading: { require: true, type: Boolean, default: false },
    disabled: { require: false, type: Boolean, default: false }
  },
  data () {
    return {
      loading: false, // 上滑列表加载（每一次上滑的时候）
      refreshing: false // 下拉刷新加载动画
    }
  },
  computed: {
    finished () {
      return this.length >= this.total // 上滑列表加载完了所有数据（没有更多了）
    }
  },
  methods: {
    onLoadMore () {
      this.loading = true
      this.$emit('loadMore')
    },
    onRefresh () {
      this.loading = true
      this.$emit('refresh')
      this.refreshing = false
    }
  },
  watch: {
    length: function () {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  padding-top: 20px;
}
</style>
