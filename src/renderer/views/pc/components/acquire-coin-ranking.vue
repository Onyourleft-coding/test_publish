<template>
  <div class="acquire-coin-ranking">
    <div class="rules">
      <div class="title">获币规则：</div>
      <div class="tip">按每周总分排行榜奖励{{ title }},{{ tips[appName] }}</div>
    </div>
    <div class="data_list">
      <div v-for="(item, index) in data" :key="index">
        <div v-if="item.length > 0">
          <div class="boder-card">
            <div class="ranking">{{ ranking[index] }}</div>
            <div class="num" v-if="coinNum[index]">
              奖励个
              <span>{{ coinNum[index] }} </span>
              {{ title }}
            </div>
          </div>
          <div class="student_list">
            <div v-for="stu in item" :key="stu.studentId" class="student">
              <div class="avatar">
                <img src="../../../assets/img/boy.png" alt="" />
              </div>
              <div class="score">
                <div class="praise">{{ stu.praise }}</div>
                <div class="tobeimproved">{{ stu.tobeimproved }}</div>
              </div>
              <div class="user-name van-ellipsis">
                {{ stu.studentName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../../../config";
export default {
  name: "acquire-coin-ranking",
  props: {
    data: { require: true, type: Object, default: () => {} },
  },
  data() {
    return {
      ranking: ["xsxx"].includes(config.appName)
        ? {
            1: "第1名",
            2: "第2-10名",
            3: "第11-20名",
            4: "第21-30名",
            5: "第31-40名",
            6: "第41-50名",
            7: "第51名及以下",
            8: "进步排行榜第1-3名",
            9: "无评价记录不计算排名不涉及奖励",
          }
        : {
            1: "第1-3名",
            2: "第4-15名",
            3: "第16-30名",
            4: "第31-40名",
            5: "第41名及以下",
            6: "进步排行榜第1-3名",
            7: "无评价记录不计算排名不涉及奖励",
          },
      coinNum: ["xsxx"].includes(config.appName)
        ? {
            1: 7,
            2: 6,
            3: 5,
            4: 4,
            5: 3,
            6: 2,
            7: 1,
            8: 1,
          }
        : {
            1: 6,
            2: 4,
            3: 3,
            4: 2,
            5: 1,
            6: 1,
          },
      title: config.title,
      appName: config.appName,
      tips: {
        xsxx: `第1名奖励7个，第2-10名奖励6个，11-20名奖励5个，21-30名奖励4个，31-40励3个，41-50名奖励2个，51名及以下奖1个;
        如有并列排名的同学，下一个同学的名次减1。另外每周进行排行榜前3名奖励1个币。`,
        dcxx: `第1-3名奖励6个，第4-15名奖励4个，16-30名奖励3个，31-40名奖励2个，41名及以下奖1个;
        如有并列排名的同学，下一个同学的名次减1。另外每周进行排行榜前3名奖励1个币。`,
      },
    };
  },
  methods: {
    imgChange() {
      return require("../../../assets/img/boy.png");
    },
  },
};
</script>
<style scoped lang="scss">
.acquire-coin-ranking {
  .rules {
    padding: 11px 16px;
    background: #fff5e1;
    font-size: 20px;
    .title {
      color: red;
    }
    .tip {
      color: #676765;
      margin-top: 10px;
    }
  }
  .data_list {
    .boder-card {
      width: 560px;
      height: 63px;
      margin: 5px 0;
      background: url(../../../assets/pc/boder-card.png) no-repeat center /
        cover;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      .ranking {
        color: #1596fc;
      }
      .num {
        span {
          color: red;
        }
      }
    }
    .student_list {
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
          background: url(../../../assets/pc/avatar_2.png) no-repeat center /
            cover;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          font-weight: bold;
          img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }
        }
        .score {
          display: flex;
          .praise,
          .tobeimproved {
            width: 47px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          }
          .praise {
            background: #def2ff;
            color: #1596fc;
            border-radius: 10px 0 0 10px;
          }
          .tobeimproved {
            background: #ffeaea;
            color: #fa3636;
            border-radius: 0 10px 10px 0;
          }
        }
        .user-name {
          font-weight: bold;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
