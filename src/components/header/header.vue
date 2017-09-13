<template>
    <!-- <div class="bg-header"> -->
        <div class="header">
            <div class="header-left">
                <!-- <div class="logo"><span class="content">招商通</span></div> -->
                <navigation></navigation>
            </div>
            <div class="header-right">
                <div class="search">
                    <input class="content" v-model="entName"
                    @keyup.enter="searchEntList" type="text" placeholder="请输入企业名称" name="">
                    <i @click="searchEntList" class="iconfont icon-search"></i>
                </div>
                <ul class="setting">
                    <router-link tag="li" class="item" :to="{name:'ParkInfo'}"><i class="user"></i></router-link>
                    <!-- <router-link tag="li" class="item" :to="{name:'/'}"><i class="iconfont icon-home"></i></router-link> -->
                </ul>
            </div>
        </div>
    <!-- </div> -->
</template>

<script>
import navigation from 'components/navigation/navigation'
import {mapMutations} from 'vuex'
export default {
    name: 'header',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            entName:''
        };
    },
    methods:{
         ...mapMutations({
            setTrade: 'SET_TRADE',
            setTradeFlag: 'SET_TRADE_FLAG'
        }),
        searchEntList(){
            // if (!this.entName) {
            //     return
            // }
            this.$router.push({
                name: `MerchantsList`,
                params: {
                    direction: 'search'
                },
                query: {
                    q: `${this.entName}`,
                }
            })
            this.setTradeFlag(false)
        }
    },
    components: {
        navigation
    }
};
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

// 招商通logo的小角大小
$angle-width: 8px;

// .bg-header {
    // position: fixed;
    // @include flex();

    // height: 64px;
    // box-sizing: border-box;
    // .header {
        // @include flex(space-between);
        // margin: 0 auto;
        // width: $width-page;
        // font-size: $fz-lg;
    // }
// }

.header {
    @include flex(space-between);
    margin: 20px auto 0;
    padding: 0 40px 0 20px;
    width: 70%;
    min-width: 1200px;
    height: 64px;
    box-sizing: border-box;
    border-radius: 10px;
    background: $cl-bg-ct;
    border-bottom: 1px solid #2FBBD4;
    padding-left: calc(100vw - 100%);
    .header-left {
        @include flex();
        padding-left: 10px;
        .logo {
            position: relative;
            z-index: 10;
            align-self: flex-end;
            width: 230px;
            height: 74px;
            line-height: 74px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            background: transparent;
            .content {
                position: relative;
                z-index: 1;
            }
            &:before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 81px;
                background-image: linear-gradient(180deg, #FF6739, #E7542A 70px, rgba(192, 51, 18, 1) 81px);
            }
            &:after {
                content: '';
                position: absolute;
                display: block;
                bottom: -$angle-width;
                right: -$angle-width;
                width: $angle-width;
                height: $angle-width;
                background-image: linear-gradient(135deg, #7F1900 50%, transparent 0);
                // background: #000;
            }
        }
    }
    .header-right {
        @include flex(flex-end, center);
        .setting {
            @include flex(space-between);
        }
    }
}

// 搜索框
.search {
    position: relative;
    .content {
        padding-left: 15px;
        width: 245px;
        height: 32px;
        border: 1px solid;
        border-color: #0099ff #0066cc #0066ff;
        border-radius: 15px;
        box-sizing: border-box;
        color: #fff;
        background: transparent;
        outline: none;
        @include animation(width);
        &:focus {
            width: 300px;
        }
    }
    .icon-search {
        position: absolute;
        right: 12px;
        top: 50%;
        cursor: pointer;
        transform: translateY(-50%);
        color: #0099cc;
        @include animation(color);
        &:hover {
            color: #047195;
        }
    }
}

.setting {
    // width: 105px;
    margin-left: 15px;
    .item {
        cursor: pointer;
    }
    // .iconfont {
    //     font-size: 40px;
    //     color: #0099ff;
    //     @include animation;
        // &:hover {
        //     color: $cl-text-blue;
        // }
    // }
    .user {
        display: inline-block;
        margin-top: 4px;
        width: 45px;
        height: 45px;
        background: url('./user.png');
        background-size: 100% 100%;
        @include animation(background);
        &:hover {
            background: url('./user-hover.png') no-repeat;
            background-size: 100% 100%;
            // &:before {
            //     content: "\e608";
            // }
        }
    }
    .icon-home {
        font-weight: bold;
    }
}

</style>
