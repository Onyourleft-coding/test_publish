<template>
  <div id="myChart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "line-chart",
  props: {
    data: Array,
  },
  methods: {
    rawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
        legend: {
          data: ["Line 3"],
        },
        grid: {
          top: "15%",
          left: "0%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            boundaryGap: ["10%", "20%"],
          },
        ],
        yAxis: [
          {
            type: "value",
            data: [-10, 0, 10, 20, 30, 40, 50, 60],
          },
        ],
        series: [
          {
            name: "",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 5,
              color: "#6ECE51",
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#B2FF9E",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.data,
          },
        ],
      });
    },
  },
  mounted() {},
  watch: {
    data: function () {
      this.rawLine();
    },
  },
};
</script>

<style scoped>
#myChart {
  height: 180px;
}
</style>
