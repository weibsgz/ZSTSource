<template>
    <div data-comp="garden-policy-component" class="wrapper">
        <bg-body></bg-body>        
        <div class="GardenPolicyShow-wrap" v-if="">
            <div class="garden-policy-title">
            <v-title title="园区政策" fillet="2" titleHeight="56" iconSize="24" titleSize="18" icon="icon-park-level"></v-title>
            <div class="content bg-two">
                <div class="search-area">
                    <input v-model="gardenNamePolicy" class="input-text" placeholder="请输入您要查找的园区名称或政策关键词">
                    <button class="btn confirm" @click="searchList">查找</button>
                </div>
                <div class="select-area">                  
                    <el-select style="margin-right:20px;" v-model="gardenLevelValue" @change="changeGardenLevel" placeholder="园区级别">
                      <el-option
                        v-for="item in selectOptions.gardenLevel"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>

                    <el-select v-model="gardenTypeValue" @change="changeGardenType" placeholder="园区类型">
                      <el-option
                        v-for="item in selectOptions.gardenType"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="garden-policy-content-wrap" v-show="gardenPolicyList.dataList">
            <ul class="garden-card">
                <li class="garden-card-item" v-for="item in gardenPolicyList.dataList">
                    <p class="garden-name" @click="gotoIntro(item)">{{item.title}}</p>
                    <ul>
                        <li v-for="item1 in item.list">
                            <span class="title"><a target="_blank" :href="item1.url" v-html="item1.article"></a></span>
                            <span class="date-time">{{item1.time}}</span>
                        </li>                        
                    </ul>
                </li>
            </ul>

        </div> 
        <loading v-show="!gardenPolicyList.dataList"></loading>
        <div class="page-warp" v-show="gardenPolicyList.dataList">
            <pagination
                    :pageSize = "pageSize"
                    :total="total"
                    :layout = "layout"
                    :page="page"
                    :isChange="handlePageChage"  
                    @pageChange="pageChange"
                    >
            </pagination>
        </div>  
        </div>
        <!-- <router-view></router-view> -->  
    </div>
</template>

<script>
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import pagination from 'components/pagination/pagination'
import {post,get} from 'assets/js/api'
import loading from 'components/loading/loading'

