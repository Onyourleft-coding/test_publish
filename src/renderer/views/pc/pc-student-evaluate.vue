<template>
  <div class="student-evaluate">
    <van-sticky :offset-top="80">
      <div style="background-color: white">
        <van-skeleton :row="5" :loading="subjectLoading">
          <div class="subject">
            <div
              v-for="(item, index) in subjectList"
              :key="index"
              class="sub-item"
              @click="handleChangeSubject(item)"
              :class="
                $store.state.pcStore.headTeacher.subjectId === item.subjectId &&
                $store.state.pcStore.headTeacher.teacherId === item.teacherId
                  ? 'active'
                  : ''
              "
            >
              <div class="name">{{ item.subjectName || "班主任" }}</div>
              <div class="teacher-name">
                {{ item.teacherName || item.headTeacherName }}
              </div>
            </div>
          </div>
        </van-skeleton>
      </div>
    </van-sticky>
    <van-sticky :offset-top="188">
      <div class="header">
        <div class="tabs">
          <van-tabs
            v-model="evaluateType"
            @change="handleTabsChange"
            color="#1596FC"
            title-active-color="#1596FC"
            title-inactive-color="#515151"
          >
            <van-tab
              v-for="item in tabs"
              :key="item.value"
              :title="item.label"
              :name="item.value"
            >
            </van-tab>
          </van-tabs>
        </div>
        <van-search
          v-if="[1, 2].includes(evaluateType)"
          v-model="studentName"
          show-action
          placeholder="请输入名字搜索"
          @search="getStudentList"
          shape="round"
          @clear="getStudentList"
        >
          <template #action>
            <div @click="getStudentList" style="font-size: 18px">搜索</div>
          </template>
        </van-search>
      </div>
    </van-sticky>
    <div class="signle_select" v-if="[1, 2].includes(evaluateType)">
      <select
        class="select"
        v-model="signleType"
        @change="selectSignleType($event)"
      >
        <option v-for="item in signleTypeList" :value="item.id" :key="item.id">
          {{ item.title }}
        </option>
      </select>
    </div>
    <div class="components">
      <single v-if="evaluateType === 1" :data="studentList" />
      <multiple v-if="evaluateType === 2" :data="studentList" />
      <group v-if="evaluateType === 3" />
      <random v-if="evaluateType === 4" :data="studentList" />
      <revocation v-if="evaluateType === 5" />
    </div>
  </div>
</template>
<script>
import single from "./components/single.vue";
import multiple from "./components/multiple.vue";
import group from "./components/group.vue";
import random from "./components/random.vue";
import revocation from "./components/revocation.vue";
import { Toast } from "vant";
import { Indicator } from "mint-ui";

export default {
  name: "pc-student-evaluate",
  data() {
    return {
      subjectLoading: false,
      subjectList: [],
      signleType: 1,
      signleTypeList: [
        {
          id: 1,
          title: "按名字首字母排序",
        },
        {
          id: 2,
          title: "按学生编号排序",
        },
        {
          id: 3,
          title: "按分值排序",
        },
      ],
      tabs: [
        { label: "个人", value: 1 },
        { label: "多人", value: 2 },
        { label: "小组", value: 3 },
        { label: "随机", value: 4 },
        { label: "撤销", value: 5 },
      ],
      studentName: "",
      evaluateType: this.$store.state.pcStore.evaluateType,
      studentList: [],
      classDetail: this.$store.state.pcStore.classDetail,
    };
  },
  components: { single, multiple, group, random, revocation },
  mounted() {
    this.getSubjectList();
    this.getStudentList();
  },
  methods: {
    handleTabsChange(name) {
      this.$store.dispatch("pcStore/changeEvaluateType", name);
    },
    selectSignleType(event) {
      this.signleType = event.target.value;
      this.getStudentList();
    },
    onSearch() {},
    getSubjectList() {
      this.subjectLoading = true;
      this.$ajax({
        method: "post",
        url: "parent/commont/statisticsClazzListPc",
        params: {
          clazzId: this.classDetail.clazzId,
        },
      }).then(({ data }) => {
        if (data.code == "0000") {
          this.subjectList = data.data || [];
          this.subjectLoading = false;
          const headTeacher = this.$store.state.pcStore.headTeacher;
          if (!headTeacher.subjectId) {
            this.$store.dispatch("pcStore/changeHeadTeacher", data.data[0]);
          }
        }
      });
    },
    handleChangeSubject(item) {
      if (item.headTeacherName) {
        Toast(`已切换到“${item.headTeacherName}”班主任点评`);
      } else {
        Toast(`已切换到“${item.subjectName}-${item.teacherName}”老师点评`);
      }
      this.$store.dispatch("pcStore/changeHeadTeacher", item);
    },
    getStudentList() {
      try {
        Indicator.open("加载中...");

        this.$ajax({
          method: "post",
          url: "parent/commont/statistics",
          params: {
            clazzId: this.classDetail.clazzId,
            pageNum: 1,
            pageSize: 100,
            type: 10,
            studentName: this.studentName,
            flag: this.signleType,
          },
        }).then(({ data }) => {
          if (data.code == "0000") {
            this.studentList = data.dataList || [];
            const checkTargetObj = this.$store.state.pcStore.checkTargetObj;
            Indicator.close();

            if (
              Object.keys(checkTargetObj).length !== 0 ||
              checkTargetObj.constructor !== Object
            ) {
              const studentIds = isFinite(checkTargetObj.studentIds)
                ? [checkTargetObj.studentIds]
                : checkTargetObj.studentIds.split(",").map(Number);
              this.studentList = this.studentList.map((item) => {
                if (studentIds.includes(item.studentId)) {
                  return {
                    ...item,
                    creditNum: checkTargetObj.creditNum,
                    creditType: checkTargetObj.creditType,
                  };
                }
                return item;
              });
              this.$store.dispatch("pcStore/changeCheckObj", []);
              this.$store.dispatch("pcStore/changeCheckTargetObj", {});
              this.$store.dispatch("pcStore/changeGroupId", "");
              this.$store.dispatch("pcStore/changeSingleStudentId", "");
            }
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
  },
  watch: {
    evaluateType: function (newValue) {
      if ([1, 2].includes(newValue)) {
        this.getStudentList();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.signle_select {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  background-color: #f9fafc;

  .select {
    border: none;
    background: #ffb800;
    border-radius: 10px 0px 0px 10px;
    padding: 3px 10px 3px 16px;
    color: #fff;
  }
}
.student-evaluate {
  box-sizing: border-box;
  .subject {
    display: flex;
    background: #1596fc;
    padding: 15px 35px;
    flex-wrap: wrap;
    .sub-item {
      text-align: center;
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
      // width: 350px;
      /deep/ .van-tab {
        font-size: 24px;
        font-weight: bold;
      }
    }
    /deep/ .van-search .van-cell {
      padding: 10px 8px 10px 0;
      line-height: 28px;
      font-size: 20px;
    }
    /deep/ .van-tab__text--ellipsis {
      padding: 12px 30px;
    }
  }
  .components {
    padding: 15px 35px;
    // height: 810px;
    overflow-y: hidden;
    box-sizing: border-box;
    overflow-x: hidden;
    background: #f9fafc;
  }
}
</style>
