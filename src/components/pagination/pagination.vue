<template>
    <div class="pagination-wrap">
        <el-pagination
            :page-size="pageSize"
            :total="total"
            :layout = "layout"
            :current-page = "currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            >
        </el-pagination>
        <el-button v-if="hasBtn" slot class="pagenation-btn">确定</el-button>

    </div>
</template>

<script>
  export default {
      props:{
          pageSize:{ //每页条数
              type:Number,
              default:10
          },
          total:{  //总页数
              type:Number,
              default:100
          },
          layout:{
            type:String,
            default:"prev, pager, next,total,jumper"
          },
          page:{  //当前页
             type:Number,
             default:1
          },
          isChange: {
            type: Boolean,
            default: true
          }
      },
      data() {
        return {
          currentPage: 1
        }
      },
      computed:{
         hasBtn(){
            return this.layout.indexOf('jumper') > 0
         },
         // currentPage() {
         //    return this.page
         // }

         // currentPage: {
         //       get: function () {
         //         return this.page
         //       },
         //       set: function (v) {
         //         this.page = v
         //       }
         //     }

      },
      methods:{
          handleCurrentChange(val){
                if (this.isChange) {
                    this.$emit('pageChange',val)
                }
          },
          handleSizeChange(val){
               this.$emit('pageSizeChange',val)
          }
      },
      watch: {
        page: function (val, oldVal) {
              this.currentPage = val
           }
      }
  }

  </script>

<style lang="">


</style>
