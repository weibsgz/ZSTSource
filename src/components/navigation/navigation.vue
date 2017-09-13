<template>
    <ul data-comp="navigation-component" class="navigation">
        <router-link class="item" tag="li" :to="{name:'DomesticPark'}">国内园区</router-link>
        <router-link class="item" tag="li" :to="{name:'TradeInvest', params:{direction:'trade'}}">行业招商</router-link>
        <router-link class="item" tag="li" :to="{name:'ChainInvest', params:{direction:'chain'}}">产业链招商</router-link>
        <!-- <router-link class="item" tag="li" :to="{path:'/invest/chain'}">产业链招商</router-link> -->
        <router-link class="item" tag="li" :to="{name:'GardenPolicy'}">园区政策</router-link>
    </ul>
</template>

<script>
export default {
    name: 'navigation',
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
    @include flex();
    font-size: $fz-md;
    .item {
        position: relative;
        margin: 0 5px;
        width: 125px;
        height: 32px;
        line-height: 29px;
        text-align: center;
        cursor: pointer;
        border-radius: 15px;
        @include animation(color, 0.1s);
        // font-weight: bold;
        &:hover {
            color: #ccc;
        }
        &.active {
            background: -webkit-linear-gradient(top, #00ccff, #0099ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;

        }
        &.active:before {
            // background: #013077;
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: 50%;
            transform: translate3d(-50%, 50%, 0);
            z-index: -1;
            width: 100%;
            height: 200%;

            background: radial-gradient(50px 23px at center center, rgba(153, 204, 255, .2), transparent)
        }
    }
}

.navigation li.router-link-active{
    color: red;
}
</style>
