<template>
  <div class="wrapper invest">
    <div class="main">
      <div class="filter-condition">
        <div class="retrieval-box">
          <div class="input-cell industry-analysis" v-if="pageName=='trade'">
              <span class="cell-name">选择行业：</span>
              <div class="btn-pop">
                  <span type="text" class="input-text" :class="tradeNameCls" @click="selectIndustry">{{tradeName}}</span>
                  <i class="iconfont icon-arrow-down"></i>
              </div>
          </div>
          <div class="input-cell industry-analysis" v-if="pageName=='chain'">
                <span class="cell-name">产&#8194;业&#8194;链：</span>
                <div class="btn-pop">
                    <span type="text" class="input-text" @click="selectIndustry">{{finanServeName}}</span>
                    <i class="iconfont icon-arrow-down"></i>
                </div>
            </div>
          <div class="retrieval-wrap">
            <div class="retrieval-header">
              <span class="cell-name">排列：</span>
              <el-select v-model="params.sort" @change="sort" placeholder="请选择">
                <el-option
                  v-for="item in sortOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="btn-box">
                <div class="btn" @click="provinceListShow" :class="{onBtn:provinceList}">{{pcTagName[0]}}</div>
                <div class="btn" @click="enterMerchantsList">列表查看</div>
              </div>
            </div>
            <div class="retrieval-content" v-if="!provinceList">
              <ul class="company-list">
                <li class="company-list-cell" v-for="(company,index) in mapData.placeData">
                  <div class="title"><i class="icon">{{index+1}}</i><span class="name">{{company.name}}</span> - <a @click="goToCloud(company.name)">详情</a></div>
                  <div class="info-box">
                    <p><span class="name">注册日期</span>：<span class="value">{{company.registerDate}}</span></p>
                    <p><span class="name">行业分类</span>：<span class="value">{{company.industry}}</span></p>
                 <!--    <p><span class="name">资本需求</span>：<span class="value">{{company.capital}}</span></p> -->
                    <p><span class="name">资产总计</span>：<span class="value">{{company.assets}}</span></p>
                    <p><span class="name">营业收入</span>：<span class="value">{{company.income}}</span></p>
                  </div>
                </li>
              </ul>
              <div class="retrieval-pages">
                  <pagination
                  :pageSize = "params.pageSize"
                  :total="total"
                  :layout = "layout"
                  :page = "params.page"
                  @pageChange="pageChange">
                  </pagination>
              </div>
            </div>
            <div class="retrieval-content" v-if="provinceList">
                <div class="TABLE table-none">
                    <table cellspacing='0'>
                        <tr class="th">
                            <td>{{pcTagName[1]}}</td>
                            <td>企业总数</td>
                            <td>占比</td>
                            <td>近1年注册</td>
                            <td>占比</td>
                        </tr>
                        <tr v-for="region in mapData.regionData">
                            <td>{{region.name}}</td>
                            <td>{{region.value}}</td>
                            <td>{{region.nRatio}}</td>
                            <td>{{region.register}}</td>
                            <td>{{region.rRatio}}</td>
                        </tr>
                    </table>
                </div>
              <ul class="province-list">
                  <div class="TABLE">
                      <table cellspacing='0'>
                          <tr class="th-hide">
                              <td>省份</td>
                              <td>企业总数</td>
                              <td>占比</td>
                              <td>近1年注册</td>
                              <td>占比</td>
                          </tr>
                          <tr v-for="region in mapData.regionData">
                              <td :title="region.name">{{region.name}}</td>
                              <td>{{region.value}}</td>
                              <td>{{region.nRatio}}</td>
                              <td>{{region.register}}</td>
                              <td>{{region.rRatio}}</td>
                          </tr>
                      </table>
                  </div>
              </ul>
            </div>
          </div>
        </div>
          <map-charts :mapData="mapData" v-on:backProvince="backProvince"></map-charts>
      </div>
    </div>
    <!-- 产业/服务弹窗 -->
    <dialog-elem class="subdivided-industry"
               :dialogVisible="dialogVisible"
               :title = "severTitle"
               :hasBtn="true"
               @closeDialog="dialogVisible = false"
               @sureDialog="sureDialog">
        <subdivided v-if="pageName=='trade'" v-on:selectCurrentTrade="selectCurrentTrade" class="subdivided" areaOrTrade="industry"></subdivided>
        <product-services v-if="pageName=='chain'"  v-on:changeIndustry="changeServe"></product-services>
    </dialog-elem>
    <bg-body></bg-body>
  </div>
