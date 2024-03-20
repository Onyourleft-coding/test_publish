<template>
  <div class="pc-third-target">
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
    <div class="target-list">
      <div
        v-for="item in targetThirdList"
        :key="item.id"
        @click.stop="getCur(item)"
      >
        <div class="target">
          <img
            class="right-edit"
            src="../../assets/nimg/icon-right-edit.png"
            alt=""
            @click.stop="handleRemark(item)"
            v-if="!showDelete && !multiple"
          />
          <van-checkbox
            class="right-checkbox"
            :name="item.id"
            v-model="item.checked"
            v-if="multiple"
          ></van-checkbox>
          <div class="clear" v-if="showDelete" @click="handleDelete(item)">
            ×
          </div>
          <p class="evaluate-value" v-if="active === 1">
            {{ item.evaluateValue }}
          </p>
          <p class="evaluate-value" v-if="active === 2" style="color: red">
            -{{ item.evaluateValue }}
          </p>
          <v-text-ellipsis
            :line="2"
            :text="item.evaluateName"
            class="evaluate-name"
            :height="48"
          ></v-text-ellipsis>
        </div>
        <div class="counter" v-if="item.checked && multiple">
          <div class="deduction" @click="item.number > 1 ? item.number-- : ''">
            -
          </div>
          <div>{{ item.number }}</div>
          <div class="add" @click="item.number++">+</div>
        </div>
      </div>
    </div>
    <div class="tips" v-if="showDelete">* 只能删除本人创建的指标</div>
    <div class="btns">
      <div>
        <van-button
          v-if="showDelete"
          type="warning"
          @click="showDelete = !showDelete"
        >
          取消
        </van-button>
        <van-button type="info" @click="multiple = !multiple">
          {{ multiple ? "取消多项点评" : "多项点评" }}
        </van-button>
        <van-button v-if="multiple" type="primary" @click="multipleSubmit">
          发送点评
        </van-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :modal="false"
      width="40%"
      top="15%"
      center
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="指标类型">
          <el-input v-model="form.evaluateName" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="指标名称"
          :rules="[
            { required: true, message: '请输入指标名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="分值"
          :rules="[{ required: true, message: '请输入分值', trigger: 'blur' }]"
        >
          <el-radio-group v-model="form.score">
            <el-radio :label="1">1</el-radio>
            <el-radio :label="2">2</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="remarkVisible"
      :modal="false"
      width="40%"
      top="15%"
    >
      <el-form ref="form" :model="formRemark" label-width="150px">
        <el-form-item label="评语">
          <el-input v-model="formRemark.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleRemarkSubmit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";

import VTextEllipsis from "v-text-ellipsis";
import { Dialog, Toast } from "vant";
export default {
  name: "third-target",
  components: {
    VTextEllipsis,
  },
  data() {
    return {
      targetThirdList: [],
      active: 1,
      tabs: [
        {
          label: "表扬",
          value: 1,
        },
        {
          label: "待改进",
          value: 2,
        },
      ],
      checkThird: [],
      showDelete: false,
      multiple: false,
      studentIds: this.$store.state.pcStore.singleStudentId,
      headTeacher: this.$store.state.pcStore.headTeacher,
      evaluateType: this.$store.state.pcStore.evaluateType,
      groupId: this.$store.state.pcStore.groupId,
      dialogVisible: false,
      form: {
        parentId: this.$route.query.parentId,
        evaluateName: this.$route.query.evaluateName,
        name: "",
        score: 1,
      },
      remarkVisible: false,
      curItem: {},
      formRemark: {
        remark: "",
      },
    };
  },
  mounted() {
    this.getThirdTarget();
  },
  methods: {
    getThirdTarget() {
      try {
        Indicator.open("加载中...");

        const { parentId } = this.$route.query;
        this.$ajax({
          method: "post",
          url: "evaluate/target/queryByParentId",
          params: {
            parentId,
            subjectId: this.headTeacher.subjectId,
            teacherId:
              this.headTeacher.teacherId || this.headTeacher.headTeacherId,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.targetThirdList =
              data.data.map((item) => {
                return {
                  ...item,
                  number: 1,
                };
              }) || [];
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    handleRemarkSubmit() {
      const { remark } = this.formRemark;
      if (!remark) {
        Toast.fail({
          message: "评语不能为空！",
        });
        return;
      }
      this.getCur(this.curItem);
    },
    handleClose() {
      this.remarkVisible = false;
      this.curItem = {};
      this.formRemark = {
        remark: "",
      };
    },
    getCur(item) {
      if (this.showDelete || this.multiple) return;
      const params = {
        studentIds: [1, 2, 4].includes(this.evaluateType)
          ? this.studentIds
          : "",
        creditType: this.active,
        creditReason: item.evaluateName,
        creditNum: item.evaluateValue,
        groupIdStr: [3].includes(this.evaluateType) ? this.groupId : "",
        remark: this.formRemark.remark || "",
      };
      this.$ajax({
        method: "post",
        url: "studentCreditDetail/add",
        params: {
          ...params,
          teacherId:
            this.headTeacher.teacherId || this.headTeacher.headTeacherId,
        },
      }).then(({ data }) => {
        if (data.code == "0000") {
          Toast.success("评价成功");
          this.$store.dispatch("pcStore/changeCheckTargetObj", params);
          this.handleClose();
          this.$router.go(-2);
        } else {
          Toast.fail(data.message);
        }
      });
    },
    handleRemark(item) {
      this.curItem = item;
      this.remarkVisible = true;
    },
    multipleSubmit() {
      const checkedList = this.targetThirdList.filter(
        (item) => item.checked && item.number
      );
      let evaluateTargetIds = [];
      checkedList.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          evaluateTargetIds.push(item.id);
        }
      });
      if (checkedList.length === 0) {
        Toast.fail("请先选择指标！");
        return;
      }
      const params = {
        studentIds: [1, 2, 4].includes(this.evaluateType)
          ? this.studentIds
          : "",
        creditType: this.active,
        evaluateTargetIds: evaluateTargetIds.join(","),
        groupIdStr: [3].includes(this.evaluateType) ? this.groupId : "",
      };
      try {
        Indicator.open("加载中...");

        this.$ajax({
          method: "post",
          url: "studentCreditDetail/add",
          params: {
            ...params,
            teacherId:
              this.headTeacher.teacherId || this.headTeacher.headTeacherId,
          },
        }).then(({ data }) => {
          Indicator.close();

          if (data.code == "0000") {
            this.multiple = false;
            Toast.success("评价成功");
            this.$store.dispatch("pcStore/changeCheckTargetObj", params);
            this.$router.go(-2);
          } else {
            Toast.fail(data.message);
          }
        });
      } catch (error) {
        Indicator.close();
      }
    },
    // 新增指标
    async handleAdd() {
      const { name, score, parentId } = this.form;
      if (!name) {
        Toast.fail({
          message: "名称不能为空！",
        });
        return;
      }
      const confirm = await Dialog.confirm({
        title: "提示",
        message: "确认添加指标？",
      });
      if (confirm === "confirm") {
        this.$ajax({
          method: "post",
          url: "evaluate/target/add",
          params: {
            parentId,
            evaluateName: name,
            evaluateValue: score,
          },
        }).then(({ data }) => {
          if (data.code == "0000") {
            Toast.success({
              message: "添加成功",
            });
            this.getThirdTarget();
            this.dialogVisible = false;
          } else {
            Toast.fail({
              message: data.message,
            });
          }
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.pc-third-target {
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
  .target-list {
    padding: 15px 35px;
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    box-sizing: border-box;
    .target {
      cursor: pointer;
      position: relative;
      padding: 10px;
      width: 200px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 4px 0px rgba(92, 117, 204, 0.3);
      background: url("../../assets/nimg/clazz_unActive.png") no-repeat center /
        cover;
      background-size: 100% 100%;
      margin: 0 15px 15px 0;
      border-radius: 10px;
      .right-edit {
        position: absolute;
        top: 0;
        right: 0;
        width: 35px;
        height: 35px;
      }
      .right-checkbox {
        position: absolute;
        top: 0;
        right: 0;
        width: 35px;
        height: 35px;
        /deep/ .van-checkbox__icon {
          font-size: 30px;
        }
      }
      .clear {
        width: 30px;
        height: 30px;
        border: 2px solid red;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: red;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }

      .evaluate-value {
        font-size: 24px;
        color: #75bdff;
        font-weight: bold;
      }

      .evaluate-name {
        font-size: 24px;
        font-weight: bold;
        color: #333333;
        text-align: center;
        margin-top: 15px;
      }
    }
    .counter {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 15px 0;
      font-size: 26px;
      .deduction,
      .add {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #edf8ee;
        color: #43a8f2;
      }
    }
    .palette-btn {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .add-target-btn {
      width: 200px;
      height: 150px;
      font-size: 26px;
      box-shadow: none;
      background: #fff;
      margin: 0 15px 15px 0;
      border-radius: 10px;
    }
  }
  .tips {
    color: red;
    font-size: 22px;
    padding: 0 35px;
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
  /deep/ .el-dialog {
    .el-dialog__header {
      padding: 35px;
    }
  }
  /deep/ .el-dialog__title {
    font-size: 30px;
    font-weight: bold;
  }

  /deep/ .el-form-item__label {
    font-size: 22px;
  }
  /deep/ .el-input {
    font-size: 22px;
  }
  /deep/ .el-input__inner {
    padding: 32px 15px;
  }
  /deep/ .el-radio__inner {
    width: 25px;
    height: 25px;
  }
  /deep/ .el-radio__label {
    font-size: 22px;
  }
  .dialog-footer {
    .el-button {
      width: 100px;
      font-size: 22px;
    }
  }
}
</style>
