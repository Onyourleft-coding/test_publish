<template>
  <div class="student-evaluate">
    <van-sticky :offset-top="80">
      <div class="subject">
        <div
          v-for="item in rankingTypeList"
          :key="item.value"
          class="sub-item"
          @click="handleRanking(item)"
          :class="activeRanking === item.value ? 'active' : ''"
        >
          <div class="name">{{ item.label }}</div>
        </div>
      </div>
    </van-sticky>

    <div class="components">
      <single-ranking
        v-if="![13, 14].includes(activeRanking)"
        :data="studentList"
      />
      <acquireCoinRanking
        v-else-if="[13].includes(activeRanking)"
        :data="dataList"
      />
      <coinRanking
        v-else-if="[14].includes(activeRanking)"
        :data="studentList"
      />
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import singleRanking from "./components/single-ranking.vue";
import coinRanking from "./components/coin-ranking.vue";
import acquireCoinRanking from "./components/acquire-coin-ranking.vue";

export default {
  name: "pc-ranking-list",
  data() {
    return {
      activeRanking: 1,
      rankingTypeList: [
        { label: "按总分排序", value: 1 },
        { label: "表扬分数排序", value: 2 },
        { label: "待改进分数排序", value: 3 },
        { label: "学年总分排序", value: 11 },
        { label: "学期总分排序", value: 10 },
        { label: "双周排名排序", value: 12 },
        { label: "上周总分排序", value: 9 },
        { label: "本周总分排序", value: 4 },
        { label: "本周表扬分数排序", value: 5 },
        { label: "本周待改进分数排序", value: 6 },
        { label: "本周进步排序", value: 7 },
        { label: "上周获币排行", value: 13 },
        { label: "奖励币余额排行", value: 14 },
      ],
      tabs: [
        { label: "个人", value: 1 },
        { label: "多人", value: 2 },
        { label: "小组", value: 3 },
        { label: "随机", value: 4 },
        { label: "撤销", value: 5 },
      ],
      pageNum: 1,
      studentName: "",
      evaluateType: this.$store.state.pcStore.evaluateType,
      studentList: [],
      classDetail: this.$store.state.pcStore.classDetail,
      dataList: {},
    };
  },
  components: { singleRanking, coinRanking, acquireCoinRanking },
  mounted() {
    this.getData();
  },
  methods: {
    async handleRanking(item) {
      this.activeRanking = item.value;
      if ([13, 14].includes(item.value)) {
        await this.getCoinRanking();
        return;
      }
      this.getData();
    },
    async getCoinRanking() {
      try {
        Indicator.open("加载中...");
        const { data } = await this.$ajax({
          method: "get",
          url: "parent/commont/rewardCoinsRankingList",
          params: {
            type: this.activeRanking === 13 ? 1 : 2,
            clazzId: this.classDetail.clazzId,
            pageNum: this.pageNum,
            pageSize: 100,
          },
        });
        if (data.code === "0000") {
          if (this.activeRanking === 13) {
            this.dataList = data.data;
          } else {
            this.studentList = data.data;
          }
        }
        Indicator.close();
      } catch (error) {
        Indicator.close();
      }
    },
    getData() {
      try {
        Indicator.open("加载中...");
        this.$ajax({
          method: "post",
          url: "parent/commont/statistics",
          params: {
            type: this.activeRanking,
            flag: this.activeRanking === 1 ? "1" : "",
            clazzId: this.classDetail.clazzId,
            pageNum: this.pageNum,
            pageSize: 100,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.studentList = data.dataList || [];
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.student-evaluate {
  box-sizing: border-box;
  .subject {
    display: flex;
    background: #1596fc;
    padding: 15px 35px;
    flex-wrap: wrap;
    .sub-item {
      text-align: center;
      margin: 5px;
      padding: 9px 25px;
      background: #1188e5;
      border: 1px solid #43acff;
      border-radius: 6px;
      box-shadow: 0px 0px 6px 0px rgba(57, 98, 203, 0.5),
        0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      margin-right: 23px;
      cursor: pointer;
      .name {
        margin-bottom: 5px;
        color: #10fff1;
        font-size: 22px;
      }
      .teacher-name {
        color: #ffffff;
        font-size: 18px;
      }
    }
    .active {
      background: #ffb800;
      box-shadow: 0px 0px 6px 0px rgba(57, 98, 203, 0.5),
        0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      .name {
        color: #fff;
      }
    }
    .sub-item:nth-last-child(1) {
      margin-right: 0;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 35px;
    background: #fff;
    height: 75px;
    .tabs {
      width: 50vw;
      /deep/ .van-tab {
        font-size: 22px;
        font-weight: bold;
      }
    }
    /deep/ .van-search .van-cell {
      padding: 10px 8px 10px 0;
      line-height: 28px;
      font-size: 20px;
    }
  }
  .components {
    padding: 15px 35px;
    height: 850px;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
  }
}
</style>
