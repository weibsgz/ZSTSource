<template>
    <div data-comp="garden-intro-anaysis" class="wrapper">
        <bg-body></bg-body> 
        <v-title title="园区分析" fillet="4" icon="icon-Paas_icon-"></v-title>
        <div class="garden-anaysis">
            <div class="content bg-four">
                <div class="title">
                    <div class="l-title">
                        <div class="line"></div>
                        <span>{{parkData.parkName}}</span>
                    </div>
                    <div class="r-title" @click="gotoGarenEnt">查看园区企业</div>
                </div>
                <div class="cont">
                    <p>园区概况：</p>
                    <div v-html="parkData.parkProfile">
                            
                    </div>
                    <div @click="goToIntro" class="more">>>更多</div>
                </div>
            </div>
            <div class="overview content bg-four">
               <ul>
                   <li>
                       <dl>
                           <dt>企业总数：</dt>
                           <dd>{{parkData.overviewList.entNum}}</dd>
                       </dl>
                   </li>

                   <li>
                       <dl>
                           <dt>新注册企业：</dt>
                           <dd>{{parkData.overviewList.newEnt}}(近12个月)</dd>
                       </dl>
                       <dl>
                           <dt>资本活跃度：</dt>
                           <dd>{{parkData.overviewList.assetActivity}} 笔投资融事件（近12个月）</dd>
                       </dl>
                   </li>
                   <li>
                       <dl>
                           <dt>上市企业：</dt>
                           <dd>{{parkData.overviewList.listedEnt}}</dd>
                       </dl>
                       <dl>
                           <dt>创新能力：</dt>
                           <dd>{{parkData.overviewList.innovationAbility}} 项专利</dd>
                       </dl>
                   </li>
                    <li>
                       <dl>
                           <dt>僵尸企业：</dt>
                           <dd>{{parkData.overviewList.deadEnt}} (连续3年未公布企业年报)</dd>
                       </dl>
                       <dl>
                           <dt>企业诉讼：</dt>
                           <dd>{{parkData.overviewList.entLitigation}} 个诉讼案件（近12个月）</dd>
                       </dl>
                   </li>
               </ul>
            </div>

             <div class="entNum content bg-four">
               <div class="title">
                    <div class="l-title">
                        <div class="line"></div>
                        <span>企业总数</span>
                    </div>                    
               </div>
               <div class="ent-wrap">
                   <div class="ent-lineCharts">
                       <lineChart :lineChartsData="lineChartsData" @clickYear="clickYear"></lineChart>
                   </div>
                   <div class="ent-lineTable">
                       <p class="year">{{tableYear}}年：</p>
                       <table>
                           <tr v-for="item in tableData">
                               <td>{{item.name}}</td>
                               <td>{{item.value}}</td>
                           </tr>
                       </table>
                   </div>
               </div>
            </div>

            <div class="industrial-distribution-wrap content bg-four">
                <div class="title flex-space-between">
                    <div class="l-title">
                        <div class="line"></div>
                        <span>{{pieChartsData.data.name}}</span>
                    </div>      
                    <div class="title-list">
                        <ul>
                            <li v-for="(item,index) in industryTitle" :class="{'active':textIndex === index}" @click="changePie(item,index)">
                                <i class="iconfont" :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </li>
                    
                        </ul>
                    </div>              
               </div>
               <div class="pie-wrap">
                   <pieChart ref="pieChart" :pieChartsData="pieChartsData"></pieChart>
               </div>
            </div>


            <div class="ent-punish-wrap content bg-four">
                <div class="title">
                    <div class="l-title">
                        <div class="line"></div>
                        <span>企业诉讼处罚</span>
                    </div>     
                          
               </div>
               <div class="pie-wrap">
                   <lineChart :lineChartsData="lineChartsData1"></lineChart>
               </div>
            </div>


        </div>
        
     </div>
</template>

