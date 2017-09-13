<template>
    <div class="wrapper domestic-park">
        <div class="main">
          <div class="filter-condition">
            <div class="retrieval-box">
              <div class="search">
                <input v-model="searchGardenName" @keyup.enter="gotoGardenSearch" class="content" type="text" placeholder="请输入您要查找的园区名称" name="">
                <i class="iconfont icon-search"
                @click.prevent="gotoGardenSearch"></i>
              </div>
              <div class="retrieval-wrap park-level">
                <v-title title="园区级别" icon="icon-park-level" iconSize="24" titleSize="18" titleHeight="50"  fillet="2"></v-title>
                <div class="content">

                  <div class="btn-cell">
                      <el-radio-group v-model="params.parkLevel" @change="getParkData">
                          <el-radio-button v-for="level in levelArr" :label="level.name" :key="level.value"></el-radio-button>
                      </el-radio-group>
                  </div>
                </div>
              </div>
              <div class="retrieval-wrap park-type">
                <v-title title="园区类型" icon="icon-park-type" iconSize="24" titleSize="18" titleHeight="50"  fillet="2"></v-title>
                <div class="content">
                  <div class="btn-cell">
                      <el-radio-group v-model="params.parkType" @change="getParkData">
                          <el-radio-button v-for="type in typeArr" :label="type.name" :key="type.value"></el-radio-button>
                      </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="top5-box">
              <div class="title"><i class="top5"></i><span class="text">园区数量TOP5</span></div>
              <div class="city-box">
                <ul>
                    <li class="city-cell" v-for="(top5,index) in parkTop5Arr"><span class="name" :title="top5.region">{{index+1}}.{{top5.region}}</span><span class="lineWrap"><i class="line" :style="{width:top5.ratio}"></i></span><span class="num">{{top5.num}}</span></li>
                </ul>
              </div>
            </div>
            <map-charts :mapData="mapData" v-on:backProvince="backProvince"></map-charts>
          </div>
        </div>
      <!-- 新建我的园区弹窗 -->
      <dialog-elem class="subdivided-industry"
                   :dialogVisible="dialogVisible"
                   :title = "dialogTitle"
                   :hasBtn="false"
                   @closeDialog="dialogVisible = false"
                   @sureDialog="sureDialog">
        <add-my-park v-on:changeTitle="changeTitle" v-on:jumpUpload="jumpUpload"></add-my-park>
      </dialog-elem>
      <bg-body></bg-body>
    </div>
</template>
<script>
import {post, get} from 'assets/js/api'
import pagination from 'components/pagination/pagination'
import VTitle from 'components/title/title.vue'
import dialogElem from 'components/dialog/dialog'
import bgBody from 'components/bg-body/bg-body'
import mapCharts from 'components/map-charts/map-charts'
import addMyPark from 'pages/add-my-park/add-my-park'

import {getUser} from 'assets/js/user'

