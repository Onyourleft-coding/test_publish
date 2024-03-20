<template>
  <div class="detail">
    <div class="de_ct">
      <p class="c_title">评价内容</p>
      <div class="de_item">
        <div class="box">
          <div class="cell">
            <p class="sub_title">点评人：</p>
            <p class="sub_txt">{{ stu.operateName || stu.remark }}</p>
          </div>
          <div class="cell">
            <p class="sub_title">点评学生：</p>
            <p class="sub_txt">{{ stu.studentName }}</p>
          </div>

          <div class="cell">
            <p class="sub_title">点评指标：</p>
            <div class="sub_txt">
              <div class="zb">
                <p v-if="stu.creditType == 1">
                  {{ stu.creditNum }}
                </p>
                <p v-if="stu.creditType == 2" style="color: red">
                  {{ stu.creditNum }}
                </p>
                <p>{{ stu.creditReason }}</p>
              </div>
            </div>
          </div>
          <div class="" v-if="stu.remark">
            <p class="sub_title">评语 ：</p>
            <p class="sub_txt">{{ stu.remark }}</p>
            <p class="thumb_img">
              <img
                preview="2"
                :key="item"
                v-for="item in imgArr"
                :src="item | imgChange"
                alt=""
              />
            </p>
          </div>
          <div class="cell">
            <p class="sub_title">点评时间：</p>
            <p class="sub_txt">{{ stu.createTime }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="g_btn">
      <div
        v-if="appName !== 'hbq' && type == '9' && detailObj.status == '0'"
        class="addBtn"
        @click="goSs"
      >
        申诉
      </div>
      <div class="addBtn unAgree" @click="back">返回</div>
    </div>
  </div>
</template>

<script type="es6">
import { Toast } from 'mint-ui'
import config from '../../config'
export default {
  name: 'app',
  data () {
    return {
      stu: JSON.parse(this.$route.query.stu),
appName:config.appName,
      imgArr: [],
      detailObj: {},
      type: this.$route.query.type,
      evaId: this.$route.query.id,
      statusList: [
        { id: '0', name: '评论中' },
        { id: '1', name: '申诉中' },
        { id: '2', name: '申诉通过' },
        { id: '3', name: '申诉拒绝' }
      ]
    }
  },
  filters: {
    imgChange (val) {

      return config.configUrl + 'file/get/' + val
    },
    statusChange (val) {
      if (val != undefined && val != null) {
        let statusList = [
          { id: '0', name: '评论中' },
          { id: '1', name: '提交申诉未审核' },
          { id: '2', name: '申诉审批通过' },
          { id: '3', name: '申诉审批不通过' }
        ]
        let obj = statusList.find((item) => {
          return item.id == val
        })
        return obj.name
      }
    }
  },
  mounted () {
    console.log(this.stu);
    this.computedImg()
    // this.getDetail()
  },

  methods: {
    computedImg(){
      if(this.stu){
        const {images} = this.stu
      this.imgArr = images.split(',')
      console.log(this.imgArr);
      }
    },
    back () {
      this.$router.go(-1)
    },
    goSs () {
      this.$router.push({ path: '/appealSubmit', query: { id: this.evaId } })
    },
    getDetail () {
      this.$ajax({
        method: 'get',
        url: 'clazzCreditDetail/detail',
        params: {
          id: this.evaId
        }
      })
        .then(({ data }) => {
          if (data.code == '0000') {
            this.detailObj = data.data
            if (data.data.photo) {
              this.imgArr = data.data.photo.split(',')
              this.$previewRefresh()
            }

            console.log(this.imgArr)
          } else {
            Toast(data.message)
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.detail {
  padding: 35px;
  /* padding: 15px 5px 70px 5px; */
}
.de_item {
  padding: 10px;
}
.cell {
  display: flex;
  align-items: start;
  justify-content: start;
}
.student-cell {
  display: flex;
}
.student-title {
  flex-shrink: 0;
}
.student-right {
  display: flex;
  align-items: start;
  justify-content: start;
  flex-wrap: wrap;
}
.student-sub {
  margin-top: 10px;
  margin-right: 10px;
}
.thumb_img {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.thumb_img img {
  width: 120px;
  height: 120px;
  margin-right: 15px;
}
.sub_title {
  font-size: 20px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: LEFT;
  color: #003afa;
  line-height: 30px;
}
.sub_txt {
  font-size: 20px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: LEFT;
  color: #3c445e;
  line-height: 30px;
}
.c_title {
  position: relative;
  padding-left: 10px;
  font-size: 24px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: LEFT;
  color: #000000;
  line-height: 25px;
  margin-top: 20px;
  margin-bottom: 12px;
}
.c_title:after {
  position: absolute;
  top: 4px;
  left: 0;
  content: "";
  width: 4px;
  height: 18px;
  background: #003afa;
  border-radius: 4px;
}
.clazz_txt {
  padding: 18px;
  font-size: 18px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: CENTER;
  color: #003afa;
  line-height: 18px;
  letter-spacing: -0.01px;
}
.zb {
  margin: 0 auto;
  width: 106px;
  height: 85px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 0px 4px 0px rgba(92, 117, 204, 0.3);
  background-image: url("../../assets/nimg/clazz_active.png");
  background-size: 100% 100%;
}
.zb > p:nth-child(1) {
  font-size: 20px;
  font-weight: 400;
  color: #75bdff;
  line-height: 20px;
  padding-top: 20px;
}
.zb > p:nth-child(2) {
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: #333333;
}
.g_btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f9f9f9;
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: center;
}
.addBtn {
  width: 45%;
  margin-right: 10px;
  height: 64px;
  background: #003afa;
  border-radius: 4px;
  border: 1px solid #003afa;
  line-height: 64px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}
.addBtn.unAgree {
  color: #003afa;
  border: 1px solid #003afa;
  background: #fff;
}

.desc > textarea {
  outline: none;
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  border: none;
}
.upload {
  text-align: left;
  margin-top: 10px;
}
.upload.idcard > div {
  width: 100px;
  height: 100px;
  background: #e8edfd;
  border-radius: 6px;
}
.upload > div {
  position: relative;
  width: 100px;
  height: 100px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: bottom;
  border-radius: 5px;
  border: 2px solid #e8edfd;
}
.load_img img {
  width: 100%;
  height: 100%;
}
.upload > .load_img > span {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  z-index: 100;
}

.upload > .load_img > span > img {
  width: 20px;
  height: 20px;
}

.upload > .fileType > img {
  width: 24px;
  height: 22px;
  margin-top: 35px;
}
.upload.idcard > .fileType > img {
  margin-top: 25px;
}
.upload > .fileType > p {
  color: #999;
  font-size: 16px;
  margin: 12px;
}
.fileType {
  text-align: center;
  position: relative;
}

.fileType input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0;
}
.stu_add {
  position: relative;
}
.stu_add_btn {
  position: absolute;
  right: 10px;
  top: 0;
  height: 25px;
  color: #003afa;
}
.stu_ct {
  display: flex;
  flex-wrap: wrap;
}
.stu_item {
  margin-bottom: 10px;
  margin-right: 20px;
  width: 88px;
  height: 30px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 0px 4px 0px rgba(227, 227, 227, 0.25);
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: center;
  color: #3c445e;
  line-height: 30px;
}
.box {
  padding: 10px;
  margin-bottom: 10px;
  /* margin-top: 20px; */
  background-color: #fff;
  border-radius: 8px;
}
</style>
