<template>
    <div data-comp="chain-merchants-list-component" class="wrapper">
        <v-title :title="merchantsTitle" icon="icon-shuxie"></v-title>
        <div class="main">
            <div class="column filter">
                <filter-condition @selectValues="selectValues">
                    <div class="top">
                        <div class="section">
                            <!-- <span class="desc">行业细分：</span> -->
                            <!-- <button @click="subdividedDialogVisible = true"><span>点击打开 Dialog</span></button> -->
                            <!-- 细分行业 -->
                            <div class="industry-analysis" v-if="pageName==='trade' || pageName==='search'">
                                <span class="desc">行业细分： </span>
                                <div class="btn-pop" @click="subdivideTrade">
                                    <span type="text" class="input-text" v-html="tradeName" :class="tradeNameCls"></span>
                                    <!-- <input type="text" class="input-text" :placeholder="tradeName" :value="tradeName"> -->
                                    <i class="iconfont icon-arrow-down"></i>
                                </div>
                            </div>
                            <!-- 服务的 -->
                            <div class="industry-analysis" v-if="pageName==='chain'">
                                <span class="desc">产业链： </span>
                                <div class="btn-pop" @click="subdivideTrade">
                                    <span type="text" class="input-text" v-html="finanServeName" :class="finanServeNameCls"></span>
                                    <i class="iconfont icon-arrow-down"></i>
                                </div>
                            </div>
                        </div>
                        <div class="section">
                            <span class="desc">注册时间：</span>
                            <div class="date-picker">
                                <data-picker @time="startTime"></data-picker>
                                <span class="picker-line"></span>
                                <data-picker @time="endTime"></data-picker>
                            </div>
                        </div>
                    </div>
                </filter-condition>
                <div class="indeustry-tab">
                    <div class="left">
                        <!-- <div class="item">企业地图</div> -->
                        <router-link class="item" tag="div" :to="{name:'DomesticPark'}">企业地图</router-link>
                        <div class="item active">统计分析</div>
                    </div>
                    <div class="right">
                        <span class="desc">排序：</span>
                        <el-select v-model="tradeSubdivided.value" placeholder="营业收入">
                          <el-option
                            v-for="item in tradeSubdivided.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="filter-res">
                    <div class="column recommend">
                        <v-title title="企业推荐" icon="line" titleHeight="56" titleSize="18" fillet="2"></v-title>
                        <ul class="list">
                            <li class="list-item" v-for="(item, index) in recommend">
                                <div class="avatar">
                                    <img :src="item.avatar" height="58" width="65">
                                </div>
                                <div class="detail">
                                    <h3 class="name" @click="goToCloud(item.name)">{{item.name}}</h3>
                                    <div class="desc">
                                        <div class="item">
                                            <span>法人：</span>
                                            <span>{{item.detail.legealPerson}}</span>
                                        </div>
                                        <div class="item">
                                            <span>区域：</span>
                                            <span>{{item.detail.area}}</span>
                                        </div>
                                        <div class="item">
                                            <span>注册资金：</span>
                                            <span>{{item.detail.registeredCapital}}</span>
                                        </div>
                                        <div class="item">
                                            <span>注册时间：</span>
                                            <span>{{item.detail.registrationTime}}</span>
                                        </div>
                                        <div class="item">
                                            <span>营业收入：</span>
                                            <span>{{item.detail.operatingIncome}}</span>
                                        </div>
                                        <div class="item">
                                            <span>资产规模：</span>
                                            <span>{{item.detail.assetSize}}</span>
                                        </div>
                                        <div class="item">
                                            <span>企业电话：</span>
                                            <span>{{item.detail.businessPhone}}</span>
                                        </div>
                                    </div>
                                    <div class="result">
                                        <span :class="[item.intentionInvestment == 1 || item.yxChecked == true ||
                                        item.yjChecked == true ? 'default' : 'text']" @click="showTips(1, item)">意向招商</span>
                                        <span :class="[item.alreadyInvestment == 1 || item.yjChecked == true ? 'default' : 'res']" @click="showTips(2, item)">已招商</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <loading v-show="!recommend.length"></loading>
                    </div>
                    <div class="column avoid">
                        <v-title title="企业规避" icon="line" titleHeight="56" titleSize="18" fillet="2"></v-title>
                        <ul class="list">
                            <li class="list-item" v-for="(item, index) in avoid">
                                <div class="avatar">
                                    <img :src="item.avatar" height="58" width="65">
                                </div>
                                <div class="detail">
                                    <h3 class="name" @click="goToCloud(item.name)">{{item.name}}</h3>
                                    <div class="desc">
                                        <div class="item">
                                            <span>法人：</span>
                                            <span>{{item.detail.legealPerson}}</span>
                                        </div>
                                        <div class="item">
                                            <span>区域：</span>
                                            <span>{{item.detail.area}}</span>
                                        </div>
                                        <div class="item">
                                            <span>注册资金：</span>
                                            <span>{{item.detail.registeredCapital}}</span>
                                        </div>
                                        <div class="item">
                                            <span>注册时间：</span>
                                            <span>{{item.detail.registrationTime}}</span>
                                        </div>
                                        <div class="item">
                                            <span>营业收入：</span>
                                            <span>{{item.detail.operatingIncome}}</span>
                                        </div>
                                        <div class="item">
                                            <span>资产规模：</span>
                                            <span>{{item.detail.assetSize}}</span>
                                        </div>
                                        <div class="item">
                                            <span>企业电话：</span>
                                            <span>{{item.detail.businessPhone}}</span>
                                        </div>
                                    </div>
                                    <div class="result">
                                        <span :class="[item.intentionInvestment == 1 || item.yxChecked == true ||
                                        item.yjChecked == true ? 'default' : 'text']" @click="showTips(1, item)">意向招商</span>
                                        <span :class="[item.alreadyInvestment == 1 || item.yjChecked == true ? 'default' : 'res']" @click="showTips(2, item)">已招商</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <loading v-show="!recommend.length"></loading>
                    </div>
                </div>
                <div class="pagination">
                    <pagination
                            :pageSize = "pageSize"
                            :total="total"
                            :layout = "layout"
                            :page = "currentPage"
                            :isChange="handlePageChage"
                            @pageChange="pageChange">
                    </pagination>
                </div>
            </div>
            <div class="column industry">
                <div class="national-industry">
                    <v-title title="全国企业" icon="line" right="icon-more" titleHeight="56" fillet="2" @jump="moreIndustry('national')"></v-title>
                    <div class="content bg-two">
                        <ul class="list">
                            <li class="list-item" v-for="item in nationalLocalIndustry.national">
                                <div class="left">
                                    <img class="menu-brand" :src="item.avatar" height="55" width="55" alt="">
                                </div>
                                <div class="right">
                                    <h3 class="link" :title="item.name" @click="goToCloud(item.name)">{{item.name}}</h3>
                                    <span class="desc">{{item.desc}}</span>
                                </div>
                            </li>
                        </ul>
                        <loading v-show="!Object.keys(nationalLocalIndustry).length"></loading>
                    </div>
                </div>
                <div class="local-industry">
                    <v-title title="本地企业" icon="line" right="icon-more" titleHeight="56" fillet="2" @jump="moreIndustry('local')"></v-title>
                    <div class="content bg-two">
                        <ul class="list">
                            <li class="list-item" v-for="item in nationalLocalIndustry.local">
                                <img class="menu-brand" :src="item.avatar" height="55" width="55">
                                <h3 class="name" @click="goToCloud(item.name)">{{item.name}}</h3>
                            </li>
                        </ul>
                        <loading v-show="!Object.keys(nationalLocalIndustry).length"></loading>
                    </div>
                </div>
            </div>
        </div>

        <!-- 意向招商 已招商提示 -->
        <tips :text="text" v-if="tipsShow"></tips>

        <!-- 细分行业弹窗 -->
        <dialog-elem class="subdivided-industry"
                    :dialogVisible="subdividedDialogVisible"
                    :title = "severTitle"
                    :hasBtn="true"
                    @sureDialog="subdividedSureDialog"
                    @closeDialog="subdividedDialogVisible = false">
                    <subdivided class="subdivided" v-if="pageName=='trade'" @selectCurrentTrade="currentTradeFn" areaOrTrade="industry" :navDataOth="navDataOth"></subdivided>
                    <product-services v-if="pageName=='chain'" @changeIndustry="changeServe"></product-services>
        </dialog-elem>

        <bg-body></bg-body>
    </div>
