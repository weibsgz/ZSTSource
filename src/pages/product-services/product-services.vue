<template>
  <div class="product-services">
  <div class="btn-box" v-if="!chartsShow">
    <el-radio-group v-model="product" @change="openCharts">
      <el-radio-button label="大金融"></el-radio-button>
      <el-radio-button label="TMT"></el-radio-button>
      <el-radio-button label="大健康"></el-radio-button>
      <el-radio-button label="交通物流"></el-radio-button>
      <el-radio-button label="节能环保"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="机械制造"></el-radio-button>
      <el-radio-button label="工程机械"></el-radio-button>
      <el-radio-button label="仪器仪表"></el-radio-button>
      <el-radio-button label="大化工"></el-radio-button>
      <el-radio-button label="新材料"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="电池产业"></el-radio-button>
      <el-radio-button label="食品饮料"></el-radio-button>
      <el-radio-button label="家居产业"></el-radio-button>
      <el-radio-button label="家电及配套产业"></el-radio-button>
      <el-radio-button label="房地产"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="海洋经济"></el-radio-button>
      <el-radio-button label="精密电子及零部件"></el-radio-button>
      <el-radio-button label="轨道机车"></el-radio-button>
      <el-radio-button label="印刷包装"></el-radio-button>
      <el-radio-button label="水处理"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="农、林、牧、渔业"></el-radio-button>
      <el-radio-button label="文化传媒"></el-radio-button>
      <el-radio-button label="零售与贸易"></el-radio-button>
      <el-radio-button label="教育培训"></el-radio-button>
      <el-radio-button label="物联网"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="冶金工业"></el-radio-button>
      <el-radio-button label="能源产业"></el-radio-button>
      <el-radio-button label="汽车"></el-radio-button>
      <el-radio-button label="电力产业"></el-radio-button>
      <el-radio-button label="智慧城市"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="建筑建材"></el-radio-button>
      <el-radio-button label="纺织服装"></el-radio-button>
      <el-radio-button label="国防军工"></el-radio-button>
      <el-radio-button label="航空航天"></el-radio-button>
      <el-radio-button label="工业4.0"></el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="product">
      <el-radio-button label="公共事业及其他服务"></el-radio-button>
    </el-radio-group>
  </div>
  <div class="charts" id="charts" v-show="chartsShow"><span @click="closeCharts" >图表</span></div>
  </div>
</template>
<script>
window.d3=require('../../assets/js/d3-v4.10.0.min.js')
const ChartLib=require('../../assets/js/chart-library.min.js')
import simulator from '../../assets/js/commonjs-simulator.min.js'


export default {
    name: 'product-services',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            product:'',
            chartsShow:false
        }
    },
    created:function () {

    },
    methods: {
        openCharts:function () {
            this.chartsShow = true;

            setTimeout(()=>{
                this.initCharts();
            },1)
        },
        closeCharts:function () {
            this.product = '';
            this.chartsShow = false;
        },
        initCharts:function () {
            var _this = this;
            var btns = document.getElementById('charts');
                btns.innerHTML = '';

            var polarGroupedBranchChart = new ChartLib.PolarGroupedBranchChart();
            polarGroupedBranchChart.data = require('../../assets/js/json/tree-01.json');
            polarGroupedBranchChart.width = btns.offsetWidth;
            polarGroupedBranchChart.height = btns.offsetHeight;
            polarGroupedBranchChart.spaceRadius = btns.offsetHeight;
            polarGroupedBranchChart.on('itemClick', function (e) {
                if(e.data.id==1){
                    _this.closeCharts();
                    return;
                };
                _this.product = e.data.name;
                console.log(e);
                _this.$emit("changeIndustry",_this.product);
            });
            btns.appendChild(polarGroupedBranchChart.domElement);
        }
    },
    components: {
        //simulator
    }
}
</script>

<style lang="scss">
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";
.product-services {
  width: 762px;
  .el-radio-group {
      width: 100%;
      margin-top: 15px;
      .el-radio-button {
          width: 20%;
          padding-left: 20px;
          box-sizing: border-box;
      }
      .el-radio-button:first-child {
          padding-left: 0;
      }
      .el-radio-button__inner {
          width:100%;
          overflow: hidden;
          background-color: #0063bb;
          border-color: #2374d4;
          text-align: left;
          margin-left: 0;
      }
      .el-radio-button__inner:hover, .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: #fd6541;
          border: 1px solid #fd6541 !important;
      }
  }
  .el-radio-group:first-child {
      margin-top: 0;
  }
    .charts {
        height:450px;
    }
}
</style>
