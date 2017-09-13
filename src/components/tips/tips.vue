<template>
    <transition name="confirm-fade">
           <div class="tips-wrap" v-show="tipsShow">
              <div class="tips-box">
                <i class="iconfont icon-gantanhao_gray"></i>
                <span class="tips-text">{{text}}</span>
              </div>
           </div>
    </transition>
</template>

<script>

export default {
    name: 'garden-policy',
    props: {
        tipsShow: {
            type: Boolean,
            default: true,
        },
        text:{
            type:String,
            default:'请选择上传文件'
        }
    },
    created(){
        console.log(this.text)
    },

    watch:{

    },
    methods:{

    },
    components:{

    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";
    .confirm-fade-enter-active{
     /*  transition: all .3s;
       opacity:1; 这样也可以*/
      animation: confirm-fadein 0.3s;
   }

   .confirm-fade-leave-active{
      animation: confirm-fadeOut 0.3s;
   }

    @keyframes confirm-fadein{
         0%{ opacity: 0}

        100%{
          opacity: 1
        }
      }


   .tips-wrap {
      width: 100%;
      height: 100%;
      z-index: 100;
      text-align: center;
      position: fixed;
      top: -130px;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 1;
      z-index: 11111;
       transition: all 0.8s;
      .tips-box {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 15px 30px;
        border-radius: 5px;
        font-size: 16px;
        vertical-align: middle;
        .iconfont {
          font-size: 26px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .tips-text {
          vertical-align: middle
        }
      }
    }
    .tips-wrap:after{
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    .tipsShow {
      transition: all 0.8s;
      -moz-transition: all 0.8s;    /* Firefox 4 */
      -webkit-transition: all 0.8s; /* Safari 和 Chrome */
      -o-transition: all 0.8s;  /* Opera */
      opacity: 1;
    }
</style>
