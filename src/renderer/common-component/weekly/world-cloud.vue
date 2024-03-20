<template>
  <div id="container" class="wordcloud-wrapper"></div>
</template>

<script>
export default {
  name: "WordCloudTest",
  props: {
    data: Array,
  },
  mounted() {},
  watch: {
    data: function () {
      this.rawCloud();
    },
  },
  methods: {
    rawCloud() {
      const dom = document.getElementById("container");
      const chart = this.$echarts.init(dom);
      console.log("chart1213", chart);
      chart.setOption({
        series: [
          {
            type: "wordCloud",
            data: this.data,
            shape: "diamond", // 词云图显示排列为什么形状，默认 circle，cardioid 心形，diamond 菱形
            left: "center",
            top: null,
            width: "100%",
            height: "100%",
            drawOutOfBound: true,
            right: null,
            bottom: null,
            sizeRange: [10, 20],
            rotationRange: [0, 0],
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              // Color can be a callback function or a color string
              color: function () {
                // Random color
                return (
                  "rgb(" +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(",") +
                  ")"
                );
              },
            },
            emphasis: {
              focus: "self",
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: "#333",
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 160px;
}
</style>
