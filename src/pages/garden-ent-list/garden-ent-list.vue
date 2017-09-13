<template>
    <div data-comp="garden-ent-list" class="wrapper">
        <bg-body></bg-body>
        <div class="garden-ent-list-select">
            <filter-condition class="filter-condition" @selectValues="selectValues">
              <div class="top">
                  <div class="title">
                      <div class="l-title">
                          <div class="line"></div>
                          <span> {{this.gardenName}}</span>
                      </div>

                  </div>
                  <div class="industry-analysis">
                        <span class="desc">行业细分：</span>
                        <div class="btn-pop" @click="subdividedDialogVisible = true">
                            <span type="text" class="input-text"
                            :class="tradeNameCls">{{tradeName}}</span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                  </div>
             </div>
          </filter-condition>
        </div>


         <v-title class="v-title" title="园区分析" @jump="goToAnalysis" fillet="4" icon="icon-Paas_icon-" diy="1">
              <ul class="list">
                  <li class="list-item">
                      <span class="desc">排序：</span>
                      <el-select v-model="sort" @change="changeGardenType" placeholder="营业收入">
                        <el-option
                          v-for="item in selectOptios"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </li>
              </ul>
         </v-title>

         <ul class="industries">
            <li class="list-item" v-for="item in recommend">
                <div class="avatar">
                    <img src="./menu-brand.jpg" height="58" width="65">
                </div>
                <div class="detail">
                    <!-- <h3 class="name"><a target="_blank"
                    :href="getTitleHref(item.name)"
                   >{{item.name}}</a></h3> -->
                   <h3 class="name" @click="goToCloud(item.name)">{{item.name}}</h3>
                    <div class="desc">
                        <div class="item">
                            <span>法人：</span>
                            <span>{{item.detail.legealPerson}}</span>
                        </div>
                        <div class="item">
                            <span>区域：</span>
                            <span>{{item.detail.area}}</span>
                        </div>
                        <div class="item">
                            <span>注册资金：</span>
                            <span>{{item.detail.registeredCapital}}</span>
                        </div>
                        <div class="item">
                            <span>注册时间：</span>
                            <span>{{item.detail.registrationTime}}</span>
                        </div>
                        <div class="item">
                            <span>营业收入：</span>
                            <span>{{item.detail.operatingIncome}}</span>
                        </div>
                        <div class="item">
                            <span>资产规模：</span>
                            <span>{{item.detail.assetSize}}</span>
                        </div>
                        <div class="item">
                            <span>企业电话：</span>
                            <span>{{item.detail.businessPhone}}</span>
                        </div>
                    </div>
                </div>
                <div class="result">
                    <span :class="[item.intentionInvestment == 1 || item.yxChecked == true ||
                    item.yjChecked == true ? 'default' : 'text']"
                    @click="openDialog(1,item)">意向招商</span>

                    <span :class="[item.alreadyInvestment == 1 || item.yjChecked == true ? 'default' : 'res']"
                    @click="openDialog(2,item)">已招商</span>
                </div>
            </li>
        </ul>
        <div class="page-warp">
            <pagination
                    :pageSize = "pageSize"
                    :total="total"
                    :page="page"
                    :isChange="handlePageChage"
                    :layout = "layout"
                    @pageChange="pageChange">
            </pagination>
        </div>

       <!--  <dialog-elem class="subdivided-industry"
                   :dialogVisible="dialogVisible"
                   title="提示"
                   :hasBtn="true"
                   @closeDialog="dialogVisible = false"
                   @sureDialog="sureDialog">
               <div style="width:400px; height:50px; line-height:50px">{{addTxt}}</div>
        </dialog-elem> -->

       <!--  //细分行业弹窗 -->
        <dialog-elem class="subdivided-industry"
                    :dialogVisible="subdividedDialogVisible"
                    title = "细分行业"
                    :hasBtn="true"
                    @sureDialog="subdividedSureDialog"
                    @closeDialog="subdividedDialogVisible = false">
                     <subdivided class="subdivided" @selectCurrentTrade="currentTradeFn"></subdivided>
        </dialog-elem>

        <tips :text="tipsText" :tipsShow="tipsShow"></tips>
     </div>


</template>


