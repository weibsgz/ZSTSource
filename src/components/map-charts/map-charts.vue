<template>
    <div class="mapBox">
        <div class="back" v-if="backBtn" @click="backChina"><i class="iconfont icon-fanhui"></i><span>返回</span></div>
        <div class="mapWarp" id="mapWarp"></div>
    </div>
</template>

<script>
window.$=require('../../assets/js/jquery-1.12.3.min.js')
  export default {
      props:{
          mapData: {
              type: Object,
              default: () => {}
          }
      },
      data() {
        return {
            name:'',
            backBtn:false,
            myChart:null
        }
      },
      created:function () {
      },
      mounted:function () {
          this.initMap();
      },
      methods:{
          gotoIntro(id){
              this.$router.push({
                  name:`GardenIntro`,
                  params:{
                      id: id
                  }
              })
          },
          backChina:function () {
            this.name = 'china';
            this.$emit("backProvince",this.name);
            this.backBtn = false;
          },
          getJsonMap:function () {
              let _this = this;
              $.get('./static/geojson/' + _this.name + '.json', (geoJson) => {
                  _this.setMap(geoJson);
              });
          },
          provinceName:function (name) {
              let p = [
              {
                  id: "shanghai",
                  name: "上海"
              }, {
                  id: "hebei",
                  name: "河北"
              }, {
                  id: "shanxi",
                  name: "山西"
              }, {
                  id: "neimenggu",
                  name: "内蒙古"
              }, {
                  id: "liaoning",
                  name: "辽宁"
              }, {
                  id: "jilin",
                  name: "吉林"
              }, {
                  id: "heilongjiang",
                  name: "黑龙江"
              }, {
                  id: "jiangsu",
                  name: "江苏"
              }, {
                  id: "zhejiang",
                  name: "浙江"
              }, {
                  id: "anhui",
                  name: "安徽"
              }, {
                  id: "fujian",
                  name: "福建"
              }, {
                  id: "jiangxi",
                  name: "江西"
              }, {
                  id: "shandong",
                  name: "山东"
              }, {
                  id: "henan",
                  name: "河南"
              }, {
                  id: "hubei",
                  name: "湖北"
              }, {
                  id: "hunan",
                  name: "湖南"
              }, {
                  id: "guangdong",
                  name: "广东"
              }, {
                  id: "guangxi",
                  name: "广西"
              }, {
                  id: "hainan",
                  name: "海南"
              }, {
                  id: "sichuan",
                  name: "四川"
              }, {
                  id: "guizhou",
                  name: "贵州"
              }, {
                  id: "yunnan",
                  name: "云南"
              }, {
                  id: "xizang",
                  name: "西藏"
              }, {
                  id: "shanxi1",
                  name: "陕西"
              }, {
                  id: "gansu",
                  name: "甘肃"
              }, {
                  id: "qinghai",
                  name: "青海"
              }, {
                  id: "ningxia",
                  name: "宁夏"
              }, {
                  id: "xinjiang",
                  name: "新疆"
              }, {
                  id: "beijing",
                  name: "北京"
              }, {
                  id: "tianjin",
                  name: "天津"
              }, {
                  id: "chongqing",
                  name: "重庆"
              }, {
                  id: "xianggang",
                  name: "香港"
              }, {
                  id: "aomen",
                  name: "澳门"
              }, {
                  id: "taiwan",
                  name: "台湾"
              }];
              let n = null;
              p.forEach((i)=>{
                  if(i.name == name) {
                      n = i.id
                  }
              });
              return n;
          },
          initMap:function (){
              let _this = this;
              let e = document.getElementById('mapWarp');
              _this.myChart = _this.$echarts.init(e);
              _this.myChart.on('click',(params)=>{
                  //console.log(params);
                  _this.name =  _this.provinceName(params.name);

                  if (_this.name){
                      _this.$emit("backProvince",_this.name);
                      _this.backBtn = true;
                  }
                  if (params.seriesName == "park"){
                      _this.gotoIntro(params.data.id);
                  }
              });
              window.onresize = function(){
                  _this.myChart.resize();
              }
          },
          setMap:function (geoJson) {
              let _this = this;
              this.$echarts.registerMap(_this.name, geoJson);
              let option = {
                  tooltip:{
                      trigger: "item",
                      backgroundColor: "rgba(1,83,160,1)",
                      borderColor: "#33a4e7",
                      borderWidth: 2
                  },
                  visualMap: {
                      show:false,
                      type:'continuous',
                      seriesIndex:[1],
                      inRange: {
                          color: ["#24bfff","#258bd3","#3a71af","#28568a","#0d3163"]
                      }
                  },
                  geo: {
                      map: _this.name,
                      top:"5%",
                      right:'10%',
                      bottom:'auto',
                      left:'auto',
                      itemStyle:{
                          normal:{
                              borderColor:'#abebff',
                              borderWidth:1
                          },
                          emphasis:{
                              areaColor:'#f0c737',
                              borderColor:'#f7ea00'
                          }
                      },
                      label:{
                          normal:{
                              show:false 
                          },
                          emphasis:{
                              show:false
                          }
                      },
                      roam: true
                  },
                  series : [
                      {
                          name:'park',
                          type: 'scatter',
                          coordinateSystem: 'geo',
                          symbol: "circle",
                          symbolSize: [13, 25],
                          data: _this.mapData.placeData,
                          symbol: 'image://./static/image/icon.png',
                          tooltip:{
                              show:true,
                              formatter:function (e) {
                                  return e.data.name;
                              }
                          }
                      },
                      {
                          name: '园区数量',
                          type: 'map',
                          geoIndex: 0,
                          data:_this.mapData.regionData,
                          label:{
                              normal:{
                                  show:false
                              },
                              emphasis:{
                                  show:false
                              }
                          },
                          tooltip: {
                              formatter: function(e) {
                                  //console.log(e);
                                  if (!e.name){
                                      return
                                  }
                                  if (isNaN(e.value)){
                                      e.value = 0;
                                  }
                                  return e.seriesName + '<br/>' + e.name + ':' + e.value + '座';
                              }
                          }
                      }
                  ],
                  //animation:false
              };
              _this.myChart.setOption(option,true);
          }
      },
      watch:{
          mapData: {
              handler: function (val, oldVal) {
                  this.name = val.province;
                  if(this.name=='china'){
                      this.backBtn = false;
                  }
                  // console.log(JSON.stringify(this.mapData,null,2))
                  this.getJsonMap();
              },
              deep: true
          }
      }
  }

  </script>

<style lang="scss" scoped>
    .mapBox {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 5;
        padding-right: 280px;
        box-sizing: border-box;
        .mapWarp {
            width: 100%;
            height: 100%;
        }
        .back {
            z-index: 6;
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            border: 1px solid #6a85a5;
            background-color: rgba(106,133,165,0.4);
            padding: 0 15px;
            border-radius: 30px;
            height: 22px;
            line-height: 22px;
            cursor: pointer;
            font-size: 0;
            i{
                font-size: 12px;
                vertical-align: middle;
                margin-right: 5px;
            }
            span{
                font-size: 14px;
                color:rgba(255,255,255,0.6);
                display: inline-block;
                vertical-align: middle;
            }
        }
        .back:hover{
            background-color: rgba(106,133,165,0.8);
        }
    }
    .invest {
        .mapBox {
            padding-right: 377px !important;
        }
    }
</style>
