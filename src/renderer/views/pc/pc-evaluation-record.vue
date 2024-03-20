<template>
  <div id="c_main">
    <van-sticky :offset-top="80">
      <div class="search_form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="点评时间">
            <el-date-picker
              v-model="formInline.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="评价指标">
            <el-input
              v-model="formInline.evaluateName"
              placeholder="评价指标"
            ></el-input>
          </el-form-item>
          <el-form-item label="被评人">
            <el-input
              v-model="formInline.studentName"
              placeholder="被评人"
            ></el-input>
          </el-form-item>
          <el-form-item label="点评人">
            <el-select v-model="formInline.operateId" placeholder="点评人">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in clazzTeacherList"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </van-sticky>
    <p v-if="showFlag" style="text-align: center; padding: 20px">暂无数据...</p>
    <div class="c_ct">
      <div v-if="orderList.length > 0">
        <div v-if="loading" class="loading">
          <van-loading type="spinner" size="40" vertical color="#0094ff">
            加载中...
          </van-loading>
        </div>
        <van-row v-else type="flex" gutter="20">
          <van-col span="12" v-for="item in orderList" :key="item.id">
            <div class="c_all" @click="getDetail(item)">
              <div class="score">
                <div class="score-count">
                  {{
                    item.creditType === 1
                      ? `+${item.creditNum}`
                      : `${item.creditNum}`
                  }}
                </div>
              </div>
              <div class="content">
                <div class="content-title">
                  <div class="van-ellipsis">
                    {{ item.creditReason }}
                  </div>
                  <div
                    class="content-clazzType"
                    :class="item.clazzType === 1 ? '' : 'content-clazzType2'"
                  >
                    {{ item.clazzType === 1 ? "班级点评" : "学生点评" }}
                  </div>
                </div>
                <div class="content-class">
                  班级:{{ item.gradeName }}{{ item.clazzName }}
                </div>
                <div class="content-comment">
                  评语:{{ item.remark || "暂无评语" }}
                </div>
                <div class="content-commentator">
                  被评人：{{ item.studentName }}（时间：{{
                    item.createTime | timeFilter
                  }}）
                </div>
                <div class="content-commentator">
                  点评人：{{ item.operateName }}
                </div>
              </div>
              <div class="del-btn" @click.stop="delDp(item)">删除</div>
            </div>
          </van-col>
        </van-row>
      </div>
      <van-empty v-else description="暂无评价记录" />
    </div>

    <div class="pagination" v-if="totalCount > 0">
      <van-pagination
        v-model="pageNum"
        :total-items="totalCount"
        :items-per-page="18"
        @change="changePageNum"
        force-ellipses
      />
    </div>

    <mt-datetime-picker
      ref="bPicker"
      v-model="bPickTime"
      type="date"
      @confirm="bConfirmPicker(bPickTime)"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="ePicker"
      v-model="ePickTime"
      type="date"
      @confirm="eConfirmPicker(ePickTime)"
    >
    </mt-datetime-picker>
    <mt-popup
      v-model="popupGradeVisible"
      position="bottom"
      style="width: 100%; border-radius: 5px"
    >
      <div class="lt">
        <mt-picker
          :slots="gradeSlots"
          showToolbar
          value-key="gradeName"
          @change="onGradeChange"
        >
          <div class="popup_btn">
            <mt-button
              size="small"
              type="default"
              @click="popupGradeVisible = false"
              >取消
            </mt-button>
            <mt-button size="small" type="primary" @click="gradeConfirm"
              >确认
            </mt-button>
          </div>
        </mt-picker>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupClassVisible"
      position="bottom"
      style="width: 100%; border-radius: 5px"
    >
      <div class="lt">
        <mt-picker
          :slots="classSlots"
          showToolbar
          value-key="clazzName"
          @change="onClassChange"
        >
          <div class="popup_btn">
            <mt-button
              size="small"
              type="default"
              @click="popupClassVisible = false"
              >取消
            </mt-button>
            <mt-button size="small" type="primary" @click="classConfirm"
              >确认
            </mt-button>
          </div>
        </mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script type="es6">
