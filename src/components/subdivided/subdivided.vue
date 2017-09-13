<template>
    <div data-comp="subdivided-component" class="subdivide">
        <ul class="nav">
            <li class="nav-item" :class="{active: navCurrentIndex === index}" v-for="(item, index) in navData" @click="deleteItem(item, index)">
                <span :data-id="item.pcode">{{formatName(item.name)}}</span>
                <i class="iconfont icon-xiala"></i>
            </li>
        </ul>
        <ul class="content" ref="content">
            <!-- <li class="item" v-for="(item, index) in data" @click="getData(item, true)">123</li> -->
            <li class="item" v-for="(item, index) in data">
                <label>
                    <input type="radio" name="radiobox" @click="getData(item, true, index)">
                    <!-- <i class="radio iconfont"></i> -->
                    <span class="name" :class="{active: activeIndex === index}" :data-id="item.pcode">{{item.name}}</span>
                </label>
            </li>
        </ul>
    </div>
</template>

<script>
import {ERR_OK} from 'api/config'
import {post, get} from 'assets/js/api'
import Loading from 'components/loading/loading'
import {mapGetters} from 'vuex'

import {subdividedIndustryData} from 'api/fake-data'
import {getLevel, getDiyData} from 'assets/js/utility'
import {removeClass, addClass} from 'assets/js/dom'