export default {
    name: 'garden-policy',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    mounted(){
        // if(!this.$router.params.id){
        //     this.GardenPolicyShow = true
        // }
        // setTimeout(()=>{
        //     this.renderList()
        // },1000)
        console.log(!this.gardenPolicyList.dataList)
        this.$nextTick(()=>{
             // setTimeout(()=>{
             //     this.renderList()              
             
             //    this.renderSelect()
             // },1000)
             this.renderList()            
             
             this.renderSelect()
            
        })
    },
    data() {
        return {
            
            //列表信息展示的条数           
            pageSize:10,
            total:50,            
            layout : "prev, pager, next,total,jumper",
            page:1,
            currentPage:1,
             // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            gardenNamePolicy:"",//输入的
            // 下拉框的内容
            selectOptions:{
                gardenLevel:[
                    // {"value":"gardenLevel1","name":"园区级别1"},
                    // {"value":"gardenLevel2","name":"园区级别2"},
                    // {"value":"gardenLevel3","name":"园区级别3"}
                ],
                gardenType:[
                    // {value:"gardenType1",name:"园区类型1"},
                    // {value:"gardenType2",name:"园区类型2"},
                    // {value:"gardenType3",name:"园区类型3"}
                ]
            },
            // 下拉框中 的 value 值
           
            gardenLevelValue: '',   // 园区级别
            gardenTypeValue: ''  ,   // 园区类型
              
           
            //大列表数据
            gardenPolicyList:{
                "dataList":null
            }
        }
           
    },
    watch:{
       
    },
    methods:{
        searchList(){
            this.page = 1;
             //阻止发送2次请求
            this.handlePageChage = false;
            this.renderList()
        },
        changeGardenLevel(){
            this.page = 1;
             //阻止发送2次请求
            this.handlePageChage = false;
            this.renderList()
           
        },
        changeGardenType(){
           this.page = 1;
           //阻止发送2次请求
           this.handlePageChage = false;
           this.renderList()
        
        },
        pageChange(val){
            console.log(`你给后台发送的数据是 当前是第${val}页 每页${this.pageSize}条`)
            this.page = val;
            this.renderList()
            this.handlePageChage = false;
        },
        gotoIntro(item){
           console.log(JSON.stringify(item,null,2))
            this.$router.push({
               name:`GardenIntro`,
               params:{
                id: item.id

               }

            })
        },
        renderList(){
            //this.$axios.get('api/garden/gardenPolicyList'),then(())

            get('/investment/park/gardenPolicyList',{
                params: {
                  gardenNamePolicy: this.gardenNamePolicy,
                  page:this.page,
                  pageSize:this.pageSize,
                  gardenLevel:this.gardenLevelValue,
                  gardenType:this.gardenTypeValue
                }
            }).then( (response)=> {   
                 this.total = response.data.totalRecord;
                this.gardenPolicyList.dataList=response.data.data;

                // 激活分页点击事件
                this.handlePageChage = true
              })
              .catch(function (error) {
                console.log('服务器错误');

                // 激活分页点击事件
                this.handlePageChage = true
              });


            // this.$axios.get('/investment/park/gardenPolicyList', {
            //     params: {
            //       gardenNamePolicy: this.gardenNamePolicy,
            //       page:this.page,
            //       pageSize:this.pageSize,
            //       gardenLevel:this.gardenLevelValue,
            //       gardenType:this.gardenTypeValue
            //     }
            //   })
            //   .then( (response)=> {
            //     console.log('数据渲染开始')                 
            //      this.total = response.data.totalRecord;
            //     this.gardenPolicyList.dataList=response.data.data;

            //     // 激活分页点击事件
            //     this.handlePageChage = true
            //   })
            //   .catch(function (error) {
            //     console.log(error);

            //     // 激活分页点击事件
            //     this.handlePageChage = true
            //   });
        },
        renderSelect(){
            get('/investment/select',{
                params: {
                  selectName:'gardenLevel'
                }
            }).then( (response)=> {
                
                 this.selectOptions.gardenLevel = response.data.data.gardenLevel;
                 this.selectOptions.gardenType = response.data.data.gardenType;
                console.log(this.selectOptions.gardenType)
              })
              .catch(function (error) {
                console.log(error);
              });
            // this.$axios.get('/investment/select', {
            //     params: {
            //       selectName:'gardenLevel'
            //     }
            //   })
            //   .then( (response)=> {
                
            //      this.selectOptions.gardenLevel = response.data.data.gardenLevel;
            //      this.selectOptions.gardenType = response.data.data.gardenType;
            //     console.log(this.selectOptions.gardenType)
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
    .garden-policy-title{       
        .content {
            padding: 22px 13px 22px 13px;
            box-sizing: border-box;
            @extend %bg-two;
            display: flex;
            justify-content:space-between;
            .search-area{
                input{
                    margin-right: 10px;
                    width: 300px;
                }
                button{

                }
            }
            .select-area{
                display: flex

            }
        }
    }

    .garden-policy-content-wrap{
        display: flex;
        margin-top: 20px;
        width: 100%;

        ul.garden-card{
            display: flex;
            width: 100%;
            flex-wrap:wrap;        
            justify-content: space-between;
            li.garden-card-item{
                width: 49%;
                height: 250px;
                box-sizing:border-box;
                margin-bottom: 1px;
                padding:10px;
                background-color: rgba(37,84,139,.8);
                @include animation;
                &:nth-child(4n+1), &:nth-child(4n+2) {
                     background-color: rgba(50,104,165,.8);
                }
                &:hover{
                     background-color: rgba(85,152,266,.8);
                     ul{
                        li{
                             span.date-time{
                                color: #fff;
                            }
                        }
                     }
                }
                p.garden-name{
                    font-size: 16px; 
                    color:#fff;
                    line-height: 30px;
                    cursor: pointer;
                    font-weight: bold;
                    position:relative;
                    margin-left:15px;
                    &:before{
                        content: '';
                        position:absolute;
                        left: -13px;
                        top:50%;
                        transform: translate(0,-50%);
                        width: 8px;
                        height: 8px;
                        border-radius:50%;
                        background-color:#42ccff;
                    }
                    &:hover{
                        text-decoration: underline;
                    }
                }
                ul{
                    li{
                        display: flex;
                        justify-content: space-between;
                        line-height:40px;
                        border-bottom:1px dashed #d8dfe9;
                        cursor: pointer;
                        span.title{
                            width: 70%;
                            @include no-wrap();
                            color:#e2e8f0;
                            font-size: 14px;
                        }
                         span.date-time{
                            width: 30%;
                            color:#95abca;
                            font-size: 14px;
                            text-align: right;
                        }
                        &:last-child{
                            border:0
                        }
                        &:hover{
                            color:#000;
                        }
                        a{
                            color:#fff;
                        }
                    }
                }
            }

        }
    }
    
    .page-warp{
        display: flex;
        justify-content: flex-end;
        padding:15px 0 50px 0;
    }
</style>
