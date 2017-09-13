<template>
    <div data-comp="garden-intro-component" class="wrapper">
        <bg-body></bg-body> 
       <v-title title="园区介绍" titleHeight="56" titleSize="18" fillet="4" iconSize="24" icon="icon-jieshao"></v-title>
        <div class="garden-intro-wrap">
            <div class="garden-intro-left content bg-four">
                <div class="intro">
                    <dl v-for="(item,index) in introData">
                        <dt>{{item.name}}</dt>
                        <dd>{{item.value}}</dd>
                    </dl>
                </div>
                <ul>
                    <li @click="goToEnt"><i class="iconfont icon-iconfontqiye"></i>园区企业</li>
                    <li @click="goToAnaysis"><i class="iconfont icon-Paas_icon-"></i>园区分析</li>
                </ul>
            </div>
            <div class="garden-intro-center content bg-four">
                <p class="title">{{gardenName}}</p>
                <div class="intro-center-content" v-html="gardenIntroDetail">
                    
                </div>
            </div>
            <loading v-if="!introData.length"></loading>
            <div class="garden-intro-right ">
                <div class="garden-intro-right-item content bg-four" >
                    <v-title title="园区政策" titleHeight="56" titleSize="18" fillet="2" icon="line"></v-title>
                    <ul>
                        <li v-for="item in gardenPolicyList"><span v-html="item.title"></span></li>
                        
                    </ul>
                    <div class="page-warp">
                        <pagination
                                :pageSize = "pageSize"
                                :total="totalPolicy"
                                :layout = "layout"
                                @pageChange="pageChange1">
                        </pagination>
                    </div>
                </div>

                <div class="garden-intro-right-item content bg-four" style="margin-top:20px;">
                    <v-title title="园区动态" titleHeight="56" titleSize="18" fillet="2" icon="line"></v-title>
                    <ul>
                         <li v-for="item in gardenTrendsList"><span v-html="item.title"></span></li>
                    </ul>
                    <div class="page-warp">
                        <pagination
                                :pageSize = "pageSize"
                                :total="totalTrends"
                                :layout = "layout"
                                @pageChange="pageChange2">
                        </pagination>
                    </div>
                </div>

            </div>


        </div>
        
    </div>
</template>

