<template>
  <div class="group">
    <div class="tabs">
      <van-tabs
        v-model="active"
        color="#fff"
        title-active-color="#fff"
        title-inactive-color="#515151"
        background="#FFB800"
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
    <div class="group_select">
      <select
        class="select"
        v-model="groupType"
        @change="selectGroupType($event)"
      >
        <option v-for="item in groupTypeList" :value="item.id" :key="item.id">
          {{ item.title }}
        </option>
      </select>
    </div>
    <div class="group-list">
      <van-row type="flex" gutter="15">
        <!-- @click.stop="goPj(item.groupId)" -->
        <van-col
          v-for="item in groupList"
          @click.stop="clickGroupItem(item)"
          :key="item.groupId"
          :span="8"
        >
          <div class="group-item">
            <van-checkbox
              :name="item.groupId"
              v-model="item.checked"
              :class="active === 1 ? 'checkbox-unicon' : 'group-checkbox'"
            >
              <div class="group_item">
                <div class="item_left">
                  <img
                    class="group_icon"
                    alt="logo"
                    src="../../../assets/icon/icon_group_select.png"
                  />
                  <div class="clazz_group_info">
                    <div class="clazz_group_name van-ellipsis">
                      {{ item.clazzGroupName }}
                    </div>
                    <div class="student_count">
                      共{{ item.studentCount }}人(+{{ item.praise }}/{{
                        item.tobeimproved
                      }})
                    </div>
                  </div>
                </div>
                <div class="item_center">
                  <div class="praise">{{ item.praise }}</div>
                  <div class="group_score">小组得分</div>
                </div>
                <div class="item_right">
                  <div class="btn edit" @click.stop="goAdd(item.groupId)">
                    编辑
                  </div>
                  <div class="btn del" @click.stop="delGroup(item.groupId)">
                    删除
                  </div>
                </div>
              </div>
            </van-checkbox>
          </div>
        </van-col>
      </van-row>
    </div>

    <div class="btns">
      <div>
        <van-button v-if="active === 2" type="primary" @click="handleGoPj">
          立即点评
        </van-button>
        <van-button type="info" @click="goAdd()"> 添加小组 </van-button>
      </div>
    </div>
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <div class="wrapper" @click.stop>
        <div class="wrapper_content">
          <img
            class="close"
            @click="showOverlay = false"
            src="../../../assets/icon/icon_close.png"
            alt=""
          />
          <div class="edit_btn" @click="goAdd(groupObj.groupId)">编辑</div>
          <div class="header">
            <div class="group_name">
              第一组
              <img src="../../../assets/icon/line.png" class="line" />
            </div>
          </div>
          <div class="current_week_praise">
            本周小组得分：<span class="praise"
              >{{ groupObj.totalScore }}分</span
            >
          </div>
          <div class="current_group_student_list">
            <div
              class="student_item"
              v-for="item in currentGroupStudentList"
              :key="item.studentId"
            >
              <img
                class="head_url"
                :src="
                  item.headUrl
                    ? imgChange(item.headUrl)
                    : require('../../../assets/img/boy.png')
                "
                alt=""
              />
              <div class="score">
                <span class="bisection">{{ item.bisection }}</span>
                <span class="criticize">{{ item.criticize }}</span>
              </div>
              <div class="student_name">
                {{ item.studentName }}
              </div>
            </div>
          </div>
          <div class="evalate_btn" @click="goPj(groupObj.groupId)">
            点评小组
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import { Indicator } from "mint-ui";