export default {
    name: 'index',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
          dialogTitle:'新建我的园区',
          dialogVisible: false,
          searchGardenName:"",  //输入的查找园区名称
          params:{
            province: "china",
            parkLevel:"全部",
            parkType:"全部"
          },
          levelArr:[],
          typeArr:[],
          mapData:{
              province:'china',
              regionData:[],
              placeData:[],
          },
          parkTop5Arr:[] //数组对象格式{"region":"北京","num":"50","ratio":"100%"}

        }
    },
    mounted: function () {
        // 渲染本组件数据
        setTimeout(() => {
            this.getRadioButton();
            this.getParkData();
        }, 200)
        // 存储用户信息
        getUser()
            .then((response) => {
                //console.log(response)
                if (response.getItem('parkId')) {
                    this.dialogVisible = false
                } else {
                    this.dialogVisible = true
                }
            })
            .catch((error) => {
                console.log(error)
                // 用户未登录，返回到登录界面
                // console.log('用户未登录，返回到登录界面')
                // window.location.href="https://www.baidu.com"
            })
    },
    methods:{
        backProvince:function (data) {
            this.params.province = data;
            //console.log(data);
            this.getParkData();
        },
        getRadioButton:function () {
            let _this = this;
            get('/investment/select', {
            }).then((response) => {
                let jsonArr = response.data;
                _this.levelArr = jsonArr.data.gardenLevel;
                _this.typeArr = jsonArr.data.gardenType;
                //console.log(response.data);
            });
        },
        getParkData:function () {
          let _this = this;
          get('/investment/domesticPark/getParkData', {
                params: this.params
            }).then((response) => {
                let jsonArr = response.data;
                if(JSON.stringify(jsonArr.data)=="{}"){
                    console.log('数据为空');
                    //return
                }
                //console.log(jsonArr.data);
                //地图数据
                _this.mapData.regionData = jsonArr.data.regionData;
                //地图标注
                _this.mapData.placeData = jsonArr.data.placeData;
                if (this.params.parkLevel=='全部' && this.params.parkType=='全部'){
                    _this.mapData.placeData = [];
                }
                _this.mapData.province = this.params.province;

                //园区数量Top5
                //let parkTop5 = _this.demoData(); //模拟数据 //
                let parkTop5 = jsonArr.data.parkTop5;
                let compare = function (prop) {
                    return function (obj1, obj2) {
                        let val1 = obj1[prop];
                        let val2 = obj2[prop];
                        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                            val1 = Number(val1);
                            val2 = Number(val2);
                        }
                        if (val1 > val2) {
                            return -1;
                        } else if (val1 < val2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
                parkTop5.sort(compare("num"));
                let maxNum = parseInt(parkTop5[0].num);

                parkTop5.forEach((arr)=>{
                    let ratio = parseInt(arr.num / maxNum *100)+'%';
                    arr.ratio = ratio;
                });
                //console.log(JSON.stringify(parkTop5));
                _this.parkTop5Arr = parkTop5;
            });
      },
        sureDialog(){
        //点击弹窗确认后执行的方法
        this.dialogVisible = false;
      },
        jumpUpload:function () {
        this.dialogVisible = false
      },
        changeTitle:function (data) {
        this.dialogTitle = data;
      },
        gotoGardenSearch(){
        // if(!this.searchGardenName){
        //   return
        // }
        this.$router.push({
          name:'GardenSearch',
          params:{
            gardenName:this.searchGardenName || 'all'
          }
        })
      }
   },
    components: {
        bgBody,
        VTitle,
        dialogElem,
        addMyPark,
        mapCharts,
        pagination
    }
}
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/variable.sass";
  @import "./../../assets/css/mixin.sass";
  $width-list-item: 169px;

  // 每个单元的 下边距
  $module-mb: 24px;
  .wrapper {
  }
  .main {
    @include flex(space-between, flex-start);
    .column {
      margin-top: 24px;
    }
  }

  .filter-condition {
    @extend %bg-four;
    box-sizing: border-box;
    padding: 20px 40px;
    height: calc(100vh - 180px);
    font-size: $fz-sm;
    width: 100%;
    position: relative;
    background-image: url("chinaMapBg.png");
    background-repeat: no-repeat;
  }
  .domestic-park {
      .retrieval-box {
          width: 280px;
          float: right;
          height: 100%;
          position: relative;
          z-index: 10;
          .search {
            position: relative;
            margin-bottom: 15px;
            .content {
              padding-left: 15px;
              width:100%;
              height: 31px;
              border: 1px solid  #6389c2;
              border-radius: 5px;
              box-sizing: border-box;
              color: $cl-text;
              background: #013077;
              outline: none;
            }
            .icon-search {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: $cl-text-red;
              cursor: pointer;
            }
          }
      }
  }
  .retrieval-box {
      .retrieval-wrap {
          margin-bottom: 10px;
          .content {
              @extend %bg-two;
              padding: 15px;
              overflow: auto;
              box-sizing: border-box;
              height: calc(100% - 55px);

              .btn-cell {
                  /*margin-bottom: 15px;*/
                  overflow: hidden;
              }
              .el-radio-group {
                  width: 100%;
                  .el-radio-button {
                      box-sizing: border-box;
                      margin-left: 10px;
                      margin-bottom: 15px;
                      min-width: 70px;
                      .el-radio-button__inner {
                          width: 100% !important;
                          margin-left: 0 !important;
                      }
                  }
              }
          }
      }
      .park-level {
          height: 35%;
      }
      .park-type {
          height: 45%;
      }
  }
  .park-type {
  }
  .park-type .content{
    /*min-height: 260px;*/
  }
  .top5-box {
    position: absolute;
    bottom: 40px;
    left: 40px;
    min-width:240px;
    border-radius: 5px;
    padding: 0 5px 5px 5px;
    border: 1px solid #548ac0;
    z-index: 10;
    .title {
      font-size: 0;
      padding: 0 15px;
      height: 45px;
      line-height: 45px;
      .top5 {
          height: 100%;
          width: 30px;
          background-image: url("top5.png");
          background-repeat: no-repeat;
          background-position: 0px center;
          display: inline-block;
          vertical-align: middle;
      }
      .text{
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .city-box {
      padding: 15px;
      border: 1px solid #233e86;
      background-color: #1b3a62;
      ul {
          min-height: 160px;
      }
      .city-cell:nth-child(-n+3) .name{
        color: #ff802b;
      }
      .city-cell {
        line-height: 16px;
        margin-top: 20px;
          font-size: 0;
          span{
              display: inline-block;
              vertical-align: middle;
              font-size: 14px;
          }
        .name {
            width: 60px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .lineWrap {
          display: inline-block;
          width: 135px;
          height: 10px;
          background-color: #112657;
          margin: 0 5px;
          border-radius: 0 10px 10px 0;
          overflow: hidden;
          position: relative;
        }
        .line{
            width: 0%;
            position: absolute;
          top: 0;
          bottom:0;
          left: 0;
          display: inline-block;
          height: 100%;
          background:-webkit-linear-gradient(left, #007fff, #00ddff);
          border-radius: 0 10px 10px 0;
          transition: width  0.3s;
          transform: translateZ(0);
        }
        .num {}
      }
    }
    .city-box .city-cell:first-child {
      margin-top: 0;
    }

  }
  .icon-search:hover{
      transition: color 0.2s ease-in;
      color: rgba(255,106,27,0.8) !important;
  }
</style>
