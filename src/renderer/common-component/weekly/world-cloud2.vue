<template>
  <div id="container2" class="wordcloud-wrapper"></div>
</template>

<script>
export default {
  name: "WordCloudTest",
  props: {
    data: Array,
  },
  mounted() {
    // this.rawCloud()
  },
  watch: {
    data: function () {
      this.rawCloud();
    },
  },
  methods: {
    rawCloud() {
      const dom = document.getElementById("container2");
      const chart = this.$echarts.init(dom);
      console.log("chart1213", chart, this.data);
      chart.setOption({
        series: [
          {
            type: "wordCloud",
            data: this.data,
            shape: "diamond", // 词云图显示排列为什么形状，默认 circle，cardioid 心形，diamond 菱形
            left: "center",
            top: 0,
            width: "100%",
            height: "100%",
            sizeRange: [10, 20],
            rotationRange: [0, 0],
            drawOutOfBound: true,
            right: null,
            bottom: null,
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
#container2 {
  height: 160px;
  width: 100%;
}
</style>