<script>
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import pagination from 'components/pagination/pagination'
import FilterCondition from 'components/filter-condition/filter-condition'
import dialogElem from 'components/dialog/dialog'
import Subdivided from 'components/subdivided/subdivided'
import tips from 'components/tips/tips'
import {post,get} from 'assets/js/api'
import {cloudEntUrl} from 'assets/js/utility'
export default{
  data(){
    return {
            page:1,
            pageSize:10,
            total:50,
             // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            layout : "prev, pager, next,total,jumper",
            addTxt:'',
            dialogVisible: false,
            tipsShow:false,
            tipsText:"",
            gardenName:"",
          // 下拉框的内容
            selectOptios: [
                    {value:"1",name:"营业收入"},
                    {value:"2",name:"资产规模"},
                    {value:"3",name:"注册资本"}
            ],
            // 下拉框中 的 value 值
            sort:"",

            selectValue: {
                legealLitigation: '',       // 法律诉讼
                administrationPunish: '',   // 行政处罚
                listedStatus: '',           // 上市情况
                financingstatus: '',        // 融资情况
                branchOffice: '',           // 分公司
                negativeInfo: '',           // 负面舆情
                supportIndustry: ''         // 国家扶持企业
            },

            recommend:[],
          // 细分行业弹窗
            subdividedDialogVisible: false,

            // 当前行业
            currentTrade: {},
            sureCurrentTrade: {}
    }
  },

  mounted(){

        this.$nextTick(()=>{
             this.renderList()

        })
    },


    watch: {
        //如果filter-condition组件的下拉有变化执行调取数据
        selectValue: function (newVal) {
            this.page = 1;
            //阻止发送2次请求
            this.handlePageChage = false;
            this.renderList()
        },
        sureCurrentTrade: function (newVal) {
            this.page = 1;
            //阻止发送2次请求
            this.handlePageChage = false;
            this.renderList()
        }
    },
   methods:{
        getTitleHref(entName){
           return cloudEntUrl+entName;

        },
        goToCloud(entName){
           let idNum =Math.floor((Math.random()*10))*10;
           top.window.addTab(cloudEntUrl+entName,entName,idNum+'zst')
        },
        currentTradeFn(newVal) {
            this.currentTrade = newVal
        },
       selectValues(val) {
            this.selectValue = val
        },
       goToAnalysis(){
            this.$router.push({
               name:`GardenAnalysis`,
               params:{
                 id:this.$route.params.id
               }
            })
       },
       changeGardenType(){
         this.page = 1;
         //阻止发送2次请求
         this.handlePageChage = false;
         this.renderList()
       },
       pageChange(val){
           this.page = val;
            this.renderList()
        },
        openDialog(val,item){

          if(val == 1){  //意向招商
             if(item.intentionInvestment == 1 || item.yxChecked == true){
                return
             }
          }

          else if(val == 2){ //已招商
            if(item.alreadyInvestment == 1 || item.yjChecked == true){
                return
             }
          }
          console.log(JSON.stringify(item,null,2))

         post('/investment/addToFav', {
                params: {
                  type:val,
                  entName:item.name
                }
              })
              .then( (response)=> {
                  this.tipsShow = true;
                  // val === 1?this.tipsText = '已收藏至 我的园区>>意向招商':
                  // this.tipsText = '已收藏至 我的园区>>已招商'

                  if(val == 1){
                      this.tipsText = '已收藏至 我的园区>>意向招商'
                      if(typeof item.yxChecked === 'undefined')
                      {
                            this.$set(item,"yxChecked",true)

                      }
                  }
                  else if(val == 2){
                      this.tipsText = '已收藏至 我的园区>>已招商'
                      if(typeof item.yjChecked === 'undefined')
                      {
                            this.$set(item,"yjChecked",true)
                            this.$set(item,"yxChecked",true)

                      }
                  }



                  setTimeout(()=>{
                    this.tipsShow = false;
                  },2000);
              })
              .catch(function (error) {
                console.log(error);
          });



          // this.$axios.get('/investment/addToFav', {
          //       params: {
          //         type:val,
          //         entName:item.name
          //       }
          //     })
          //     .then( (response)=> {
          //         this.tipsShow = true;
          //         // val === 1?this.tipsText = '已收藏至 我的园区>>意向招商':
          //         // this.tipsText = '已收藏至 我的园区>>已招商'

          //         if(val == 1){
          //             this.tipsText = '已收藏至 我的园区>>意向招商'
          //             if(typeof item.yxChecked === 'undefined')
          //             {
          //                   this.$set(item,"yxChecked",true)

          //             }
          //         }
          //         else if(val == 2){
          //             this.tipsText = '已收藏至 我的园区>>已招商'
          //             if(typeof item.yjChecked === 'undefined')
          //             {
          //                   this.$set(item,"yjChecked",true)
          //                   this.$set(item,"yxChecked",true)

          //             }
          //         }



          //         setTimeout(()=>{
          //           this.tipsShow = false;
          //         },2000);
          //     })
          //     .catch(function (error) {
          //       console.log(error);
          // });
        },
        sureDialog(){
          //点击弹窗确认的方法
          this.dialogVisible = false;
        },
        //点击弹窗确认后执行的方法
        subdividedSureDialog() {
            this.subdividedDialogVisible = false
            this.sureCurrentTrade = this.currentTrade
        },
        currentTradeFn(newVal) {
            this.currentTrade = newVal
        },
        renderList(){

          get('/investment/park/ent-list', {
                params: {
                  page:this.page,
                  pageSize:this.pageSize,
                  sortType:this.sort,
                  currentTrade: this.sureCurrentTrade,
                  ...this.selectValue
                }
          }).then( (response)=> {
                console.log('数据渲染开始')
                 this.total = response.data.totalRecord;
                 this.recommend=response.data.data.entList;
                 this.gardenName = response.data.gardenName

                 // 激活分页点击事件
                this.handlePageChage = true
          })
          .catch(function (error) {
            console.log(error);

            // 激活分页点击事件
            this.handlePageChage = true
          });


          // this.$axios.get('/investment/park/ent-list', {
          //       params: {
          //         page:this.page,
          //         pageSize:this.pageSize,
          //         sortType:this.sort,
          //         currentTrade: this.sureCurrentTrade,
          //         ...this.selectValue
          //       }
          //     })
          //     .then( (response)=> {
          //       console.log('数据渲染开始')
          //        this.total = response.data.totalRecord;
          //        this.recommend=response.data.data.entList;
          //        this.gardenName = response.data.gardenName

          //        // 激活分页点击事件
          //       this.handlePageChage = true
          //     })
          //     .catch(function (error) {
          //       console.log(error);

          //       // 激活分页点击事件
          //       this.handlePageChage = true
          //     });
        }
    },
    components:{
      bgBody,
      VTitle,
      pagination,
      FilterCondition,
      dialogElem,
      Subdivided,
      tips
    },
    computed: {
      tradeName() {
        if (Object.keys(this.sureCurrentTrade).length) {
          return this.sureCurrentTrade.name
        } else {
          return '全部'
        }
      },
       tradeNameCls() {
            if (this.sureCurrentTrade.name) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

// 法律诉讼处 多个 select list-item 的宽度
$width-list-item: 189px;

// 每个单元的 下边距
$module-mb: 24px;
  .garden-ent-list-select{
     display: flex;
     flex-direction:column;
     .filter-condition{
      padding-top:5px;
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
                        font-size: 16px;
                    }
                    font-size: 14px;
                    font-weight: bold;
                    padding-top:5px;
                    color:#fff;
                }
            }
     }


  }
  .v-title{
    ul{
        .list-item {
      position: relative;
      font-size: 0;
      text-align: right;
      // text-align-last: right;
      .desc, .el-select {
          display: inline-block;
          vertical-align: middle;
          font-size: $fz-sm;
      }
      .desc {
          position: absolute;
          right: 0;
          z-index: 1;
          right: 129px;
          top: 50%;
          width: 100px;
          transform: translate3d(0, -50%, 0);
      }
      // @include flex(flex-end);
      width: $width-list-item;
      margin-right: 15px;
      .el-select {
          width: 129px;
      }
}

    }
  }