</template>
<script>
  import {post, get} from 'assets/js/api'
  import bgBody from 'components/bg-body/bg-body'
  import pagination from 'components/pagination/pagination'
  import dialogElem from 'components/dialog/dialog'
  import productServices from 'pages/product-services/product-services'
  import Subdivided from 'components/subdivided/subdivided'
  import mapCharts from 'components/map-charts/map-charts'
  import {cloudEntUrl} from 'assets/js/utility'
  import {mapMutations} from 'vuex'

  export default {
    name: 'invest',
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 当前行业
        currentTrade: '',
        // 确定按钮后 输出的 当前行业
        sureCurrentTrade: '',
        // 当前 服务
        serveName: '',
        // 确定按钮后 输出的 当前 服务
        sureServeName: '',
        // navData 行业上面那一排数据
        navData: [],

        pageName:'',
        sortOptions: [
        {
            value: '1',
            label: '营业收入'
        },{
            value: '2',
            label: '资产规模'
        },{
            value: '3',
            label: '注册资本'
        }],
        provinceList:false,
        total:0,
        layout : "prev, pager, next,total",
        dialogVisible: false,// 弹窗
        params:{
            name:'',
            industry: '',
            province: 'china',
            sort:'1',
            page:1,
            pageSize:10
        },
        mapData:{
          province:'china',
          regionData:[],
          placeData:[]
        },
        pcTagName:['省城统计','省份']
      }
    },
    watch: {
        "$route": "getPageName"
    },
    activated:function () {

    },
    created:function (){
      this.getPageName();
    },
    computed: {
        tradeNameCls() {
            if (this.sureCurrentTrade.name) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        tradeName() {
            if (this.sureCurrentTrade.name) {
                return this.sureCurrentTrade.name
            } else {
                return '全部'
            }
        },
        // 服务 最终的选取的 服务
        finanServeName() {
            if (this.sureServeName) {
                return this.sureServeName
            } else {
                return '全部'
            }
        },
        severTitle() {
            let flag = this.$route.params.direction
            return flag === 'trade' ? '细分行业' : '产品/服务'
        }
    },
    methods:{
        goToCloud(entName){
            let idNum =Math.floor((Math.random()*10))*10;
            top.window.addTab(cloudEntUrl+entName,entName,idNum+'zst')
        },
        demoData:function () {
            function randomData() {
                return Math.round(Math.random() * 100);
            }
            if (this.params.province == 'china'){
                this.mapData.regionData =[
                    {"name":"全部", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name":"北京", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "天津", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "上海", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "重庆", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "河北", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "河南", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "云南", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "辽宁", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "黑龙江", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "湖南", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "安徽", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "山东", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "新疆", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "江苏", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "浙江", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "江西", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "湖北", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "广西", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "甘肃", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "山西", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "内蒙古", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "陕西", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "吉林", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "福建", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "贵州", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "广东", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "青海", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "西藏", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "四川", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "宁夏", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "海南", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "台湾", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "香港", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {"name": "澳门", "value":randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'}
                ];
            }else{
                this.mapData.regionData = [
                    {name: '巴音郭楞蒙古自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '和田地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '哈密地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿克苏地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿勒泰地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '喀什地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '塔城地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '昌吉回族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '克孜勒苏柯尔克孜自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '吐鲁番地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '伊犁哈萨克自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '博尔塔拉蒙古自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '乌鲁木齐市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '克拉玛依市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿拉尔市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '图木舒克市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '五家渠市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '石河子市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '那曲地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿里地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '日喀则地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '林芝地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '昌都地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '山南地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '拉萨市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '呼伦贝尔市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿拉善盟', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '锡林郭勒盟', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鄂尔多斯市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '赤峰市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '巴彦淖尔市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '通辽市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '乌兰察布市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '兴安盟', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '包头市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '呼和浩特市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '乌海市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '海西蒙古族藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '玉树藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '果洛藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '海南藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '海北藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黄南藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '海东地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '西宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '甘孜藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阿坝藏族羌族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '凉山彝族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '绵阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '达州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '广元市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '雅安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宜宾市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '乐山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南充市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '巴中市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '泸州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '成都市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '资阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '攀枝花市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '眉山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '广安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '德阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '内江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '遂宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '自贡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黑河市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '大兴安岭地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '哈尔滨市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '齐齐哈尔市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '牡丹江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '绥化市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '伊春市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '佳木斯市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鸡西市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '双鸭山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '大庆市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鹤岗市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '七台河市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '酒泉市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '张掖市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '甘南藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '武威市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '陇南市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '庆阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '白银市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '定西市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '天水市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '兰州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '平凉市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '临夏回族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '金昌市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '嘉峪关市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '普洱市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '红河哈尼族彝族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '文山壮族苗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '曲靖市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '楚雄彝族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '大理白族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '临沧市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '迪庆藏族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '昭通市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '昆明市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '丽江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '西双版纳傣族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '保山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '玉溪市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '怒江傈僳族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '德宏傣族景颇族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '百色市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '河池市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '桂林市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '柳州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '崇左市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '来宾市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '玉林市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '梧州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '贺州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '钦州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '贵港市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '防城港市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '北海市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '怀化市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '永州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '邵阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '郴州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '常德市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '湘西土家族苗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '衡阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '岳阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '益阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '长沙市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '株洲市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '张家界市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '娄底市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '湘潭市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '榆林市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '延安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '汉中市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '安康市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '商洛市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宝鸡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '渭南市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '咸阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '西安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '铜川市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '清远市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '韶关市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '湛江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '梅州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '河源市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '肇庆市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '惠州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '茂名市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '江门市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阳江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '云浮市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '广州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '汕尾市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '揭阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '珠海市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '佛山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '潮州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '汕头市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '深圳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '东莞市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '中山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '延边朝鲜族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '吉林市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '白城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '松原市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '长春市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '白山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '通化市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '四平市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '辽源市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '承德市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '张家口市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '保定市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '唐山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '沧州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '石家庄市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '邢台市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '邯郸市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '秦皇岛市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '衡水市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '廊坊市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '恩施土家族苗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '十堰市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宜昌市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '襄樊市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黄冈市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '荆州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '荆门市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '咸宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '随州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '孝感市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '武汉市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黄石市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '神农架林区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '天门市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '仙桃市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '潜江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鄂州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '遵义市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黔东南苗族侗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '毕节地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黔南布依族苗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '铜仁地区', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黔西南布依族苗族自治州', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '六盘水市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '安顺市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '贵阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '烟台市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '临沂市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '潍坊市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '青岛市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '菏泽市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '济宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '德州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '济源市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '滨州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '聊城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '东营市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '台北市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '高雄市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '威海市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '日照市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '淄博市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '枣庄市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '莱芜市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '赣州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '吉安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '上饶市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '九江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '抚州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宜春市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南昌市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '景德镇市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '萍乡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鹰潭市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '新余市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '信阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '洛阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '驻马店市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '周口市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '商丘市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '三门峡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '新乡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '平顶山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '郑州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '安阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '开封市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '焦作市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '许昌市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '濮阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '漯河市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鹤壁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '大连市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '朝阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '丹东市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '铁岭市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '沈阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '抚顺市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '葫芦岛市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阜新市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '锦州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '鞍山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '本溪市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '营口市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '辽阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '盘锦市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '忻州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '吕梁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '临汾市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '晋中市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '运城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '大同市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '长治市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '朔州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '晋城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '太原市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阳泉市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '六安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '安庆市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '滁州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宣城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '阜阳市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宿州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '黄山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '巢湖市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '亳州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '池州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '合肥市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '蚌埠市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '芜湖市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '淮北市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '淮南市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '马鞍山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '铜陵市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南平市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '三明市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '龙岩市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宁德市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '福州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '漳州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '泉州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '莆田市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '厦门市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '丽水市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '杭州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '温州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宁波市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '舟山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '台州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '金华市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '衢州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '绍兴市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '嘉兴市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '湖州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '盐城市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '徐州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南通市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '淮安市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '苏州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '宿迁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '连云港市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '扬州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '南京市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '泰州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '无锡市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '常州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '镇江市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '吴忠市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '中卫市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '固原市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '银川市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '石嘴山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '儋州市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '文昌市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '乐东黎族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '三亚市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '琼中黎族苗族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '东方市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '海口市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '万宁市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '澄迈县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '白沙黎族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '琼海市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '昌江黎族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '临高县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '陵水黎族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '屯昌县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '定安县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '保亭黎族苗族自治县', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'},
                    {name: '五指山市', value: randomData(),"nRatio":randomData()+'%',"register":randomData(),"rRatio":randomData()+'%'}
                ];
            }
            this.mapData.placeData = [
                {"id":"123","name":"通威股份有限公司","registerDate":"1995-12-08","industry":"金融业","capital":"3,336,400万元","assets":"5,336,400万元","income":"15,189,900万元","value":[121.15, 31.89]},
                {"id":"123","name":"通威股份有限公司","registerDate":"1995-12-08","industry":"金融业","capital":"3,336,400万元","assets":"5,336,400万元","income":"15,189,900万元","value":[120.38, 37.35]},
                {"id":"123","name":"通威股份有限公司","registerDate":"1995-12-08","industry":"金融业","capital":"3,336,400万元","assets":"5,336,400万元","income":"15,189,900万元","value":[123.97, 47.33]},
                {"id":"123","name":"通威股份有限公司","registerDate":"1995-12-08","industry":"金融业","capital":"3,336,400万元","assets":"5,336,400万元","income":"15,189,900万元","value":[120.13, 33.38]} ]

            this.mapData.province = this.params.province;

        },
        backProvince:function (data) {
            this.params.province = data;

            if (data=='china'){
                this.pcTagName = ['省城统计','省份'];
            }else{
                this.pcTagName = ['城市统计','城市'];
            }
            this.resetPage();
        },
        sort:function () { //排序切换事件
            this.resetPage();
        },
        resetPage:function () { //重置页数
            let _this = this;
            if (_this.params.page==1){
                this.getCompanyData();
            }else{
                _this.params.page = 1;
            }
        },
        getCompanyData:function () { //发起请求获取数据
            let _this = this;
            get('/investment/invest/getCompanyData', {
                params: _this.params
            }).then((response) => {
                let jsonArr = response.data; 
                if (jsonArr.code=='1'){
                    //地图数据
                    _this.mapData.regionData = jsonArr.data.regionData;
                    //地图标注
                    _this.mapData.placeData = jsonArr.data.companyList;
                    _this.mapData.province = this.params.province;
                    
                    _this.total = parseInt(jsonArr.data.companyNum)
                    
                    //_this.demoData();
                }else{
                    console.log(jsonArr.msg);
                }
            })
        },
        getPageName:function () { //行业招商和产业链招商切换
            let params = this.$route.params;
            this.pageName = params.direction;
            this.params = {
                name:this.pageName,
                province: 'china',
                industry:'',
                sort:'1',
                page:1,
                pageSize:10
            };
            this.resetPage();
            //this.getCompanyData();
            //console.log(this.pageName);
        },
        pageChange(val) { //分页改变事件
            this.params.page = val;
            this.getCompanyData(true);
        },
        selectIndustry:function () { //行业/产业链弹框显示
          this.dialogVisible = true;
        },
        selectCurrentTrade:function (val) { //获取行业选项
            this.currentTrade = val
        },
        changeServe:function (val) { //获取产业链选项
            this.serveName = val
            //alert(this.serveName);
        },
        provinceListShow:function () { //省市数据查看
          let show = this.provinceList;
          if (show){
              this.provinceList = false;
          }else {
              this.provinceList = true;
          }
        },
        sureDialog:function(){ //弹框确认按钮执行事件
            // 确定按钮后 所选择的行业
            this.sureCurrentTrade = this.currentTrade
            // vuex 中最后一个行业，提供给后台查询该行业 属于哪一个
            // 现在仅仅是传给下一个页面中显示一下即可
            this.setTradeOne(this.currentTrade)

            // vuex 中将 tradeFlag 置为true 以便在下一个组件 直接展示选择的行业
            // this.setTradeFlagOne(true)

            this.params.industry = this.currentTrade.name;
//alert(this.params.industry);
            this.dialogVisible = false;
            this.resetPage();
            //this.getCompanyData();

            // 服务部分
            this.sureServeName = this.serveName
            this.setServeOne(this.serveName)

            this.params.industry = this.serveName
        },
        enterMerchantsList() {
            let direction = this.$route.params.direction
            this.$router.push({
                name: `MerchantsList`,
                params: {
                    direction: `${direction}`
                },
                query: {
                    from: `${direction}`,
                }
            })

            // vuex 中 将 tradeFlagone 设为true 将首页的 使 行业招商页面能够成功或许vuex中 tradeOne
            this.setTradeFlagOne(true)
            this.setServeFlagOne(true)
        },
        ...mapMutations({
            setTradeOne: 'SET_TRADE_ONE',
            setTradeFlagOne: 'SET_TRADE_FLAG_ONE',

            setServeOne: 'SET_SERVE_ONE',
            setServeFlagOne: 'SET_SERVE_FLAG_ONE'
        })
    },
    components: {
      bgBody,
      pagination,
      dialogElem,
      productServices,
      mapCharts,
      Subdivided
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
      padding:40px;
      height: calc(100vh - 140px);
      font-size: $fz-sm;
      width: 100%;
      position: relative;
      background-image: url("chinaMapBg.png");
      background-repeat: no-repeat;
  }

  .invest {
      .retrieval-box {
          width: 377px;
          position: relative;
          float: right;
          z-index: 10;
          height: 100%;
          .input-cell .el-select{
              width: calc(100% - 85px);
              margin-left: 10px;
              margin-right: 0;
          }
          .el-input__inner {
              padding-right: 20px;
          }
          .el-pagination {
              color: #fff;
              padding: 11px 5px;
          }
      }
  }
  .retrieval-wrap {
    border-radius: 10px ;
    overflow: hidden;
      height: calc(100% - 65px);
      ::-webkit-scrollbar
      {
          width: 5px;
          height: 5px;
      }
      /*定义滚动条轨道*/
      ::-webkit-scrollbar-track
      {
          border-radius: 10px;
          background-color: #18375a;
      }
      /*定义滑块*/
      ::-webkit-scrollbar-thumb
      {
          border-radius: 10px;
          background-color: #0764b4;
      }
    .retrieval-header {
      height: 55px;
      line-height: 55px;
      border-radius: 10px 10px 0 0 / 10px 10px 0 0;
      width: 100%;
      padding:0 20px;
      background: rgba(102, 175, 255, 0.5);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow: hidden;
      .el-select {
        width: 100px;
        height: 100%;
      }
      .btn-box {
        float: right;
        .btn {
          width:80px;
          border: 1px solid #6389c2;
          background: #013077;
        }
        .btn:hover,.onBtn{
          background: #eb572d;
        }
      }
    }
    .retrieval-content{
      overflow: hidden;
        height: calc(100% - 55px);
      .btn-cell {
        margin-bottom: 15px;
        overflow: hidden;
      }
    }
    .retrieval-pages {
        margin-top: 1px;
        @extend %bg-four;
        border-radius:0;
        .number:hover,.active {
            color: #fff;
            background: #fd6541 !important;
        }
    }
    .company-list , .province-list {
        height: calc(100% - 62px);
      overflow: auto;
      .company-list-cell {
        @extend %bg-two;
        border-radius:0;
        margin-top: 1px;
        padding: 20px;
        .title {
          font-size: 18px;
          font-weight: 600;
          .icon {
            vertical-align: middle;
            margin-right: 9px;
            display: inline-block;
            height: 18px;
            font-size: 12px;
            line-height: 18px;
            text-align: center;
            width: 16px;
            background-color: #eb572d;
            color: #fff;
            position: relative;
          }
          .icon:after,.icon:before {
            content: '';
            position: absolute;
            bottom: -8px;
            display: inline-block;
            width: 0;
            height: 0;
          }
          .icon:after{
            left: 0;
            border-top: 8px solid #eb572d;
            border-right: 8px solid transparent;
          }
          .icon:before{
            right: 0;
            border-top: 8px solid #eb572d;
            border-left: 8px solid transparent;
          }
          .name {
            color: #fff;
          }
          a {
            color: #24befe;
            cursor: pointer;
          }
        }
        .info-box {
          padding: 0 25px;
          p {
            margin-top: 15px;
            .name {

            }
            .value {

            }
          }
          p:first-child {
            margin-top: 20px;
          }

        }
      }
      .company-list-cell:hover{
          background: rgba(102, 175, 255, 0.5);
      }
    }
  }
  .input-cell {
    margin-bottom: 0;
    margin-bottom: 35px;
    .cell-name{
      width: 100px;
      font-size: 14px !important;
      margin-right: 0 !important;
    }
  }
  /*表格样式*/
  .TABLE {
      border-collapse: collapse;
      text-align: center;
  }
  .TABLE table {
      width: 100%; font-size: 16px;table-layout: fixed;
  }
  .TABLE tr {
      @extend %bg-two;
      border-radius:0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      margin-top: 1px;
      cursor: pointer;
  }
  .TABLE tr:hover {
      background: rgba(102, 175, 255, 0.5);
  }
  .TABLE .th {
      background-color: #66afff !important;
  }
  .TABLE  td {
      color: #fff !important; white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;
  }
  .TABLE .th-hide,.table-none tr {
      height: 0;
      line-height: 0;
      color: transparent;
  }
  .table-none .th {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
  }
  .TABLE .ct {
      color: #26b1e2 !important;
  }
  .industry-analysis {
      .btn-pop {
          position: relative;
          flex: auto;
          width: 100%!important;
      }
  }
</style>
