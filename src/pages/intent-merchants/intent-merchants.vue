<template>
    <div data-comp="ienlist-industry-component" class="wrapper park">
        <nav-park class="nav"></nav-park>
        <div class="park-content">
            <div class="enlist">
                <v-title title="已招企业" icon="icon-shuxie" titleHeight="56" titleSize="18" fillet="2" iconSize="24"></v-title>
                <div class="content">
                    <div class="industry-analysis">
                        <span class="desc">选择行业：</span>
                        <div class="btn-pop" @click="subdividedDialogVisible = true">
                            <span type="text" class="input-text">{{tradeName}}</span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                    </div>
                    <div class="download">
                        <i class="iconfont icon-xiazai"></i>
                        <span class="desc">下载名单</span>
                    </div>
                </div>
            </div>

            <ul class="industries">
                <li class="list-item" v-for="(item, index) in result">
                    <div class="avatar">
                        <img :src="item.avatar" height="58" width="65">
                    </div>
                    <div class="detail">
                        <h3 class="name">{{item.name}}</h3>
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
                                <span>企业地址：</span>
                                <span>{{item.detail.address}}</span>
                            </div>
                            <div class="item">
                                <span>企业网址：</span>
                                <span>{{item.detail.url}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="handle">
                        <div class="is-enlist">
                            <span class="success" @click="successEnlist(index, item, 2)">招商成功</span>
                            <span class="no-attention" @click="deleteItem(index, item, 0)">不在关注</span>
                        </div>
                        <button class="record btn">
                            <span class="desc" @click="record(item)">跟进记录</span><span class="number">({{item.followNumber}})</span>
                        </button>
                    </div>
                </li>
            </ul>
            <loading v-show="!result.length"></loading>
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

        <!-- 意向招商 已招商提示 -->
        <tips :text="text" v-if="tipsShow"></tips>

        <!-- 不再关注弹窗 -->
        <dialog-elem
                    :dialogVisible="investDialogVisible"
                    title = "不再关注"
                    :hasBtn="true"
                    @sureDialog="investSureDialog"
                    @closeDialog="investDialogVisible = false">
                    <div class="pop-nointention">确认不再关注该企业？</div>
        </dialog-elem>

        <!-- 细分行业弹窗 -->
        <dialog-elem class="subdivided-industry"
                    :dialogVisible="subdividedDialogVisible"
                    title = "细分行业"
                    :hasBtn="true"
                    @sureDialog="subdividedSureDialog"
                    @closeDialog="subdividedDialogVisible = false">
                    <subdivided class="subdivided" @selectCurrentTrade="currentTradeFn"></subdivided>
        </dialog-elem>

        <!-- 跟进记录弹窗 -->
        <dialog-elem
                    :dialogVisible="recordDialogVisible"
                    title = "跟进记录"
                    :hasBtn="true"
                    @sureDialog="recordSureDialog"
                    @closeDialog="recordDialogVisible = false">
                    <record :data="recordData"></record>
        </dialog-elem>

        <bg-body></bg-body>
    </div>
</template>

<script>
import {ERR_OK, STATUS} from 'api/config'
import {post,get} from 'assets/js/api'
import pagination from 'components/pagination/pagination'
import Loading from 'components/loading/loading'
import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
import Tips from 'components/tips/tips'
import dialogElem from 'components/dialog/dialog'
import Subdivided from 'components/subdivided/subdivided'
// 我的园区 左侧导航
import NavPark from 'components/nav-park/nav-park'
// 跟进记录
import Record from 'components/record/record'

// 假数据 后台届时根据这个来写
import * as fakeData from 'api/fake-data'

export default {
    name: 'enlist-industry',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // tips 弹窗
            text: '',
            tipsShow: false,
            // 不在关注需要参数
            investDialogVisible: false,
            investTarget: {},
            investindex: 0,
            investflag: 0,
            // 细分行业
            currentTrade: {},
            // 细分行业确定之后的
            sureCurrentTrade: {},
            // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            // 分页
            currentPage: 1,
            pageSize:10,
            total:50,
            layout : "prev, pager, next,total,jumper",
            // 弹窗
            subdividedDialogVisible: false,
            recordDialogVisible: false,
            recordData: {},
            // 假数据，后台获取
            "result": []
        }
    },
    components: {
        bgBody,
        VTitle,
        Tips,
        Loading,
        pagination,
        dialogElem,
        NavPark,
        Subdivided,
        Record
    },
    mounted() {
        setTimeout(() => {
            this.getData()
        }, 20)
    },
    methods: {
        pageChange(val){
            this.currentPage = val
            this.getData()
        },
        sureDialog(){
          //点击弹窗确认后执行的方法
          console.log(111)
              this.dialogVisible = false
        },
        record(value) {
            this.recordDialogVisible = true
            this.recordData = value.follow
        },
        // 不在关注
        deleteItem(index, item, flag) {
            this.investindex = index
            this.investflag = flag
            this.investTarget = item
            this.investDialogVisible = true
        },
        // 招商成功
        successEnlist(index, item, flag) {
            flag === 1 ? this.text = '已收藏至 我的园区>>意向招商' : this.text = '已收藏至 我的园区>>已招商'
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
                    this.result.splice(index, 1)
                    setTimeout(()=>{
                      this.tipsShow = false;
                    }, 1000);
                })
                .catch(function (error) {
                  console.log(error);
            });
        },
        //点击 不在关注 弹窗确认后执行的方法
        investSureDialog() {
            post('/investment/addToFav', {
                    type: this.investflag,
                    entName: this.investTarget.name
                })
                .then((response)=> {
                    this.result.splice(this.investindex, 1)
                    this.investDialogVisible = false
                })
                .catch(function (error) {
                  console.log(error);
            });
        },
        //点击弹窗确认后执行的方法
        subdividedSureDialog() {
            this.subdividedDialogVisible = false
            this.sureCurrentTrade = this.currentTrade
        },
        // 所属地区最终选取的职业
        currentTradeFn(newVal) {
            this.currentTrade = newVal
        },
        recordSureDialog() {
            this.recordDialogVisible = false
        },
        getData() {
            get('/investment/park/intentmerchants', {
                params: {
                    currentTrade: this.sureCurrentTrade,
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            })
            .then((response) => {
                let res = response.data
                this.result = res.data

                // 激活分页点击事件
                this.handlePageChage = true
            })
            .catch((error) => {
                console.log(error);

                // 激活分页点击事件
                this.handlePageChage = true
            });
        }
    },
    computed: {
        tradeName() {
            if (Object.keys(this.sureCurrentTrade).length) {
                return this.sureCurrentTrade.name
            } else {
                return '全部'
            }
        }
    },
    watch: {
        sureCurrentTrade(val) {
            this.currentPage = 1,
            this.handlePageChage = false
            this.getData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

// news 的 小角宽高
// $width-new: 8px;
// news 所在的位置
// $location: -$box-padding + $width-news

.enlist {
    .content {
        @include flex(space-between);
        padding: $box-padding;
        @extend %bg-two;
    }
    .download {
        cursor: pointer;
        color: $cl-text-red;
        @include animation;
        &:hover {
            color: #d33b12;
        }
        .iconfont {
            margin-right: 5px;
        }
    }
}

// 企业推荐 企业规避
.industries {
    // overflow: hidden;
    margin-top: 24px;
    border-radius: 10px;
    .list-item {
        padding: $box-padding;
        @include flex(flex-start, stretch);
        background: rgba(102, 175, 255, 0.4);
        margin-bottom: 1px;
        @include animation;
        &:first-child {
            border-radius: 10px 10px 0 0 / 10px 10px 0 0;
        }
        &:last-child {
            border-radius: 0 0 10px 10px / 0 0 10px 10px;
        }
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
        &:hover {
            .btn {
                background: $cl-text-red;
                border: none;
            }
        }
    }
}

// 中间内容
.detail {
    @include flex(flex-start, flex-start, column);
    .name {
        font-size: $fz-md;
        font-weight: bold;
    }
    .desc {
        margin-top: 25px;
        @include flex(flex-start, flex-start, row, wrap);
        line-height: 2;
        .item {
            min-width: 55%;
            &:nth-child(1) {
                width: 20%;
                min-width: 20%;
            }
        }
    }
}

// 跟踪记录 等 处理 操作
.handle {
    @include flex(space-between, center, column);
    .is-enlist {
        @include flex(space-between, center, column);
        height: 50px;
        .success {
            cursor: pointer;
            color: #6ddeff;
            @include animation;
            &:hover {
                color: #16C3F6;
            }
        }
        .no-attention {
            cursor: pointer;
            color: #fd6541;
            @include animation;
            &:hover {
                color: #d33b12;
            }
        }
    }
    .record {
        background: #013077;
        @include animation;
    }
}

.pagination {
    @include flex(flex-end);
    margin: 20px;
}
.industry-analysis {
    .desc {
        flex: 0 0 85px;
    }
    .btn-pop {
        flex: 0 0 145px;
    }
}

.pop-nointention {
    text-align: center;
    line-height: 50px;
}
</style>