export default {
    name: 'subdivided',
    props: {
        areaOrTrade: {
            type: String,
            default: 'industry'
        },
        navDataOth: {
            type: Array,
            default: () => []
        },
        areaDataOth: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            radio: '1',
            navData: [{
                name: '全部',
                pcode: '0',
                level: '-1'
            }],
            data: [],
            currentIndustry: '',
            activeIndex: -1
        }
    },
    components: {
        Loading
    },
    mounted() {
        // setTimeout(() => {
        // if (this.areaOrTrade === 'industry') {
            let trade = this.navData[this.navData.length - 1]
            this.getData(trade, false);
        // }
        // }, 2000)
    },
    methods: {
        getData(item, flag, index) {
            //通过给定的ID来发送请求
            // let level =
            // console.log(level)
            // if (this.areaOrTrade === 'area') {

            // }
            get('/investment/subdivided', {
                params: {
                    include: this.areaOrTrade,
                    pcode: item.pcode,
                    level: parseInt(item.level) + 1
                }
            })
            .then((response) => {
                let res = response.data.data
                if (res.length) {
                    this.data = res
                    if (flag) {
                        this.navData.push(item)
                    }

                    // // 设置 当前选中的职业
                    // let radios = document.getElementsByName('radiobox')
                    // for (var i = 0; i < radios.length; i++) {
                    //     radios[i].checked = false
                    // }

                    let content = this.$refs.content
                    setTimeout(() => {
                        let activeStyleDom = content.getElementsByClassName("name")
                        for (var i = 0; i < activeStyleDom.length; i++) {
                            // activeStyleDom
                            removeClass(activeStyleDom[i], 'active')
                        }
                    }, 20)

                } else {
                    this.activeIndex = index

                    let content = this.$refs.content
                    setTimeout(() => {
                        let activeStyleDom = content.getElementsByClassName("name")
                        addClass(activeStyleDom[index], 'active')
                    }, 20)
                }
                this.currentIndustry = item

                // 通过 deleteItem 进来之后
                // 设置 当前选中的职业 如果 vue 没起作用的话
                if (!flag) {
                    let content = this.$refs.content
                    setTimeout(() => {
                        let activeStyleDom = content.getElementsByClassName("name")
                        for (var i = 0; i < activeStyleDom.length; i++) {
                            // activeStyleDom
                            removeClass(activeStyleDom[i], 'active')
                        }
                    }, 20)
                }
          })
          .catch((err) => {
            console.log('bbb')
          })
        },
        deleteItem(item, index) {
            this.navData.splice(index + 1)
            this.getData(item, false)
            this.currentIndustry = item
        },
        formatName(name) {
            if (this.areaOrTrade === 'area' && name === '全部') {
                return '全国'
            } else {
                return name
            }
        }
    },
    computed: {
        navCurrentIndex() {
            return this.navData.length - 1
        },
        ...mapGetters([
            'tradeFlag',
            'areaFlag'
        ])
    },
    watch: {
        currentIndustry: function (newVal) {
            this.$emit("selectCurrentTrade", newVal)
        }
        // navDataOth: function (newVal) {
        //     if (this.tradeFlag && this.areaOrTrade === 'industry') {
        //         this.navData = this.navDataOth

        //         let trade = this.navData[this.navData.length - 1]
        //         this.getData(trade, false);

        //     }
        // },
        // areaDataOth: function (newVal) {
        //     if (this.areaFlag && this.areaOrTrade === 'area') {
        //         this.navData = this.areaDataOth
        //         let trade = this.navData[this.navData.length - 1]
        //         this.getData(trade, false);
        //     }
        // }
        // '$route': 'fetchData'
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.subdivide {
    min-width: 950px;
    @include animation;
}

.nav {
    @include flex();
    font-size: $fz-md;
    .nav-item {
        margin-right: 1px;
        padding: 10px 24px;
        background: #1c518a;
        border-radius: 10px 10px 0 0 / 10px 10px;
        cursor: pointer;
        @include animation;
        .iconfont {
            color: #1071b0;
            @include animation;
        }
        &.active {
            background: #245b97;
            .iconfont {
                color: #00a0e9;
            }
        }
    }
}

.content {
    overflow: auto;
    padding: 24px;
    height: 233px;
    box-sizing: border-box;
    border-radius: 0 0 10px 10px / 0 0 10px 10px;
    background: #245b97;
    @include flex(flex-start, flex-start, row, wrap, flex-start);
    .item {
        flex: 0 1 auto;
        min-width: 33.33%;
        margin-bottom: 15px;
        font-size: $fz-sm;
        color: #fff;
    }
}

// 新增需求
.content {
    // i.radio {
    //     display: none
    // }
    input[type=radio]:checked + .name {
        // background: #ee8e04;
        // color: #fff;
    }
    .name {
        padding: 5px 15px;
        cursor: pointer;
        border-radius: 3px;
        color: #b8d7ff;
        &.active {
            background: #ee8e04;
            color: #fff;
        }
        &:hover{
            background: #ee8e04;
            color: #fff;
        }
    }
}


</style>



<!-- <template>
    <div data-comp="subdivided-component" class="subdivide">
        <ul class="nav">
            <li class="nav-item" :class="{active: navCurrentIndex === index}" v-for="(item, index) in navData" @click="deleteItem(item, index)">
                <span>{{item}}</span>
                <i class="iconfont icon-xiala"></i>
            </li>
        </ul>
        <ul class="content">
                <li class="item" v-for="(item, index) in data" @click="getData(item, true)">123</li>
                <li class="item" v-for="(item, index) in cellData" >
                    <label>
                        <input type="radio" name="radiobox" @click="getCellData(item, true, index)">
                        <i class="radio iconfont"></i>
                        <span class="name active">{{item}}</span>
                    </label>
                </li>
        </ul>
    </div>
</template>

<script>
import {post, get} from 'assets/js/api'
import {ERR_OK, STATUS} from 'api/config'
import Loading from 'components/loading/loading'

import {subdividedIndustryData} from 'api/fake-data'
import {getLevel} from 'assets/js/utility'

export default {
    name: 'subdivided',
    data() {
        return {
            radio: '1',
            navData: ['00行业'],
            data: [],
            cellData: [],
            currentIndex: 0,
            currentIndustry: ''
        }
    },
    components: {
        Loading
    },
    mounted() {
        // 一次性将所有行业数据 以 一级状态请求过来
        this.getData();
    },
    methods: {
        getData() {
            get('/investment/subdivided', {
                params: {
                    industry: 'true'
                }
            })
            .then((response) => {
                let res = response.data
                if (res[STATUS] === ERR_OK) {
                    this.data = res.data
                    // 根据 导航标签上的 最后一个行业 来 获取 其 所包含的子行业
                    let lastIndustry = this.navData[this.navData.length - 1]
                    this.getCellData(lastIndustry, false);
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        getCellData(item, flag, index) {
            let res = this.data
            if (res[item]) {
                this.cellData = res[item]
                if (flag) {
                    this.navData.push(item)
                }

                // 设置 当前选中的职业
                let radios = document.getElementsByName('radiobox')
                for (var i = 0; i < radios.length; i++) {
                    radios[i].checked = false
                }
            }
            this.currentIndustry = item
        },
        deleteItem(item, index) {
            this.navData.splice(index + 1)
            this.getCellData(item, false)
            this.currentIndustry = item
        }
    },
    computed: {
        navCurrentIndex() {
            return this.navData.length - 1
        }
    },
    watch: {
        currentIndustry: function (newVal) {
            this.$emit("selectCurrentTrade", newVal)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.subdivide {
    width: 800px;
}

.nav {
    @include flex();
    font-size: $fz-md;
    .nav-item {
        margin-right: 1px;
        padding: 10px 24px;
        background: #1c518a;
        border-radius: 10px 10px 0 0 / 10px 10px;
        cursor: pointer;
        @include animation;
        .iconfont {
            color: #1071b0;
            @include animation;
        }
        &.active {
            background: #245b97;
            .iconfont {
                color: #00a0e9;
            }
        }
    }
}

.content {
    padding: 24px;
    height: 233px;
    box-sizing: border-box;
    border-radius: 0 0 10px 10px / 0 0 10px 10px;
    background: #245b97;
    @include flex(flex-start, flex-start, row, wrap, flex-start);
    .item {
        flex: 0 1 33.33%;
        margin-bottom: 20px;
        font-size: $fz-sm;
        color: #fff;
    }
}

// 新增需求
.content {
    // i.radio {
    //     display: none
    // }
    input[type=radio]:checked + .name {
        background: #ee8e04;
        color: #fff;
    }
    .name {
        padding: 5px 15px;
        cursor: pointer;
        border-radius: 3px;
        color: #b8d7ff;
    }
}

</style> -->