.industries {
    overflow: hidden;
    margin-top: 24px;
    border-radius: 10px;
    .list-item {
        padding: $box-padding;
        @include flex(flex-start, stretch);
        background: rgba(102, 175, 255, 0.4);
        margin-bottom: 1px;
        @include animation;
        &:hover {
            background: rgba(102, 175, 255, 0.8);
        }
        .avatar {
            flex: 0 0 112px;
            // width: 112px;
            box-sizing: border-box;
            img {
                width: 112px;
                height: 126px;
                border: 1px solid #fff;
                border-radius: 10px;
                box-sizing: border-box;
            }
        },
        .result {
            flex: 0 0 60px;
            // width: 60px;
            box-sizing: border-box;
            .text, .res{
             cursor: pointer;
            }
        }
        .detail {
            flex: 1;
            box-sizing: border-box;
            margin-left: 24px;
        }
    }
}

.detail {
    @include flex(space-between, flex-start, column);
    .name {
        width: 100%;
        font-size: $fz-md;
        font-weight: bold;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
        a{
          color: #fff;
        }
    }
    .desc {
        @include flex(flex-start, flex-start, row, wrap);
        width: 100%;
        line-height: 1.8;
        .item {
            min-width: 35%;
        }
    }
}

.result {
    @include flex(space-between, flex-end, column);
    .text {
        padding-bottom: 15px;
        cursor: pointer;
        color: #6ddeff;
        @include animation;
        &:hover {
            color: #16C3F6;
        }
    }
    .res {
        padding-top: 15px;
        cursor: pointer;
        color: $cl-text-red;
        @include animation;
        &:hover {
            color: #d33b12;
        }
    }
    .default{
      color:#95a9c1;
    }
}

.page-warp{
        display: flex;
        justify-content: flex-end;
        padding:15px 0;
    }

    .industry-analysis {
        .desc {
            // width: 70px;
            flex: 0 0 70px;
        }
        .btn-pop {
            flex: 0 0 200px;
        }
    }

</style>
