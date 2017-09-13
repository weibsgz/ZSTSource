<template>
    <ul data-comp="navigation" class="navigation">
        <li class="item">我的园区</li>
        <router-link tag="li" class="item" :to="{name:'ParkInfo'}">
            <i class="iconfont icon-xinxi"></i>
            <span class="name">园区信息</span>
        </router-link>
        <router-link tag="li" class="item" :to="{name:'ParkPolicy'}">
            <i class="iconfont icon-park-level"></i>
            <span class="name">园区政策</span>
            <span class="oth">(21)</span>
        </router-link>
        <router-link tag="li" class="item" :to="{name:'EnlistIndustry'}">
            <i class="iconfont icon-jianzhu"></i>
            <span class="name">已招企业</span>
            <span class="oth">(21)</span>
        </router-link>
        <router-link tag="li" class="item" :to="{name:'IntentMerchants'}">
            <i class="iconfont icon-shuxie"></i>
            <span class="name">意向招商</span>
            <span class="oth">(21)</span>
        </router-link>
    </ul>
</template>

<script>
export default {
    name: 'nav-park',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.navigation {
    @include flex(flex-start, flex-start, column);
    overflow: hidden;
    border-radius: 10px;
    .item {
        @include flex();
        margin-bottom: 1px;
        padding-left: 24px;
        width: 100%;
        height: 56px;
        line-height: 56px;
        box-sizing: border-box;
        font-size: $fz-md;
        cursor: pointer;
        @include cl-bg(0.3);
        @include animation;
        &:first-child, &:hover, &.active {
            @include cl-bg(0.5);
            .iconfont {
                color: $cl-text-red;
            }
        }
        &:first-child {
            font-size: $fz-lg;
        }
        .iconfont {
            flex: 0 0 15px;
            margin-right: 24px;
            font-size: 20px;
            @include animation;
        }
        .oth {
            flex: 0 0 30px;
            margin-right: 15px;
        }
        .name {
            flex: 1;
        }
    }
}
</style>
