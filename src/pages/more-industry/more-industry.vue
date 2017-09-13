<template>
    <div data-comp="more-industry-component" class="wrapper">
        <filter-condition @selectValues="selectValues">
            <div class="top">
                <div class="section">
                    <div class="industry-analysis">
                        <span class="desc">所属地区：</span>
                        <div class="btn-pop" @click="subdivideTrade('area')">
                            <span type="text" class="input-text" v-html="areaName" :class="areaNameCls"></span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <!-- 细分行业 -->
                    <div class="industry-analysis" v-if="pageName==='trade'">
                        <span class="desc">行业细分：</span>
                        <div class="btn-pop" @click="subdivideTrade('industry')">
                            <span type="text" class="input-text" v-html="tradeName" :class="tradeNameCls"></span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                    </div>
                    <!-- 服务的 -->
                    <div class="industry-analysis" v-if="pageName==='chain'">
                        <span class="desc">产品/服务： </span>
                        <div class="btn-pop" @click="subdivideTrade('industry')">
                            <span type="text" class="input-text" v-html="finanServeName" :class="finanServeNameCls"></span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        </filter-condition>
        <div class="rank">
            <span class="desc">排序：</span>
            <el-select v-model="rank.value" placeholder="请选择">
              <el-option
                v-for="item in rank.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <ul class="industries">
            <li class="list-item" v-for="item in industriesList">
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
                </div>
                <div class="result">
                    <span :class="[item.intentionInvestment == 1 || item.yxChecked == true ||
                    item.yjChecked == true ? 'default' : 'text']" @click="showTips(1, item)">意向招商</span>
                    <span :class="[item.alreadyInvestment == 1 || item.yjChecked == true ? 'default' : 'res']" @click="showTips(2, item)">已招商</span>
                </div>
            </li>
        </ul>
        <loading v-show="!industriesList.length"></loading>
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


        <!-- 意向招商 已招商提示 -->
        <tips :text="text" v-if="tipsShow"></tips>

        <!-- 细分行业弹窗 -->
        <dialog-elem class="subdivided-industry"
                    :dialogVisible="subdividedDialogVisible"
                    title = "细分行业"
                    :hasBtn="true"
                    @sureDialog="subdividedSureDialog"
                    @closeDialog="subdividedDialogVisible = false">
                    <subdivided class="subdivided" v-if="pageName==='trade'" @selectCurrentTrade="currentTradeFn" areaOrTrade="industry"></subdivided>
                    <product-services v-if="pageName==='chain'" @changeIndustry="changeServe"></product-services>
        </dialog-elem>

        <!-- 所属地区 -->
        <dialog-elem class="subdivided-industry"
                    :dialogVisible="areaDialogVisible"
                    title = "所属地区"
                    :hasBtn="true"
                    @sureDialog="areaSureDialog"
                    @closeDialog="areaDialogVisible = false">
                    <subdivided class="subdivided" @selectCurrentTrade="currentAreaFn" areaOrTrade="area"></subdivided>
        </dialog-elem>

        <bg-body></bg-body>
    </div>
</template>

<script>
import {ERR_OK, STATUS} from 'api/config'
import {cloudEntUrl} from 'assets/js/utility'
import {post, get} from 'assets/js/api'
import Loading from 'components/loading/loading'
import bgBody from 'components/bg-body/bg-body'
import dialogElem from 'components/dialog/dialog'
import pagination from 'components/pagination/pagination'
import Subdivided from 'components/subdivided/subdivided'
import {mapGetters, mapMutations} from 'vuex'

import VTitle from 'components/title/title.vue'
import Tips from 'components/tips/tips'
import FilterCondition from 'components/filter-condition/filter-condition'
import productServices from 'pages/product-services/product-services'


