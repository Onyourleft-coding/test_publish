<template>
  <div class="revocation">
    <div class="tips">
      <img alt="" class="tips_img" src="../../../assets/nimg/icon-tips.png" />
      <p>可以撤销五分钟之内所有评价，默认是全部，可以选择不需要撤销的勾选</p>
    </div>
    <div class="record-list" v-if="reviewRecordList.length > 0">
      <van-checkbox-group v-model="activeIds">
        <van-row class="row">
          <van-col
            :span="11"
            v-for="item in reviewRecordList"
            :key="item.id"
            class="record"
          >
            <van-checkbox :name="item.id">
              {{ item.gradeName }}{{ item.clazzName }}{{ item.studentName }}({{
                item.creditDesc
              }})
            </van-checkbox>
          </van-col>
        </van-row>
      </van-checkbox-group>
    </div>
    <div>
      <van-empty description="暂无可撤回评价记录" />
    </div>
    <div class="btns">
      <div>
        <van-button
          v-if="reviewRecordList.length > 0"
          type="info"
          @click="delFivePj"
        >
          确认撤销
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";

import { Dialog, Toast } from "vant";
export default {
  name: "revocation",
  data() {
    return {
      reviewRecordList: [],
      activeIds: [],
      classDetail: this.$store.state.pcStore.classDetail,
      headTeacher: this.$store.state.pcStore.headTeacher,
    };
  },
  mounted() {
    this.getReviewRecordList();
  },
  methods: {
    getReviewRecordList() {
      try {
        Indicator.open("加载中...");

        this.$ajax({
          method: "post",
          url: "studentCreditDetail/fiveminutesPage",
          params: {
            clazzId: this.classDetail.clazzId,
            pageNum: 1,
            pageSize: 100,
            teacherId:
              this.headTeacher.teacherId || this.headTeacher.headTeacherId,
            type: 1,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.reviewRecordList = data.dataList || [];
            this.activeIds = data.dataList.map((item) => item.id);
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    async delFivePj() {
      if (this.activeIds.length === 0) {
        Toast.fail("无可撤销数据");
        return;
      }
      const confirm = await Dialog.confirm({
        title: "提示",
        message: "确认撤销数据",
      });
      console.log("confirm", confirm);
      if (confirm === "confirm") {
        this.$ajax({
          method: "post",
          url: "studentCreditDetail/batchDelete",
          params: {
            ids: this.activeIds.join(","),
          },
        }).then(({ data }) => {
          if (data.code == "0000") {
            Toast.success(data.message);
            this.getReviewRecordList();
          }
        });
      }
    },
  },
  watch: {
    "$store.state.pcStore.headTeacher": function (newV) {
      this.headTeacher = newV;
      this.getReviewRecordList();
    },
  },
};
</script>
<style scoped lang="scss">
.revocation {
  .tips {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    font-size: 26px;
    color: red;
    img {
      width: 45px;
      height: 45px;
    }
  }
  .record-list {
    margin: 15px 0;
    .row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .record {
        width: 48%;
        padding: 20px 15px;
        background: #fff;
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
        /deep/ .van-checkbox__icon {
          font-size: 26px;
        }
      }
    }
  }
  .btns {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%);
    div {
      .van-button {
        width: 340px;
        font-size: 20px;
        height: 60px;
        margin: 10px 0;
      }
    }
  }
}
</style>
