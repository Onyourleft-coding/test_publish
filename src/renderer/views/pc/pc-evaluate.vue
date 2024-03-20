<template>
  <div class="pc-evaluate" v-if="targetList.length > 0">
    <div
      v-for="item in targetList"
      :key="item.id"
      class="evaluate"
      :class="`${
        ['dcxx', 'lhxx', 'hbq', 'zxxx'].includes(appName)
          ? `bgColor${item.parentId}`
          : `bg${item.parentId}`
      }`"
      @click="gotoThirdTarget(item)"
    >
      <p class="evaluate-name">{{ item.evaluateName }}</p>
    </div>
  </div>
  <van-empty
    v-else
    description="暂无数据"
    style="background: #fff; margin: 15px 0"
  />
</template>
<script>
import { Indicator } from "mint-ui";
import config from "../../config";
export default {
  name: "pc-evaluate",
  data() {
    return {
      targetList: [],
      appName: config.appName,
      headTeacher: this.$store.state.pcStore.headTeacher,
    };
  },
  mounted() {
    this.getTarget();
  },
  methods: {
    getTarget() {
      try {
        Indicator.open("加载中...");

        this.$ajax({
          method: "post",
          url: "evaluate/target/querySecondList",
          params: {
            supportTeacher: this.headTeacher.subjectId === 0 ? 1 : 0,
            teacherId:
              this.headTeacher.teacherId || this.headTeacher.headTeacherId,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.targetList = data.data || [];
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    gotoThirdTarget(item) {
      this.$router.push({
        path: "/pc-third-target",
        query: {
          parentId: item.id,
          evaluateName: item.evaluateName,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .van-empty__image {
  width: 30%;
  height: 45%;
}
/deep/ .van-empty__description {
  font-size: 30px;
}
.pc-evaluate {
  padding: 15px 35px;
  display: flex;
  flex-wrap: wrap;
  .evaluate {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 150px;
    margin: 0 15px 15px 0;
    cursor: pointer;
    font-size: 25px;
    font-weight: bold;
  }
  .bg1 {
    background: url(../../assets/nimg/icon-德.png);
    background-size: 100% 100%;
  }
  .bg2 {
    background: url(../../assets/nimg/icon-智.png);
    background-size: 100% 100%;
  }
  .bg3 {
    background: url(../../assets/nimg/icon-体.png);
    background-size: 100% 100%;
  }
  .bg4 {
    background: url(../../assets/nimg/icon-美.png);
    background-size: 100% 100%;
  }
  .bg5 {
    background: url(../../assets/nimg/icon-劳.png);
    background-size: 100% 100%;
  }
  .bgColor1,
  .bgColor2,
  .bgColor3,
  .bgColor4,
  .bgColor5,
  .bgColor6 {
    background-size: 100% 100%;
    border-radius: 10px;
  }
  .bgColor1 {
    background: #bdf3ff;
  }
  .bgColor2 {
    background: #c5caff;
  }
  .bgColor3 {
    background: #ffb1f3;
  }
  .bgColor4 {
    background: #c3ff76;
  }
  .bgColor5 {
    background: #90d1ff;
  }
  .bgColor6 {
    background: #ffdc84;
  }
}
</style>
