<template>
    <div data-comp="garden-search" class="wrapper">
        <bg-body></bg-body> 
        <v-title title="查找企业" titleHeight="56" iconSize="24" titleSize="18" fillet="2" icon="icon-jianzhu"></v-title>       
        <div class="garden-search-wrap">
           <div class="content bg-two">
                <div class="search-area">
                    <input class="input-text" v-model="gardenNamePolicy" placeholder="请输入您要查找的园区名称">
                    <button class="btn confirm" @click="searchList">查找</button>
                </div>
                <div class="select-area">                  
                    <el-select style="margin-right:20px;" 
                    v-model="gardenLevelValue" @change="changeGardenLevel" placeholder="园区级别">
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

        <div class="garden-search-content-wrap" v-if="entList">
            <ul class="garden-card">
                <li class="garden-card-item" v-for="item in entList" @click="gotoIntro(item)">
                   <div class="garden-pic">
                      <img :src="item.entPic" :style="{width:'110px',height:'123px'}">
                   </div>

                   <div class="garden-detail">
                       <ul>
                         <li v-html="item.entName"></li>
                         <li><span>地址：</span><span v-html="item.entAddress"></span></li>
                         <li><span>电话：</span><span v-html="item.entTel"></span></li>
                         <li><span>网址：</span><span v-html="item.entUrl"></span></li>
                       </ul>
                   </div>
                </li>
            </ul>
        </div> 
        <loading v-if="!entList"></loading>
         <div class="page-warp" v-if="entList">
            <pagination
                    :pageSize = "pageSize"
                    :total="total"
                    :page="page"
                    :isChange="handlePageChage"
                    :layout = "layout"
                    @pageChange="pageChange">
            </pagination>
        </div>  
     </div>
</template>


<script>
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import pagination from 'components/pagination/pagination'
import {post,get} from 'assets/js/api'
import loading from 'components/loading/loading'
export default{
  data(){
    return {
          gardenNamePolicy:'',
          pageSize:10,
          total:50,
          page:1,
          layout : "prev, pager, next,total,jumper",
          // 处理分页改变时 是否 发送请求
          handlePageChage: true,
      // 下拉框的内容
          selectOptions:{
              gardenLevel:[],
              gardenType:[]
          },
          // 下拉框中 的 value 值
       
          gardenLevelValue: '',   // 园区级别
          gardenTypeValue: '' ,    // 园区类型
            
     

          //模拟企业列表
          entList:null
    }
  },

  created(){
    console.log(this.$route.params.gardenName)
    this.$nextTick(()=>{     
             this.renderList()
             this.renderSelect()
    })
  },
   methods:{
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
            this.page = val;
            this.renderList()
        },
        gotoIntro(item){
            console.log(item)
            this.$router.push({
               name:`GardenIntro`,
               params:{
                id: item.entId
               }
            })
        },
        searchList(){
            console.log('查找')
            this.page = 1;
             //阻止发送2次请求
            this.handlePageChage = false;
            this.renderList()
        },
        renderList(){
          get('/investment/park/searchPark', {
                params: {
                  gardenNamePolicy: this.gardenNamePolicy,
                  gardenName:this.$route.params.gardenName,                  
                  page:this.page,
                  pageSize:this.pageSize,
                  gardenLevel:this.gardenLevelValue,
                  gardenType:this.gardenTypeValue
                }
          }).then( (response)=> {
                console.log('数据渲染开始')                 
                 this.total = response.data.totalRecord;
                this.entList=response.data.data.entList;
                // 激活分页点击事件
                this.handlePageChage = true
              })
              .catch(function (error) {
                console.log(error);
                // 激活分页点击事件
                this.handlePageChage = true
            });

          // this.$axios.get('/investment/park/searchPark', {
          //       params: {
          //         gardenNamePolicy: this.gardenNamePolicy,
          //         gardenName:this.$route.params.gardenName,                  
          //         page:this.page,
          //         pageSize:this.pageSize,
          //         gardenLevel:this.gardenLevelValue,
          //         gardenType:this.gardenTypeValue
          //       }
          //     })
          //     .then( (response)=> {
          //       console.log('数据渲染开始')                 
          //        this.total = response.data.totalRecord;
          //       this.entList=response.data.data.entList;
          //       // 激活分页点击事件
          //       this.handlePageChage = true
          //     })
          //     .catch(function (error) {
          //       console.log(error);
          //       // 激活分页点击事件
          //       this.handlePageChage = true
          //   });
        },
        renderSelect(){
            get('/investment/select', {
                params: {
                  selectName:'gardenLevel'
                }
              })
              .then( (response)=> {                
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
  .garden-search-wrap{
      display: flex; 
      .content{
        width: 100%;
        padding: 16px 20px;
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

  .garden-search-content-wrap{
        display: flex;
        margin-top: 20px;
        width: 100%;
        ul.garden-card{
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            justify-content: space-between;
            li.garden-card-item{
                display: flex;
                width: 49%;
                height: 180px;
                cursor: pointer;
                box-sizing:border-box;
                margin-bottom: 1px;
                padding:25px;
                background-color: rgba(37,84,139,.8);
                @include animation;
                &:nth-child(4n+1), &:nth-child(4n+2) {
                     background-color: rgba(50,104,165,.8);
                }
                &:hover{
                     background-color: rgba(85,152,266,.8);
                }
                .garden-pic{
                  flex: 0 0 112px;
                  border:1px solid #ccc;
                  box-sizing:border-box;
                  height: 125px;
                  border-radius:8px;
                  img{
                    border-radius:8px;
                  }
                }
                .garden-detail{
                  flex: 1;
                  flex-direction: column;
                  padding:0 10px 10px 30px;
                  line-height: 24px;
                  ul{
                    li{
                      span{

                      }
                      &:first-child{
                        font-size: 16px;
                        margin-bottom: 10px;
                      }
                    }
                  }
                }
                
            }

        }
  }

  .page-warp{
        display: flex;
        justify-content: flex-end;
        padding:15px 0;
    }
</style>