import { Toast, Indicator } from 'mint-ui'
import { Dialog } from 'vant'
export default {
  name: 'app',
  data () {
    return {
      formInline: {
        studentName: '', // 被评人
        operateId: '', // 点评人
        evaluateName: '', // 评价指标
        time: ''
      },
      currentPage: 1,
      loading: false,
      finished: false,
      popupGradeVisible: false,
      popupClassVisible: false,
      gradeSlots: [
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      classSlots: [
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      showFlag: false,
      moreText: '上拉刷新',
      distance: 100,
      orderList: [],
      orderArr: [],
      allLoaded: false,
      clazzId: '',
      beginTime: '',
      endTime: '',
      studentName: '',
      pageNum: 1,
      bPickTime: new Date(),
      ePickTime: new Date(),
      gradeObj: {},
      gradeName: '',
      className: '',
      classObj: {},
      totalCount: 0,
      type: this.$route.query.type,
      classDetail: this.$store.state.pcStore.classDetail,
      clazzTeacherList: []
    }
  },
  mounted () {
    this.getData()
    this.getGrade()
    this.getClszzTeacher()
  },
  filters: {
    timeFilter (val) {
      if (val) {
        return val.split(' ')[0]
      }
    }
  },
  methods: {
    getClszzTeacher () {
      this.$ajax({
        method: 'get',
        url: 'parent/commont/clazzUserListPc',
        params: {
          clazzId: this.classDetail.clazzId

        }
      })
        .then(({ data }) => {
          if (data.code == '0000') {
            console.log('data', data)
            this.clazzTeacherList = data.data.map((item) => {
              return {
                value: item.teacherId,
                label:item.headTeacherName|| item.teacherName
              }
            })
            console.log('clazzTeacherList',this.clazzTeacherList);
          }
        })
        .catch(() => {
          Indicator.close()
        })
    },
    onSubmit () {
      console.log(this.formInline)
      const {time} = this.formInline
      if (time) {
        this.beginTime = time[0]
        this.endTime = time[1]
      }else{
        this.beginTime=''
        this.endTime=''
      }
      this.getData()
    },
    changePageNum (params) {
      this.pageNum = params
      this.getData()
    },
    onLoad () {
      this.getData()
    },
    openBeginPicker () {
      this.$refs.bPicker.open()
    },
    bConfirmPicker (val) {
      this.beginTime = this.formatTime(val)
    },
    openEndPicker () {
      this.$refs.ePicker.open()
    },
    eConfirmPicker (val) {
      this.endTime = this.formatTime(val)
    },
    onGradeChange (picker, values) {
      console.log('picker',picker);
      this.gradeObj = values[0]
    },
    onClassChange (picker, values) {
      console.log('picker',picker);
      this.classObj = values[0]
    },
    gradeConfirm () {
      this.gradeName = this.gradeObj.gradeName
      this.getClazz(this.gradeObj.id)
      this.popupGradeVisible = false
    },
    classConfirm () {
      this.popupClassVisible = false
      this.className = this.classObj.clazzName
      this.clazzId = this.classObj.id
    },
    getGrade () {
      Indicator.open()
      this.$ajax({
        method: 'get',
        url: 'grade/all',
        params: {}
      })
        .then(({ data }) => {
          Indicator.close()
          if (data.code == '0000') {
            this.gradeSlots[0].values = data.data
            this.gradeId = this.gradeSlots[0].values[0].id
            this.getClazz(this.getGradeList[0].id)
          } else {
            Toast(data.message)
          }
        })
        .catch(() => {
          Indicator.close()
        })
    },
    getClazz (id) {
      Indicator.open()
      this.$ajax({
        method: 'get',
        url: 'clazz/queryByGradeId',
        params: {
          gradeId: id
        }
      })
        .then(({ data }) => {
          Indicator.close()
          if (data.code == '0000') {
            this.classSlots[0].values = data.data
          } else {
            Toast(data.message)
          }
        })
        .catch(() => {
          Indicator.close()
        })
    },
    reset () {
      this.gradeName = ''
      this.gradeId = ''
      this.className = ''
      this.clazzId = ''
      this.beginTime = ''
      this.endTime = ''
      this.getData()
    },
    stuSearch () {
      this.getData()
    },
    formatTime (val) {
      var data = new Date(val)
      var year = data.getFullYear()
      var month = data.getMonth() + 1
      var day = data.getDate()

      return (
        year +
        '-' +
        (month > 9 ? month : '0' + month) +
        '-' +
        (day > 9 ? day : '0' + day)
      )
    },
    formatVal (val) {
      if (val) {
        var data = new Date(val)
        var year = data.getFullYear()
        var month = data.getMonth() + 1
        var day = data.getDate()

        return (
          year +
          '' +
          (month > 9 ? month : '0' + month) +
          '' +
          (day > 9 ? day : '0' + day)
        )
      }
    },
    loadTop () {
      this.pageNum = 1
      this.getData()
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.pageNum++
      this.getData()
      this.$refs.loadmore.onBottomLoaded()
    },
    checkDay (time) {
      var now = new Date() // 当前日期
      var arr = [7, 1, 2, 3, 4, 5, 6]
      var nowYear = now.getFullYear()
      var nowMonth = now.getMonth()
      var nowDayOfWeek = now.getDay() // 今天本周的第几天
      var nowDay = now.getDate() // 当前日
      var weekStartDate = new Date(
        nowYear,
        nowMonth,
        nowDay - arr[nowDayOfWeek] + 1
      )
      console.log(nowDayOfWeek, nowDay, this.formatTime(weekStartDate))
      console.log(weekStartDate - new Date(time) < 0)
      return weekStartDate - new Date(time) < 0
    },
    delDp (item) {
      Dialog.confirm({
        message: '确定执行此操作？'
      })
        .then(() => {
          this.$ajax({
            method: 'post',
            url: 'studentCreditDetail/delete',
            params: {
              id: item.id
            }
          }).then(({ data }) => {
            if (data.code == '0000') {
              Toast(data.message)
              this.getData()
            } else {
              console.log(data)
              Toast(data.message)
            }
          })
        })
        .catch(() => {

        })
    },
    getDetail (item) {
      // return
      this.$router.push({ path: '/pc-credit-detail', query: { stu: JSON.stringify(item) } })
    },
    getData () {
      this.showFlag = false
      this.loading = true

      this.$ajax({
        method: 'get',
        url: 'studentCreditDetail/page',
        params: {
          pageSize: 18,
          clazzId: this.classDetail.clazzId,
          role: this.role,
          operateId: this.formInline.operateId,
          studentName: this.formInline.studentName,
          evaluateName: this.formInline.evaluateName,
          beginTime: this.formatVal(this.beginTime),
          endTime: this.formatVal(this.endTime),
          pageNum: this.pageNum
        }
      })
        .then(({ data }) => {
          if (data.code == '0000') {
            this.orderList = data.dataList
            this.totalCount = data.totalCount
          } else {
            Toast(data.message)
          }
          this.loading = false
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style scoped lang="scss">
.search_form {
  background-color: #fff;
  width: 100%;
  padding-left: 15px;
  padding-top: 20px;
  display: flex;
}
.c_ct {
  height: 860px;
  overflow-y: scroll;
  /deep/ .van-empty {
    background: #fff;
    height: 100%;
  }
  /deep/ .van-empty__image {
    width: 30%;
    height: 45%;
  }
  /deep/ .van-empty__description {
    font-size: 30px;
  }
}

.pagination {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

/deep/ .van-pagination {
  width: 30%;
  margin: 20px auto;
}

.loading {
  margin: 50px auto;
}

.c_time {
  padding: 15px;
  background: #fff;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.c_time input {
  float: left;
  /*width: 160px;*/
  height: 35px;
  width: calc((100% - 30px) / 2);

  background: #f6f6f6;
  border-radius: 3px;
  outline: none;
  border: none;
  line-height: 35px;
  font-size: 15px;
  color: #c0c0c0;
  padding-left: 10px;
}

.temp_span {
  float: left;
  height: 35px;
  width: 25px;
  line-height: 35px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: #333333;
  display: inline-block;
}

.c_ct {
  margin-top: 10px;
  margin-right: 10px;
  margin-left: 10px;
  padding: 0 5px 0 5px;
}

.c_all {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0px 0px 6px 0px #f0f0f0;
  margin-bottom: 10px;
}

.c_all:last-child {
  border-bottom: 0;
}

.score,
.del-btn {
  flex-basis: 50px;
  flex-shrink: 0;
  cursor: pointer;
}

.score {
  width: 55px;
  height: 55px;
  background: #f8ffe9;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-count {
  width: 45px;
  height: 45px;
  background: #a9dc56;
  border: 2px solid #8aca74;
  border-radius: 50%;
  font-size: 20px;
  font-weight: 700;
  color: #fffee8;
  line-height: 45px;
  text-align: center;
  flex-shrink: 1;
}

.content {
  margin-left: 10px;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  white-space: nowrap;
}

.content-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #1d1f21;
  font-weight: bold;
}

.content-clazzType {
  color: #fff;
  font-size: 12px;
  transform: scale(0.83, 0.83);
  margin-left: 10px;
  /* background-image: url("../assets/nimg/group-bg-1.png"); */
  background-size: 100% 100%;
  width: 60px;
  text-align: center;
  height: 19px;
  line-height: 19px;
}

.content-clazzType2 {
  /* background-image: url("../assets/nimg/group-bg-2.png"); */
  background-size: 100% 100%;
}

.content-class,
.content-comment,
.content-commentator {
  font-size: 18px;
  color: #7b7b7b;
  margin-top: 3px;
}

.del-btn {
  color: #fc2f2f;
  font-size: 18px;
}

.c_left {
  float: left;
  font-size: 28px;
  font-weight: bold;
  color: #fabf19;
  height: 50px;
  line-height: 50px;
  width: 50px;
  text-align: center;
}

.c_right {
  float: left;
  height: 50px;
  margin-left: 15px;
  width: calc(100% - 70px);
}

.cr_one {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 26px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 26px;
}

.c_text {
  font-size: 13px;
}

.cr_two {
  height: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #c0c0c0;
  line-height: 16px;
}

.cr_two > span:nth-child(1) {
  margin-right: 8px;
}

.remark {
  float: left;
  color: #c0c0c0;
  margin-left: 65px;
  font-size: 14px;
  line-height: 16px;
}

.sbtn {
  height: 35px;
  background: #fabf19;
  border-radius: 4px;
  border: 1px solid #fabf19;
  line-height: 35px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  /*width: 100px;*/
  width: calc((100% - 30px) / 2);
}

.popup_btn {
  display: flex;
  padding: 10px 30px 0 30px;
  justify-content: space-between;
}

.footer-btn {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  padding: 10px 0;
  box-sizing: border-box;
}

.import-btn input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0;
}
</style>