export default {
  name: "group",
  data() {
    return {
      groupList: [],
      tabs: [
        {
          label: "单选",
          value: 1,
        },
        {
          label: "多选",
          value: 2,
        },
      ],
      groupType: sessionStorage.getItem("groupType"),
      groupObj: {},
      groupTypeList: [],
      showOverlay: false,
      active: 1,
      classDetail: this.$store.state.pcStore.classDetail,
      currentGroupStudentList: [],
    };
  },
  mounted() {
    this.queryGroupTypeList();
  },
  methods: {
    // 点击小组
    clickGroupItem(item) {
      console.log("thia.active", this.active);
      if (this.active === 2) {
        return;
      }
      this.showOverlay = true;
      this.groupObj = item;

      this.$ajax({
        method: "post",
        url: "clazzGroup/detail",
        params: {
          groupId: item.groupId,
        },
      }).then(({ data }) => {
        if (data.code == "0000") {
          this.currentGroupStudentList = data.data.filter(
            (item) => item.selectFlag
          );
        }
      });
    },
    selectGroupType(event) {
      this.groupType = event.target.value;
      sessionStorage.setItem("groupType", this.groupType);
      this.getGroup();
    },
    // 查询小组查分类型
    async queryGroupTypeList() {
      try {
        Indicator.open("加载中...");

        const { data } = await this.$ajax({
          method: "post",
          url: "sysparam/getSysParam/list",
          params: {
            paramCode: "Teacher.GroupSort",
          },
        });
        if (data.code === "0000") {
          Indicator.close();

          if (data.data.length === 0) {
            return Toast("暂无查询分类");
          }
          this.groupTypeList = data.data.map((item, index) => {
            if (index === 0 && !this.groupType) {
              this.groupType = item.paramValue;
              sessionStorage.setItem("groupType", this.groupType);
            }
            return {
              id: item.paramValue,
              title: item.paramDesc,
            };
          });

          this.getGroup();
        }
      } catch (error) {
        Indicator.close();
      }
    },
    getGroup() {
      try {
        Indicator.open("加载中...");
        this.$ajax({
          method: "post",
          url: "clazzGroup/page",
          params: {
            pageNum: 1,
            pageSize: 100,
            clazzId: this.classDetail.clazzId,
            sortType: this.groupType,
          },
        }).then(({ data }) => {
          Indicator.close();
          if (data.code == "0000") {
            this.groupList = data.dataList || [];
            console.log("this.groupList", this.groupList);
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    goAdd(id) {
      this.$router.push({
        path: "/pc-add-group",
        query: { groupId: id },
      });
    },
    async delGroup(id) {
      const confirm = await Dialog.confirm({
        title: "提示",
        message: "确认删除小组吗？",
      });
      if (confirm === "confirm") {
        this.$ajax({
          method: "post",
          url: "clazzGroup/delete",
          params: {
            groupId: id,
          },
        }).then(({ data }) => {
          if (data.code == "0000") {
            Toast.success(data.message);
            this.getGroup();
          }
        });
      }
    },
    goPj(groupId) {
      if (this.active === 2) return;
      console.log("groupId", groupId);
      this.$store.dispatch("pcStore/changeGroupId", groupId);
      this.$router.push({
        path: "/pc-evaluate",
      });
    },
    handleGoPj() {
      const groupIds = this.groupList
        .filter((item) => item.checked)
        .map((i) => i.groupId)
        .join(",");
      if (!groupIds) {
        Toast.fail("请选择小组");
        return;
      }
      this.$store.dispatch("pcStore/changeGroupId", groupIds);
      this.$router.push({
        path: "/pc-evaluate",
      });
    },
  },
};
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .wrapper_content {
    position: relative;

    width: 90%;
    background-color: white;
    background: linear-gradient(176deg, #d2e4fe 0%, #ffffff 50%);
    border-radius: 6px;

    .header {
      display: flex;
      justify-content: center;
      // justify-content: flex-end;
      padding-top: 17px;
      margin-bottom: 20px;
      border-bottom: 1px solid #2397f9;

      .group_name {
        padding-top: 20px;
        font-size: 30px;
        text-align: center;
        color: #000;

        .line {
          margin-top: 5px;
          display: block;
          width: 120px;
          height: 6px;
        }
      }
    }

    .current_week_praise {
      text-align: center;
      margin: 30px 0;
      font-size: 20px;
      line-height: 26px;

      .praise {
        color: #f73941;
        font-size: 32px;
        font-weight: 700;
      }
    }

    .current_group_student_list {
      display: grid;
      justify-content: center;
      grid-template-columns: repeat(10, 10%);
      height: 650px;
      overflow: auto;

      .student_item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .head_url {
          display: block;
          height: 80px;
          width: 80px;
        }

        .score {
          .bisection {
            padding: 1px 8px;
            width: 60px;
            height: 15px;
            background: #def2ff;
            border-radius: 10px 0px 0px 10px;
            color: #1596fc;
            font-size: 18px;
          }

          .criticize {
            padding: 1px 8px;
            width: 60px;
            height: 15px;
            font-size: 18px;

            color: #fa3636;
            border-radius: 0px 10px 10px 0px;
            background: #ffeaea;
          }
        }

        .student_name {
          font-size: 22px;
          padding: 15px 0;
        }
      }
    }

    .evalate_btn {
      width: 180px;
      height: 50px;
      line-height: 50px;
      border: 1px solid #1696fc;
      border-radius: 30px;
      color: #1696fc;
      margin: 20px auto;
      text-align: center;
    }

    .edit_btn {
      position: absolute;
      right: 10px;
      top: 20px;
      width: 80px;
      border-radius: 6px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      text-align: center;
      color: #fff;
      background-color: #51ba87;
    }

    .close {
      position: absolute;
      right: 0;
      top: -55px;
      width: 42px;
      height: 42px;
    }
  }
}

.group {
  .tabs {
    background: #ffb800;

    /deep/ .van-tabs {
      width: 50vw;
      margin: auto;
    }

    /deep/ .van-tab {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .group_select {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    margin-top: 20px;

    .select {
      border: none;
      background: #ffb800;
      border-radius: 10px 0px 0px 10px;
      padding: 10px 10px 10px 20px;
      color: #fff;
      font-size: 18px;
    }
  }

  .group-list {
    // display: flex;
    // flex-wrap: wrap;
    .group_item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 15px 10px;
      border-radius: 6px;
      // box-shadow: 0px 0px 4px 0px rgba(181, 181, 181, 0.3);
      background-color: #fff;
      // margin-bottom: 10px;
      .item_left {
        display: flex;

        .group_icon {
          display: block;
          margin-right: 10px;
          height: 75px;
          width: 72px;
        }
      }

      .item_center {
        text-align: center;

        .praise {
          font-size: 30px;
          color: #1696fc;
          font-weight: 700;
          margin-bottom: 5px;
          // line-height: 23px;
        }

        .group_score {
          color: #9a9b9c;
          font-size: 16px;
        }
      }

      .item_right {
        .btn {
          background: #ffffff;

          border-radius: 6px;
          height: 40px;
          line-height: 40px;
          padding: 0 30px;
          font-size: 16px;
          font-weight: 400;
        }

        .edit {
          margin-bottom: 10px;
          border: 1px solid #6ba9ff;
          color: #6ba9ff;
        }

        .del {
          color: #ee8585;
          border: 1px solid #ee8585;
        }
      }

      .clazz_group_info {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        .clazz_group_name {
          color: #161616;
          font-size: 22px;
          line-height: 22px;
          padding-top: 5px;
          margin-bottom: 5px;
          max-width: 120px;
        }

        .student_count {
          color: #9a9b9c;
          font-size: 16px;
        }
      }
    }

    .group-item {
      border: 1px solid #eee;
      border-radius: 10px;
      background: #fff;
      padding: 15px 10px;
      font-size: 20px;
      margin: 10px 0;
      // margin: 15px 15px 0 0;

      /deep/ .van-checkbox__label {
        flex: 1;
      }

      .g_ct_header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .g_ct_title {
          display: flex;
          align-items: center;
        }

        .rigtht__operate {
          width: 30px;
          height: 30px;
          margin: 0 5px;
        }
      }

      .g_ct_value {
        margin-top: 15px;
        font-size: 20px;
        color: #969799;
      }
    }

    .group-checkbox {
      /deep/ .van-checkbox__icon {
        display: block;
      }
    }

    .checkbox-unicon {
      /deep/ .van-checkbox__icon {
        display: none;
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