<script>
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import pagination from 'components/pagination/pagination'
import {post,get} from 'assets/js/api'
import loading from 'components/loading/loading'
export default {
    name: 'garden-intro',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    created(){
       this.$nextTick(()=>{     
             this.render();
             this.renderPolicyList()
             this.renderTrendsList()
        })
    },
  
    data() {
        return {
            //列表信息展示的条数
            pageSize:5,

            totalPolicy:12,
            totalTrends:12,

            pagePolicy:1, //园区政策当前页
            pageTrends:1, //园区动态当前页

            layout : "prev, pager, next",
            
            //园区介绍数据
            gardenName:"",
            gardenIntroDetail:"",
            introData:[],
            gardenPolicyList:[],
            gardenTrendsList:[]

        }
    },
    methods:{
      
        pageChange1(val){            
            this.pagePolicy = val;
            this.renderPolicyList()
        },
        pageChange2(val){        
            this.pageTrends = val;
            this.renderTrendsList()
        },
        searchGarden(){
            
        },
        goToAnaysis(){
            this.$router.push({
               name:`GardenAnalysis`,
               params:{
                 id:this.$route.params.id
               }
            })
        }
        ,
        goToEnt(){
            this.$router.push({
               name:`GardenEntList`,
               params: {
                    id: this.$route.params.id
               }
            })
        },
        render(){

            get('/investment/park/gardenIntro',{
              params: {
                  id: this.$route.params.id,

                }
            }).then( (response)=> {
                console.log(response) 
                this.introData = response.data.data.leftList;                
                this.gardenName = response.data.gardenName;
                this.gardenIntroDetail = response.data.data.content;
              })
              .catch(function (error) {
                console.log(error);
              });


            // this.$axios.get('/investment/park/gardenIntro', {
            //     params: {
            //       id: this.$route.params.id,

            //     }
            //   })
            //   .then( (response)=> {
            //     console.log(response) 
            //     this.introData = response.data.data.leftList;                
            //     this.gardenName = response.data.gardenName;
            //     this.gardenIntroDetail = response.data.data.content;
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        },
        renderPolicyList(){
            get('/investment/park/policyList',{
                params: {
                  id: this.$route.params.id,
                  page:this.pagePolicy,
                  pageSize:this.pageSize
                }
              }).then( (response)=> {
                this.gardenPolicyList = response.data.data.dataList;
                this.totalPolicy = response.data.totalRecord;
              })
              .catch(function (error) {
                console.log(error);
              });


            // this.$axios.get('/investment/park/policyList', {
            //     params: {
            //       id: this.$route.params.id,
            //       page:this.pagePolicy,
            //       pageSize:this.pageSize
            //     }
            //   })
            //   .then( (response)=> {
            //     this.gardenPolicyList = response.data.data.dataList;
            //     this.totalPolicy = response.data.totalRecord;
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        },
        renderTrendsList(){
            get('/investment/park/trendsList',{
                params: {
                  id: this.$route.params.id,
                  page:this.pageTrends,
                  pageSize:this.pageSize
                }
            }).then( (response)=> {
                this.gardenTrendsList = response.data.data.dataList;
                this.totalTrends = response.data.totalRecord;
              })
              .catch(function (error) {
                console.log(error);
              });

            // this.$axios.get('/investment/park/trendsList', {
            //     params: {
            //       id: this.$route.params.id,
            //       page:this.pageTrends,
            //       pageSize:this.pageSize
            //     }
            //   })
            //   .then( (response)=> {
            //     this.gardenTrendsList = response.data.data.dataList;
            //     this.totalTrends = response.data.totalRecord;
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        }
    },
    components:{
        bgBody,
        VTitle,
        pagination,
        loading
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";
    .garden-intro-wrap{
        // display: flex;
        margin-top: 20px;
        // align-items: flex-start;   
        @include flex(space-between, flex-start)
        .content{            
            box-sizing: border-box;
            @extend %bg-four;
            display: flex;
            justify-content:space-between;
        }
        .garden-intro-left{
            flex: 0 0 235px;
             flex-direction:column ;
            .intro{
                padding: 16px 13px 0 22px;
                dl{
                    margin-bottom: 20px;
                    display: flex;
                    font-size: 14px;                    
                    dt{
                        
                        width: 80px;
                    }
                    dd{
                         margin:0 15px;
                    }
                }
            }
            ul{
                li{
                    height: 40px;
                    line-height: 40px;
                    background-color: #285588;
                    border-top:1px solid #09203a;
                    padding:0 15px;
                    cursor: pointer;
                    .iconfont{
                        display: inline-block;
                        box-sizing:border-box;
                        padding-left:15px;
                        font-size:26px;
                        color:#ff802b;
                        vertical-align: middle;
                        margin-right: 25px;
                        width: 40px;
                    }
                    .icon-Paas_icon-{
                        font-size: 20px;
                        padding-left:19px;
                    }
                    &:last-child{
                        border-radius: 0 0 10px 10px
                    }
                }
            }
        }
        .garden-intro-center{
             flex: 1;
             margin:0 15px;
              padding: 16px 13px 0 22px;
             box-sizing:border-box;
             flex-direction:column ;
             line-height: 24px;
             .title{
                font-weight: bold;
                font-size: 16px;
                line-height: 40px;
             }
             .intro-center-content{
             
                p{
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 40px;
                    margin: 10px 0;
                 }
             }
             
             
        }
        .garden-intro-right{
            flex: 0 0 335px;
              flex-direction:column ;
            .garden-intro-right-item{
                width: 100%;
                line-height: 24px;
                font-size:14px; 
                flex-direction:column ;            
                ul{
                    flex-direction:column ;
                       padding: 10px 13px 3px 22px;    
                    li{
                        margin-top:5px;
                         border-bottom:1px dotted #ccc;
                         box-sizing:border-box;
                         cursor: pointer;
                         span{
                            width: 90%;
                            display: inline-block;
                            @include no-wrap();
                         }
                         &:last-child{
                            border:0
                         }
                    }
                }
                .page-warp{
                    display: flex;
                    justify-content: flex-end
                }
            }
        }
    }
</style>

<style lang="scss">
    
    .garden-intro-center{
           
             .intro-center-content{
                
                p{
                    font-weight: bold;
                    font-size: 14px;
                    margin-top: 15px;
                 
                 }
             }
             
             
        }
</style>