</template>

<script>
import bgBody from 'components/bg-body/bg-body'
import {cloudEntUrl} from 'assets/js/utility'
import {post, get} from 'assets/js/api'
import Loading from 'components/loading/loading'
import pagination from 'components/pagination/pagination'
import productServices from 'pages/product-services/product-services'
import {ERR_OK, STATUS} from 'api/config'
import {formatTime} from 'assets/js/utility'
import {mapGetters, mapMutations} from 'vuex'
// 行业招商列表 各个 select 的数据 静态 或者动态
import * as options from 'api/selectoptions'

import VTitle from 'components/title/title.vue'
import DataPicker from 'components/date-picker/date-picker'
import dialogElem from 'components/dialog/dialog'
import Tips from 'components/tips/tips'

import FilterCondition from 'components/filter-condition/filter-condition'

import Subdivided from 'components/subdivided/subdivided'

export default {
    name: 'merchants-list',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 行业 请求后台数据获得
            navDataOth: [],
            // tips 弹窗
            text: '',
            tipsShow: false,
            // 当前行业
            currentTrade: '',
            // 确定按钮后 输出的 当前行业
            sureCurrentTrade: '',
            // 当前 服务
            serveName: '',
            // 确定按钮后 输出的 当前 服务
            sureServeName: '',
            // 假数据，后台获取
            recommend: [],
            avoid: [],
            nationalLocalIndustry: {},

            // 下拉框中 的 value 值
            selectValue: {
                legealLitigation: '',       // 法律诉讼
                administrationPunish: '',   // 行政处罚
                listedStatus: '',           // 上市情况
                financingstatus: '',        // 融资情况
                branchOffice: '',           // 分公司
                negativeInfo: '',           // 负面舆情
                supportIndustry: ''         // 国家扶持企业
            },
            // 营业收入
            tradeSubdivided: {
                options: options.tradeSubdivided,
                value: '0'
            },
            // 注册时间
            time: {
                startTime: 0,
                endTime: 1
            },
            // 弹窗
            subdividedDialogVisible: false,
            dialogVisible: false,
            // 分页
            // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            currentPage: 1,
            pageSize:10,
            total:50,
            layout : "prev, pager, next,total,jumper"
        }
    },
    components: {
        bgBody,
        VTitle,
        DataPicker,
        Loading,
        Tips,
        dialogElem,
        pagination,
        Subdivided,
        productServices,
        FilterCondition
    },
    created() {
        this.getMerchantsListData()
        this.getIndustryData()
    },
    computed: {
        merchantsTitle() {
            let direction = this.$route.params.direction
            return direction === 'trade' ? '行业细分' : direction === 'chain' ? '产业链招商' : '企业查询'
        },
        filters() {
            let time = this.time.startTime + '-' + this.time.endTime
            let fil = {
                currentTrade: this.sureCurrentTrade,
                time: time,
                ...this.selectValue,
                rank: this.tradeSubdivided.value
            }
            return fil
        },
        chainOrInvest() {
            let direction = this.$route.params.direction
            return direction === 'trade' ? '行业细分： ' : '产品/服务： '
        },
        // 行业 最终选取的行业
        tradeName() {
            if (this.tradeFlagOne && this.tradeOne.name) {
                return this.tradeOne.name
            } else if (this.sureCurrentTrade.name) {
                return this.sureCurrentTrade.name
            } else {
                return '全部'
            }
        },
        tradeNameCls() {
            if (this.sureCurrentTrade.name || (this.tradeFlagOne && Object.keys(this.tradeOne).length)) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        // 服务 最终的选取的 服务
        finanServeName() {
            if (this.serveFlagOne && this.serveOne) {
                return this.serveOne
            } else if (this.sureServeName) {
                return this.sureServeName
            } else {
                return '全部'
            }
        },
        finanServeNameCls() {
            if (this.sureServeName.name || (this.serveFlagOne && Object.keys(this.serveOne).length)) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        pageName() {
            return this.$route.params.direction
        },
        severTitle() {
            let flag = this.$route.params.direction
            return flag === 'trade' ? '细分行业' : '产品/服务'
        },
        ...mapGetters([
            'tradeOne',
            'tradeFlagOne',
            'serveOne',
            'serveFlagOne'
        ])
    },
    methods: {
        goToCloud(entName){
           let idNum =Math.floor((Math.random()*10))*10;
           top.window.addTab(cloudEntUrl+entName,entName,idNum+'zst')
        },
        showTips(flag, item) {
            flag === 1 ? this.text = '已收藏至 我的园区>>意向招商' : this.text = '已收藏至 我的园区>>已招商'

            if (flag === 1) { // 意向招商
                if (item.intentionInvestment == 1 || item.yxChecked === true) {
                    return
                }
            } else { // 已招商
                if(item.alreadyInvestment == 1 || item.yjChecked == true){
                    return
                 }
            }

            post('/investment/addToFav', {
                    type: flag,
                    entName: item.name
                })
                .then( (response)=> {
                    this.tipsShow = true;
                    if(flag == 1){
                        if(typeof item.yxChecked === 'undefined') {
                              this.$set(item,"yxChecked",true)
                        }
                    } else if(flag == 2){
                        if(typeof item.yjChecked === 'undefined') {
                              this.$set(item,"yjChecked",true)
                              this.$set(item,"yxChecked",true)
                        }
                    }

                    setTimeout(()=>{
                      this.tipsShow = false;
                    },2000);
                })
                .catch(function (error) {
                  console.log(error);
            });
        },
        pageChange(val){
            this.currentPage = val
            console.log(`你给后台发送的数据是 当前是第${val}页 每页${this.pageSize}条`)
        },
        // 时间选择，日历组件传递过来的日期
        startTime(val) {
            var date = new Date(val)
            this.time.startTime = formatTime(date.getTime())
        },
        endTime(val) {
            var date = new Date(val)
            this.time.endTime = formatTime(date.getTime())
        },
        // select 中的value 值接受
        selectValues(val) {
            this.selectValue = val
        },
        //点击弹窗确认后执行的方法
        subdividedSureDialog() {
            this.subdividedDialogVisible = false

            // 行业部分
            this.sureCurrentTrade = this.currentTrade

            // 为下一个页面接受 trade 做准备
            this.setTradeTwo(this.currentTrade)
            // 将首页的行业 flag 置为 false 以使组件 可以自行展示行业
            this.setTradeFlagOne(false)

            // 服务部分
            this.sureServeName = this.serveName
            this.setServeTwo(this.serveName)
            this.setServeFlagOne(false)
        },
        currentTradeFn(newVal) {
            this.currentTrade = newVal
        },
        changeServe(val) {
            this.serveName = val
        },
        pageChange(val){
            // 更改页数，掉数据
            this.currentPage = val
            this.getMerchantsListData()
        },
        getMerchantsListData() {
            get('/investment/merchantsList/listcopy', {
                params: {
                    from: 'trade/chain',
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    ...this.filters
                }
            })
            .then((response) => {
                let res = response.data
                if (res[STATUS] === ERR_OK) {
                    this.total = res.totalRecord
                    this.recommend = res.data.recommend
                    this.avoid = res.data.avoid
                }

                // 激活分页点击事件
                this.handlePageChage = true
            })
            .catch((error) => {
                console.log(error);

                // 激活分页点击事件
                this.handlePageChage = true
            });
        },
        getIndustryData(newVal) {
            get('/investment/merchantsList/industry', {
                params: {
                    trade: this.sureCurrentTrade
                }
            })
            .then((response) => {
                let res = response.data
                if (res[STATUS] === ERR_OK) {
                    this.nationalLocalIndustry = res.data
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },
        moreIndustry(val) {
            let from = this.$route.query.from
            this.$router.push({
                name: 'MoreIndustry',
                params: {
                    direction: `${val}`
                },
                query: {
                    from: from
                }
            })
            // 为下一个页面接受 trade 做准备
            this.setTradeFlagTwo(true)
            if (val === 'local') {
                this.setAreaFlag(true)
                this.setArea({
                    level: 0,
                    name: "河北",
                    pcode: "13"
                })
            } else {
                this.setAreaFlag(false)
                this.setArea({
                    level: 0,
                    name: "全国",
                    pcode: "0"
                })
            }

            this.setServeFlagTwo(true)

            // 如果 用户 直接 在首页中 进行过行业选择 后
            // 直接进入 更多企业页，未选择过 列表页的职业，那么 就 设置一下 two
            if (!this.sureCurrentTrade) {
                this.setTradeTwo(this.tradeOne)
            }
            if (!this.sureServeName) {
                this.setServeTwo(this.serveOne)
            }
        },
        subdivideTrade() {
            this.subdividedDialogVisible = true
            if (this.tradeFlag && Object.keys(this.trade).length) {
                // this.getTrade(this.trade)

                // 将行业选择置为 false
                // 即点击行业细分弹窗后，主动选择行业，而不是从上个组件传递过来
                // setTimeout(() => {
                //     this.setTradeFlag(false)
                // }, 2000)
            }
        },
        ...mapMutations({
            setTradeFlagOne: 'SET_TRADE_FLAG_ONE',
            setTradeTwo: 'SET_TRADE_TWO',
            setTradeFlagTwo: 'SET_TRADE_FLAG_TWO',
            setAreaFlag: 'SET_AREA_FLAG',
            setArea: 'SET_AREA',

            setServeFlagOne: 'SET_SERVE_FLAG_ONE',
            setServeTwo: 'SET_SERVE_TWO',
            setServeFlagTwo: 'SET_SERVE_FLAG_TWO'
        })
    },
    watch: {
        filters: function (newVal) {
            this.currentPage = 1,
            this.handlePageChage = false
            this.getMerchantsListData()
        },
        sureCurrentTrade: function (newVal) {
            this.getIndustryData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

// 法律诉讼处 多个 select list-item 的宽度
$width-list-item: 169px;

// 每个单元的 下边距
$module-mb: 24px;

.main {
    @include flex(space-between, flex-start);
    .column {
        margin-top: 24px;
    }
}

// 右侧内容
.industry {
    width: 230px;
}

.national-industry {
    width: 100%;
    margin-bottom: $module-mb;
    .content {
        padding: 16px 13px 22px;
        box-sizing: border-box;
        @extend %bg-two;
        .list {
            @include flex(space-between, center, column);
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .list-item {
                @include flex(flex-start, flex-start);
                width: 100%;
                height: 55px;
                margin-bottom: 18px;
                .left {
                    margin-right: 13px;
                    .menu-brand {
                        box-sizing: border-box;
                        border: 1px solid  #fff;
                        border-radius: 5px;
                    }
                }
                .right {
                    // flex: 1 0 10%;
                    width: 140px;
                    font-size: $fz-xs;
                    .link {
                        display: block;
                        margin-bottom: 10px;
                        // color: $cl-bg-title;
                        cursor: pointer;
                        font-size: 14px;
                        color: #75a4e0;
                        @include no-wrap();
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                    .desc {
                        color: #eceff4;
                    }
                }
                &:nth-last-child(1) {
                    margin-bottom: 0;
                }
            }
        }
    }
}

.local-industry {
    width: 100%;
    .list {
        @include flex(space-between, center, row, wrap);
        width: 158px;
    }
    .content {
        padding: 31px 36px 10px;
        @extend %bg-two;
        .list-item {
            @include flex(space-between, center, column)
            margin-bottom: 17px;
            .menu-brand {
                box-sizing: border-box;
                border: 1px solid  #fff;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .name {
                max-width: 56px;
                // color: $cl-bg-title;
                color: #75a4e0;
                cursor: pointer;
                text-align: center;
                &:hover {
                    text-decoration: underline;
                }
                // text-decoration: underline;
                // @include no-wrap();
            }
            // &:nth-last-child(1):nth-child(2n+1), &:nth-last-child(2):nth-child(2n+2) {
                // margin-bottom: 0;
            // }
        }
    }
}

// 左侧内容
.filter {
    // @include flex(flex-start, flex-start, column);
    // flex: 1 1 auto;
    width: calc(100% - 256px);
}

// 筛选条件
.filter-condition {
    @extend %bg-four;
    padding: $box-padding;
    font-size: $fz-sm;
    margin-bottom: $module-mb;
    .line {
        width: 100%;
        height: 1px;
        background: rgba(255, 254, 212, .1);
        margin: 13px 0;
    }
    // line-height: 1.2;
    .top {
        @include flex(space-between, flex-start, column);
        .section {
            @include flex();
            height: 40px;
        }
    }
}

// 企业地图 统计分析
.indeustry-tab {
    @include flex(space-between);
    @extend %bg-four;
    padding: 0 $box-padding;
    height: 40px;
    .left {
        @include flex();
        height: 40px;
        line-height: 40px;
        .item {
            position: relative;
            margin-right: 30px;
            height: 100%;
            box-sizing: border-box;
            cursor: pointer;
            @include animation;
            // border: 1px red solid;
            &:hover:before, &.active:before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate3d(-50%, 0, 0);
                width: calc(100% + 8px);
                height: 1px;
                background: #fff;
            }
            &:hover:after, &.active:after {
                content: '';
                position: absolute;
                bottom: 1px;
                left: 50%;
                transform: translate3d(-50%, 0, 0);
                width: 0;
                height: 0;
                border: 5px solid;
                border-color: transparent transparent #fff transparent;
            }
        }
    }
}


// 企业推荐 企业规避
.filter-res {
    @include flex(space-between, flex-start);
    .column {
        @include flex(flex-start, center, column);
        width: 48%;
        .list {
            width: 100%;
        }
    }
    .list-item {
        @include flex(space-between, flex-start);
        padding: 24px;
        // height: 186px;
        box-sizing: border-box;
        margin: 1px 0;
        // border: 1px solid;
        // border-color: transparent rgba(102, 175, 255, .4) rgba(102, 175, 255, .4);
        background: rgba(102, 175, 255, .4);
        background-clip: padding-box;
        @include animation;
        &:hover {
            background: rgba(102, 175, 255, 0.8);
        }
        .avatar {
            width: 112px;
            height: 126px;
            border: 1px solid #fff;
            box-sizing: border-box;
            border-radius: 6px;
            overflow: hidden;
            > img {
                width: 100%;
                height: 100%;
            }
        }
        .detail {
            width: calc(100% - 132px);
            .name {
                font-size: $fz-md;
                font-weight: bold;
                margin-bottom: 10px;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
            .desc {
                @include flex(flex-start, flex-start, row, wrap);
                line-height: 1.8;
                color: #eceff4;
                .item {
                    min-width: 45%;
                    &:nth-child(2n+1) {
                        margin-right: 2px;
                    }
                }
            }
            .result {
                margin-top: 10px;
            }
            .text {
                margin-right: 30px;
                padding: 15px 0;
                color: #6ddeff;
                cursor: pointer;
                @include animation;
                &:hover {
                    color: #16C3F6;
                }
            }
            .res {
                padding: 15px 0;
                color: $cl-text-red;
                cursor: pointer;
                @include animation;
                &:hover {
                    color: #d33b12;
                }
            }
            .default{
              margin-right: 30px;
              color:#95a9c1;
            }
        }
    }
}


// 细分行业弹窗
.subdivided {
    width: 810px;
    // height: 500px;
}

.pagination {
    @include flex(flex-end);
    margin: 20px;
}

.industry-analysis {
    .desc {
        // width: 70px;
        flex: 0 0 auto;
        min-width: 70px;
    }
    .input-text {
        padding-left: 10px;
    }
    .btn-pop {
        // flex: 0 0 142px;
        min-width: 142px;
    }
}

</style>