<script>
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import lineChart from 'components/line/line'
import pieChart from 'components/pie/pie'
import {post,get} from 'assets/js/api'
export default {
    name: 'garden-anaysis',
    props: {
        title: {
            type: String,
            default: 'lineChart'
        }
    },
    data() {
        return {
            //模拟数据概览
            parkData:{
                parkName:"",
                parkProfile:"",
                overviewList:{
                    // entNum: 69027, //企业总数
                    // newEnt: 5747, //新注册企业
                    // assetActivity : 6 , //资本活跃度
                    // listedEnt : 12 ,  //是上市企业
                    // innovationAbility:  578,  //创新能力
                    // deadEnt : 360 ,//僵尸企业 
                    // entLitigation : 690 , //企业诉讼
                }
            },
            
            lineChartsData:{
                id:'lineChart',
                height : 500,
                option:{
                    "xAxis":{
                        "name":"",
                        "data":[]
                    },
                    "series":{
                        "name":"",
                        "data":[]
                    }
                }
            },
            tableYear:"",
            tableData:[],

            // 饼图部分
            textIndex:0,
            industryTitle:[
                {
                    name:'产业分布',
                    icon:'icon-fenbu'
                },
                {
                    name:'注册资金分布',
                    icon:'icon-zijin'
                },
                {
                    name:'从业人员规模分布',
                    icon:'icon-renyuan'
                },
                {
                    name:'企业性质',
                    icon:'icon-kaoshixingzhi'
                },
                {
                    name:'企业产品多样化',
                    icon:'icon-chanpin1'
                }
            ],
            pieType:1,
            pieChartsData:{
                id:'pieChart',
                height : 600,
                data:{
                    name: '产业分布',
                    data:[]
                    }
            }

            ,//企业诉讼惩罚柱状图
            lineChartsData1:{
                id:'lineChart1',
                height : 500,
                option:{
                    "xAxis":{
                        "name":"",
                        "data":[]
                    },
                    "series":{
                        "name":"",
                        "data":[]
                    }
                }
            },    
        }
    },
    mounted(){
       this.$nextTick(()=>{     
             this.renderProfile();
             this.renderLine1();
             this.renderTable();
             this.renderPie();
             this.renderLine2();
        })
    },
    methods:{
        clickYear(year){
            console.log(year)
            this.tableYear = year;
            this.renderTable()
        },
        changePie(item,index){
            this.textIndex = index;
            this.pieType = index + 1;
            this.renderPie();
            // let data = {
            //         name: '注册资金分布',
            //         data:[
            //                 {name:'农、林、牧、渔业',value:300},
            //                 {name:'采矿业',value:1000},
            //                 {name:'制造业',value:400},
            //                 {name:'电力、燃气及水的生产和供应业',value:60},
            //                 {name:'交通运输、仓储和邮政业',value:2200},
            //                 {name:'批发和零售业',value:1700},
            //                 {name:'住宿和餐饮业',value:7289},
            //                 {name:'金融业',value:100},
            //             ]
            //         }
           
            // this.pieChartsData.data = data;
            // this.$refs.pieChart.initPieChart()
        },
        gotoGarenEnt(){

            this.$router.push({
               name:`GardenEntList`,
               params: {
                    id: this.$route.params.id
               }
            })
        },
        goToIntro(){
            this.$router.push({
               name:`GardenIntro`,
               params:{
                 id: this.$route.params.id
               }

            })
        },
        renderProfile(){
            get('/investment/park/parkAnalysisProfile', {
                params: {
                  id: this.$route.params.id,
                }
            }).then( (response)=> {
                this.parkData.parkName = response.data.data.title
                this.parkData.parkProfile = response.data.data.gardenProfile
                this.parkData.overviewList = response.data.data
              })
              .catch(function (error) {
                console.log(error);
              });
            // this.$axios.get('/investment/park/parkAnalysisProfile', {
            //     params: {
            //       id: this.$route.params.id,
            //     }
            //   })
            //   .then( (response)=> {
            //     this.parkData.parkName = response.data.data.title
            //     this.parkData.parkProfile = response.data.data.gardenProfile
            //     this.parkData.overviewList = response.data.data
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        },
        renderLine1(){
            get('/investment/park/AnalysisEntSumLineChart',{
                params: {
                  id: this.$route.params.id,
                }
            }).then( (response)=> {
                 this.lineChartsData.option= response.data.data;
              })
              .catch(function (error) {
                console.log(error);
            });



            // this.$axios.get('/investment/park/AnalysisEntSumLineChart', {
            //     params: {
            //       id: this.$route.params.id,
            //     }
            //   })
            //   .then( (response)=> {
            //      this.lineChartsData.option= response.data.data;
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        },
        renderTable(){
            get('/investment/park/analysisTable', {
                params: {
                  id: this.$route.params.id,
                  year:this.tableYear
                }
            }).then( (response)=> {
                 this.tableYear = response.data.data.year
                 this.tableData = response.data.data.dataList;
              })
              .catch(function (error) {
                console.log(error);
            });


            // this.$axios.get('/investment/park/analysisTable', {
            //     params: {
            //       id: this.$route.params.id,
            //       year:this.tableYear
            //     }
            //   })
            //   .then( (response)=> {
            //      this.tableYear = response.data.data.year
            //      this.tableData = response.data.data.dataList;
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        },
        renderPie(){
            get('/investment/park/AnalysisPie', {
                params: {
                  id: this.$route.params.id,
                  type:this.pieType
                }
            }).then( (response)=> {
                 this.pieChartsData.data= response.data.data
                 console.log(this.pieChartsData)
              })
              .catch(function (error) {
                console.log(error);
            });



             // this.$axios.get('/investment/park/AnalysisPie', {
             //    params: {
             //      id: this.$route.params.id,
             //      type:this.pieType
             //    }
             //  })
             //  .then( (response)=> {
             //     this.pieChartsData.data= response.data.data
             //     console.log(this.pieChartsData)
             //  })
             //  .catch(function (error) {
             //    console.log(error);
             //  });
        },
        renderLine2(){
              get('/investment/park/AnalysisEntLitigationChart', {
                params: {
                  id: this.$route.params.id,
                }
              }).then( (response)=> {
                 this.lineChartsData1.option= response.data.data;
              })
              .catch(function (error) {
                console.log(error);
              });


              // this.$axios.get('/investment/park/AnalysisEntLitigationChart', {
              //   params: {
              //     id: this.$route.params.id,
              //   }
              // })
              // .then( (response)=> {
              //    this.lineChartsData1.option= response.data.data;
              // })
              // .catch(function (error) {
              //   console.log(error);
              // });
        }
    },
    components:{
        bgBody,
        VTitle,
        lineChart,
        pieChart
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";
   .garden-anaysis{     
        display: flex;       
        flex-direction:column; 
        .content{
             margin-top: 20px;
            padding: 16px 20px;
            box-sizing: border-box;            
            @extend %bg-four;
            display: flex;
            flex-direction: column;
            .title{
                display: flex;
                flex-direction: row;
                .l-title{
                    .line {
                        display: inline-block;
                        width: 2px;
                        height: 20px;
                        margin-right: 5px;
                        color: $cl-text-red;
                        background: #fd6541;
                        vertical-align: middle;
                    }
                    span{
                        display: inline-block;
                    }
                    font-size: 14px;
                    font-weight: bold;
                    padding-top:5px;
                    color:#fff;
                }
                .r-title{
                    color:#a5d0ff;
                    border:1px solid #6389c2;
                    border-radius:30px;
                    background-color: #013077;
                    text-align: center;
                    padding: 5px 25px;
                    margin-left: 30px;
                    cursor: pointer;
                    &:hover{
                      background-color: #012a69;
                    }
                }
                .title-list{
                    ul{
                        display: flex;
                        li{
                            margin-right:20px;
                            padding-top:5px;
                            cursor: pointer;
                          @include animation;
                            &:hover{
                                color: #fd6541;
                                border-bottom:1px solid #fd6541;
                            }
                          &.active{
                                color: #fd6541;
                                border-bottom:1px solid #fd6541;
                          }

                        }
                    }
                }
                &.flex-space-between{
                    justify-content: space-between;
                    align-items: flex-start
                }
            }
            .cont{
                margin-top: 20px;
                line-height: 24px;
                display: flex;
                flex-direction:column; 
                .more{
                    text-align: right;
                    cursor: pointer;
                    &:hover{
                      text-decoration: underline;
                    }
                }
            }
        }

        .overview{
            ul{
                li{
                    display: flex;                   
                    line-height: 34px;
                    border-bottom:1px dotted #ccc;
                    &:last-child{
                        border-bottom:0;
                    }
                }
                dl{
                    display: flex;
                    dt{

                    }
                    dd{

                    }
                    &:nth-child(1){
                       width: 50%;
                    }
                }
            }
        }

        .entNum{
            .ent-wrap{
                display: flex;
                margin-top:20px; 
                .ent-lineCharts{
                    flex: 0 0 60%;
                    height: 500px;
                }
                .ent-lineTable{
                    flex:1;
                     flex-direction:column ;
                     p{
                        width: 80%;
                        font-size: 16px; 
                        font-weight: bold;
                        margin:0 auto 20px auto;
                     }
                    table{
                        width: 80%;
                        margin:0 auto;
                        tr{
                            td{
                               border:1px solid #fff;
                               padding:8px 10px; 
                               &:last-child{
                                text-align: center
                               }
                            }
                        }
                    }
                }
            }
        }

        .industrial-distribution-wrap{
            .pie-wrap{
                height: 550px;
            }
        }
   }
</style>
