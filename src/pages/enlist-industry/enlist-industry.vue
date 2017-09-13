<template>
    <div data-comp="enlist-industry-component" class="wrapper park">
        <nav-park class="nav"></nav-park>
        <div class="park-content">
            <div class="enlist">
                <v-title title="已招企业" icon="icon-jianzhu" titleHeight="56" titleSize="18" fillet="2" iconSize="24"></v-title>
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
                <li class="list-item" v-for="(item, index) in data">
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
                    <div class="leave">
                        <button class="btn input-text" @click="deleteItem(index, item, 0)">离开园区</button>
                        <div class="news" v-if="item.news">
                            <span class="desc">尊敬的用户，本公司的专利信息有更新</span>
                            <span class="link" @click="goToCloud(item.name)">点击查看详情</span>
                        </div>
                    </div>
                </li>
            </ul>
            <loading v-show="!data.length"></loading>
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

        <!-- 离开园区弹窗 -->
        <dialog-elem
                    :dialogVisible="investDialogVisible"
                    title = "离开园区"
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

        <bg-body></bg-body>
    </div>
</template>

<script>
import {ERR_OK, STATUS} from 'api/config'
import {cloudEntUrl} from 'assets/js/utility'
import {post,get} from 'assets/js/api'
import bgBody from 'components/bg-body/bg-body'
import Loading from 'components/loading/loading'
import pagination from 'components/pagination/pagination'
import VTitle from 'components/title/title.vue'
import dialogElem from 'components/dialog/dialog'
import Subdivided from 'components/subdivided/subdivided'
// 我的园区 左侧导航
import NavPark from 'components/nav-park/nav-park'

// 假数据 后台届时根据这个来写
import * as fakeData from 'api/fake-data'

const userId = sessionStorage.getItem('userId')
const parkId = sessionStorage.getItem('parkId')

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
            // 不在关注需要参数
            investDialogVisible: false,
            investTarget: {},
            investindex: 0,
            investflag: 0,
            // 细分行业
            currentTrade: '',
            // 细分行业确定之后的
            sureCurrentTrade: '',
            // 分页
            // 处理分页改变时 是否 发送请求
            handlePageChage: '',
            currentPage: 1,
            pageSize:10,
            total:50,
            layout : "prev, pager, next,total,jumper",
            // 假数据，后台获取
            "data": [],
            // 弹窗
            subdividedDialogVisible: false,
        }
    },
    components: {
        bgBody,
        VTitle,
        Loading,
        dialogElem,
        Subdivided,
        NavPark,
        pagination
    },
    mounted() {
        setTimeout(() => {
            this.getData()
        }, 20)
    },
    methods: {
        goToCloud(entName){
           let idNum =Math.floor((Math.random()*10))*10;
           top.window.addTab(cloudEntUrl+entName,entName,idNum+'zst')
        },
        pageChange(val){
            this.currentPage = val
            this.getData()
        },
        // 不在关注
        deleteItem(index, item, flag) {
            this.investindex = index
            this.investflag = flag
            this.investTarget = item
            this.investDialogVisible = true
        },
        //点击 不在关注 弹窗确认后执行的方法
        investSureDialog() {
            post('/investment/addToFav', {
                    type: this.investflag,
                    entName: this.investTarget.name
                })
                .then((response)=> {
                    this.data.splice(this.investindex, 1)
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
        getData() {
            get('/investment/park/enlistIndustry', {
                params: {
                    currentTrade: this.sureCurrentTrade,
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            })
            .then((response) => {
                let res = response.data
                if (res[STATUS] === ERR_OK) {
                    this.data = res.data
                }

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
        sureCurrentTrade() {
            this.currentPage = 1
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

.leave {
    @include flex(flex-start, flex-start);
    position: relative;
    .btn {
        padding-left: 0;
        width: 100px;
        border-radius: 15px;
        box-sizing: border-box;
        @include animation;
    }
    .news {
        position: absolute;
        top: 50%;
        right: -32px;
        transform: translate3d(0, -50%, 0);
    }
}

.news {
    @include flex();
    .desc {
        display: inline-block;
        width: 260px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #06357b;
        border-radius: 4px 0 0 4px / 4px 0 0 4px;
    }
    .link {
        position: relative;
        width: 110px;
        height: 32px;
        line-height: 32px;
        border: none;
        outline: none;
        text-align: center;
        background: $cl-text-red;
        color: #fff;
        cursor: pointer;
        @include animation;
        &:hover {
            background: #d33b12;
        }
        &:after {
            content: '';
            position: absolute;
            right: 0;
            bottom: -8px;
            z-index: 99;
            display: inline-block;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #7f1900 50%, transparent 0);
        }
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
        // flex: 0 0 145px;
        min-width: 145px;
    }
}
.pop-nointention {
    text-align: center;
    line-height: 50px;
}
</style>
