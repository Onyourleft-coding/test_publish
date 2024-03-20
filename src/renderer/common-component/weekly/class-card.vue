<template>
  <div class="class-card">
    <div class="card-header">
      <img
        class="card-point"
        :style="{ '--width': `${width}px`, '--height': `${height}px` }"
        :src="require(`../../assets/icon/${icon}.png`)"
        alt=""
      />
      <div class="card-title">
        {{ title }}
      </div>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "class-card.vue",
  props: {
    title: String,
    icon: String,
    width: Number,
    height: Number,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.class-card {
  background: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 12px;
  padding: 15px 10px;
  box-shadow: 0 0 12px 0 rgba(93, 133, 181, 0.3);
}
.card-header {
  display: flex;
  align-items: center;
  /*height: 30px;*/
}
.card-point {
  display: block;

  width: var(--width);
  height: var(--height);
  margin-right: 5px;
}
.card-title {
  font-size: 17px;
  color: #00071a;
  font-weight: 700;
}
</style>
