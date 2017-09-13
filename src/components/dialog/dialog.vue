<template>
    <div class="dialog-wrap" ref="dialog">
       <el-dialog
        :title="title"
        :visible="dialogVisible"
        :before-close="handleClose">
        <slot></slot>
        <span slot="footer" v-if="hasBtn" class="dialog-footer">
          <el-button type="primary" @click="sureDialog">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
      props:{
          dialogVisible:{
              type:Boolean,
              default:false
          },
          title:{
             type:String,
             default:''
          },
          hasBtn:{
             type:Boolean,
             default:true
          }
      },
      mounted() {
        let width = this.$refs.clientWidth;
        // this.$refs.dialog.querrySelector(".el-dialog").style.width = width + 'px'
      },
      methods:{
        handleClose(){
          this.$emit('closeDialog')
        },
        sureDialog(){
          this.$emit('sureDialog')
        }
      }

    }

  </script>

<style lang="scss">

</style>