export default {
    name: 'more-industry',
    data() {
        return {
            // 行业 与 地区的上面导航的
            navDataOth: [],
            areaDataOth: [],
            // tips 弹窗
            text: '',
            tipsShow: false,
            // 细分行业
            currentTrade: '',
            // 细分行业确定之后的
            sureCurrentTrade: '',
            // 所属地区
            currentArea: '',
            sureCurrentArea: '',
            // 当前 服务
            serveName: '',
            // 确定按钮后 输出的 当前 服务
            sureServeName: '',
            // 分页
            // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            currentPage: 1,
            pageSize: 10,
            total: 50,
            layout : "prev, pager, next,total,jumper",

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
            // 排序
            rank: {
                options: [{
                        value: '0',
                        label: '营业收入'
                    }, {
                        value: '1',
                        label: '资产规模'
                    }, {
                        value: '2',
                        label: '注册资本'
                }],
                value: ''
            },
            // 弹窗
            subdividedDialogVisible: false,
            areaDialogVisible: false,
            // 数据列表
            industriesList: []
        }
    },
    mounted() {
        setTimeout(() => {
            this.getIndustriesListData()
        })
    },
    components: {
        VTitle,
        bgBody,
        Loading,
        dialogElem,
        Tips,
        FilterCondition,
        pagination,
        Subdivided,
        productServices
    },
    computed: {
        pageName() {
            return this.$route.query.from
        },
        filters() {
            return {
                currentTrade: this.sureCurrentTrade,
                currentArea: this.sureCurrentArea,
                ...this.selectValue,
                rank: this.rank.value
            }
        },
        areaName() {
            if (this.area.name && this.areaFlag) {
                return this.area.name
            } else if (this.sureCurrentArea.name) {
                return this.sureCurrentArea.name
            } else {
                return '全国'
            }
        },
        areaNameCls() {
            if (this.sureCurrentArea.name || (this.areaFlag && Object.keys(this.area).length)) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        tradeName() {
            if (this.tradeTwo.name && this.tradeFlagTwo) {
                return this.tradeTwo.name
            } else if(this.sureCurrentTrade.name) {
                return this.sureCurrentTrade.name
            } else {
                return '全部'
            }
        },
        tradeNameCls() {
            if (this.sureCurrentTrade.name || (this.tradeFlagTwo && Object.keys(this.tradeTwo).length)) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        // 服务 最终的选取的 服务
        finanServeName() {
            if (this.serveFlagTwo && this.serveTwo) {
                return this.serveTwo
            } else if (this.sureServeName) {
                return this.sureServeName
            } else {
                return '全部'
            }
        },
        finanServeNameCls() {
            if (this.sureServeName.name || (this.serveFlagTwo && Object.keys(this.serveTwo).length)) {
                return ''
            } else {
                return 'cl-placeholder'
            }
        },
        ...mapGetters([
            'area',
            'areaFlag',
            'tradeTwo',
            'tradeFlagTwo',

            'serveTwo',
            'serveFlagTwo'
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
        selectValues(val) {
            this.selectValue = val
        },
        // 细分行业 选取的职业
        currentTradeFn(newVal) {
            this.currentTrade = newVal
        },
        //点击弹窗确认后执行的方法
        subdividedSureDialog() {
            this.subdividedDialogVisible = false
            this.sureCurrentTrade = this.currentTrade

            this.setTradeFlagTwo(false)

            // 服务部分
            this.sureServeName = this.serveName
            this.setServeFlagTwo(false)
        },
        // 所属地区最终选取的职业
        currentAreaFn(newVal) {
            this.currentArea = newVal
        },
        areaSureDialog() {
            this.areaDialogVisible = false
            this.sureCurrentArea = this.currentArea

            this.setAreaFlag(false)
        },
        changeServe(val) {
            this.serveName = val
        },
        pageChange(val){
            this.currentPage = val
            this.getIndustriesListData()
        },
        getIndustriesListData() {
            let filters = this.filters
            get('/investment/moreInustry/list', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    ...filters
                }
            })
            .then((response) => {
                let res = response.data
                if (res[STATUS] === ERR_OK) {
                    this.total = res.totalRecord
                    this.industriesList = res.data
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
        areaTrade() {
            this.areaDialogVisible = true
        },
        getTrade(trade, flag) {
            get('/investment/subdividedinfo', {
                params: {
                    include: flag,
                    pcode: trade.pcode
                }
            })
            .then((response) => {
                let res = response.data
                if (flag === 'industry') {
                    this.navDataOth = res.data
                } else {
                    this.areaDataOth = res.data
                    console.log(this.areaDataOth)
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },
        subdivideTrade(flag) {
            // 弹窗弹出哪个
            if (flag === 'industry') {
                this.subdividedDialogVisible = true
            } else {
                this.areaDialogVisible = true
            }

            // 行业数据
            // if (this.tradeFlag && Object.keys(this.trade).length) {
            //     if (flag === 'industry') {
            //         this.getTrade(this.trade, flag)
            //     }

                // 将行业选择置为 false
                // 即点击行业细分弹窗后，主动选择行业，而不是从上个组件传递过来
                // setTimeout(() => {
                //     if (flag === 'industry' && this.sureCurrentTrade) {
                //         this.setTradeFlag(false)
                //     }
                // }, 2000)
            // }

            // 地区数据
            // if (this.areaFlag && Object.keys(this.area).length) {
            //     if (flag === 'area') {
            //         this.getTrade(this.area, flag)
            //     }

                // 将行业选择置为 false
                // 即点击行业细分弹窗后，主动选择行业，而不是从上个组件传递过来
                // setTimeout(() => {
                //     if (flag === 'area' && this.sureCurrentArea) {
                //         this.setAreaFlag(false)
                //     }
                // }, 2000)
            // }
        },
        ...mapMutations({
            setTradeFlagTwo: 'SET_TRADE_FLAG_TWO',
            setAreaFlag: 'SET_AREA_FLAG',

            setServeFlagTwo: 'SET_SERVE_FLAG_TWO'
        })
    },
    watch: {
        filters(newVal) {
            this.currentPage = 1,
            this.handlePageChage = false
            this.getIndustriesListData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.top {
    .section {
        &:first-child {
            margin-bottom: 15px;
        }
    }
}

.rank {
    padding: 10px 24px;
    @extend %bg-four;
}

// 企业推荐 企业规避
.industries {
    overflow: hidden;
    margin-top: 24px;
    border-radius: 10px;
    .list-item {
        padding: $box-padding;
        @include flex(flex-start, stretch);
        background: rgba(102, 175, 255, 0.4);
        margin-bottom: 1px;
        @include animation;
        &:hover {
            background: rgba(102, 175, 255, 0.8);
        }
        .avatar {
            flex: 0 0 112px;
            // width: 112px;
            box-sizing: border-box;
            img {
                width: 112px;
                height: 126px;
                border: 1px solid #fff;
                border-radius: 10px;
                box-sizing: border-box;
            }
        },
        .result {
            flex: 0 0 60px;
            // width: 60px;
            box-sizing: border-box
        }
        .detail {
            flex: 1;
            box-sizing: border-box;
            margin-left: 24px;
        }
    }
}

.detail {
    @include flex(space-between, flex-start, column);
    .name {
        width: 100%;
        font-size: $fz-md;
        font-weight: bold;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
    .desc {
        @include flex(flex-start, flex-start, row, wrap);
        width: 100%;
        line-height: 1.8;
        .item {
            min-width: 35%;
        }
    }
}

.result {
    @include flex(space-between, flex-end, column);
    .text {
        padding-bottom: 15px;
        cursor: pointer;
        color: #6ddeff;
        @include animation;
        &:hover {
            color: #16C3F6;
        }
    }
    .res {
        padding-top: 15px;
        cursor: pointer;
        color: $cl-text-red;
        @include animation;
        &:hover {
            color: #d33b12;
        }
    }
    .default{
      color:#95a9c1;
    }
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
    .btn-pop {
        // flex: 0 0 200px;
        min-width: 200px;
    }
}

</style>
