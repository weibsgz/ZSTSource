<template>
    <div data-comp="park-policy-component" class="wrapper park park-policy">
        <nav-park class="nav"></nav-park>
        <div class="park-content">
            <div class="search">
                <v-title title="园区政策" icon="icon-park-level" titleHeight="56" titleSize="18" fillet="2" iconSize="24"></v-title>
                <div class="content">
                    <div class="search-bar">
                        <input type="text" class="input-text" placeholder="请输入您要查找的政策名称" v-model="searchContent" name="">
                        <button class="search-btn" @click="searchFile">查找</button>
                    </div>
                    <div class="upload-policy" @click="openPolicy">
                        <i class="iconfont icon-shangchuan"></i>
                        <span>上传政策</span>
                    </div>
                </div>
            </div>
            <div class="policy">
                <table class="policy-file">
                    <thead>
                        <tr>
                            <td>政策文件</td>
                            <td>上传时间</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data">
                            <td>{{item.filename}}</td>
                            <td>{{item.time}}</td>
                            <td><i class="iconfont icon-delete" @click="deleteItem(index, item, 0)"></i></td>
                        </tr>
                    </tbody>
                </table>
                <loading v-show="isLoading"></loading>
                <div v-if="noDataFlag" class="no-data">暂无政策</div>
            </div>
            <div class="pagination" v-show="!noDataFlag">
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

        <!-- 上传政策文件 -->
        <dialog-elem
            :dialogVisible="policyFileVisible"
            title = "上传政策"
            :hasBtn="true"
            @sureDialog="policySureDialog"
            @closeDialog="policyFileVisible = false">
            <div class="pop-policy">
                <el-upload
                    class="upload-demo" :action="action"
                    name="fileData"
                    ref="upload"
                    :headers="tokenid"
                    :data="uploadData"
                    :on-success="uploadSuccess"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    <div class="tips-wrap" :class="{tipsShow:tipsShow}">
                        <div class="tips-box">
                        <i class="iconfont icon-gantanhao_gray"></i>
                            <span class="tips-text">{{tipsText}}</span>
                        </div>
                    </div>
                </el-upload>
            </div>
        </dialog-elem>
        
        <!-- 删除政策文件 -->
        <dialog-elem
                    :dialogVisible="investDialogVisible"
                    title = "政策删除"
                    :hasBtn="true"
                    @sureDialog="investSureDialog"
                    @closeDialog="investDialogVisible = false">
                    <div class="pop-delete">是否确认删除？</div>
        </dialog-elem>

        <bg-body></bg-body>
    </div>
</template>

<script>
import {ERR_OK, STATUS} from 'api/config'
import {post,get,baseurl} from 'assets/js/api'
import bgBody from 'components/bg-body/bg-body'
import Loading from 'components/loading/loading'
import VTitle from 'components/title/title.vue'
import dialogElem from 'components/dialog/dialog'
import pagination from 'components/pagination/pagination'
// 我的园区 左侧导航
import NavPark from 'components/nav-park/nav-park'

const userId = sessionStorage.getItem('userId')
const parkId = sessionStorage.getItem('parkId')

export default {
    name: 'park-policy',
    data() {
        return {
            action:baseurl+'/investment/uploadParkpolicy',
            tokenid:{tokenid:sessionStorage.getItem('tokenid')},
            uploadData:{parkId:sessionStorage.getItem('parkId')},
            fileList:[],
            // 不在关注需要参数
            investDialogVisible: false,
            investTarget: {},
            investindex: 0,
            investflag: 0,
            // 搜索内容
            searchContent: '',
            // 数据获取成功状态码,
            loadingData: true,
            // 分页
            // 处理分页改变时 是否 发送请求
            handlePageChage: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            layout : "prev, pager, next,total,jumper",
            addTxt:'',
            data: [],
            noDataFlag: false,
            // 弹窗
            policyFileVisible: false,
            tipsShow:false,
            tipsText:'',
        }
    },
    components: {
        bgBody,
        VTitle,
        NavPark,
        Loading,
        dialogElem,
        pagination
    },
    mounted() {
        setTimeout(() => {
            this.getData()
        }, 20)
    },
    computed: {
        isLoading() {
            // 获取数据状态中
            if (this.loadingData) {
                return true
            } else {
                // 正常返回数据 但数据为空
                if (!Object.keys(this.data).length) {
                    this.noDataFlag = true
                } else {
                    this.noDataFlag = false
                }

                // 数据获取完毕，获取数据状态 置为 false
                this.loadingData= false

                return false
            }
        }
    },
    methods: {
        deleteItem(index, item, flag) {
            this.investindex = index
            this.investflag = flag
            this.investTarget = item
            this.investDialogVisible = true
            // this.data.splice(index, 1);
        },
        //点击 删除 弹窗确认后执行的方法
        investSureDialog() {
            post('/investment/park/deletePolice', {
                    fileId: this.investTarget.id
                })
                .then((response)=> {
                    // 刷新数据, 但不发送请求
                    this.data.splice(this.investindex, 1)
                    // 刷新分页
                    this.total -= 1
                    this.investDialogVisible = false
                })
                .catch(function (error) {
                  console.log(error);
            })
        },
        openPolicy:function () {
            this.policyFileVisible = true;
        },
        showTips:function (text,close) {
            let _this = this;
            if (_this.tipsShow){
                return
            }
            if (text) {
                _this.tipsText = text;
            }
            _this.tipsShow = true;
            setTimeout(()=>{
                _this.tipsShow = false;
                if (close) {
                    this.policyFileVisible = false;
                    this.$refs.upload.clearFiles();
                }
            }, 1000);
        },
        //点击弹窗确认后执行的方法
        policySureDialog() {
            this.upload();
            //this.policyFileVisible = false
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        pageChange(val){
            this.currentPage = val
            this.getData()
        },
        getData() {
            // 数据获取中，获取数据状态 置为 true
            this.loadingData= true

            get('/investment/park/parkPolicy', {
                params: {
                    parkId: sessionStorage.getItem('parkId'),
                    // filename: encodeURI(this.searchContent.replace(/^\s+|\s+$/g,"")),
                    filename: this.searchContent.replace(/^\s+|\s+$/g,""),
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            })
            .then((response) => {
                let res = response.data
                // 数据获取完毕，获取数据状态 置为 false
                this.loadingData= false
                this.data = res.data
                this.total = res.totalRecord
                // 激活分页点击事件
                this.handlePageChage = true
            })
            .catch((error) => {
                console.log(error);

                // 激活分页点击事件
                this.handlePageChage = true
            });
        },
        searchFile() {
            this.currentPage = 1
            this.handlePageChage = false
            this.getData()
        },
        upload:function () {
            this.$refs.upload.submit();
        },
        uploadSuccess(response, file, fileList) {
            //console.log(response);
            if (response.code == '1'){
                this.showTips('上传成功',true);
                this.getData();
                // 上传政策后，有数据了，不显示暂无数据
                this.noDataFlag = false
            }else{
                this.showTips('上传失败');
                console.log(response.msg);
            }
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
            //console.log(this.parkData.fileList);
        },
        handlePreview(file) {
            //console.log(3);
        },
        beforeUpload(file){
            //console.log(file);
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
            //console.log(this.parkData.fileList);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.search {
    .content {
        @include flex(space-between);
        padding: 20px 24px;
        @extend %bg-two;
    }
    .search-bar {
        @include flex();
        .input-text {
            width: 474px;
            border-right: none!important;
        }
        .search-btn {
            width: 95px;
            height: 30px;
            border: none;
            outline: none;
            background: $cl-text-red;
            border-radius: 0 4px 4px 0 / 0 4px 4px 0;
            color: #fff;
            cursor: pointer;
        }
    }
    .upload-policy {
        color: $cl-text-red;
        cursor: pointer;
        .iconfont {
            margin-right: 5px;
        }
    }
}

// 园区政策
.policy {
    margin-top: 20px;
    .policy-file {
        width: 100%;
        height: 100%;
    }
}

.policy-file {
    border-radius: 10px;
    overflow: hidden;
    @include animation;
    td {
        height: 56px;
        background: $cl-bg-title;
        box-sizing: border-box;
        text-align: center;
        &:first-child {
            padding-left: 24px;
            text-align: left;
        }
    }
    thead {
        td {
            height: 56px;
        }
    }
    tbody {
        td {
            height: 90px;
            @include animation;
            .iconfont {
                font-size: 25px;
                cursor: pointer;
                @include animation;
            }
        }
        tr:nth-child(2n+1) {
            td {
                @include cl-bg(0.2);
            }
        }
        tr:nth-child(2n+2) {
            td {
                @include cl-bg(0.1);
            }
        }
        tr:hover {
            td {
                @include cl-bg(0.4)
                .iconfont {
                    color: $cl-text-red;
                }
            }
        }
    }
}

.pop-policy {
    width: 700px;
}

.pagination {
    @include flex(flex-end);
    margin: 20px;
}

.pop-delete {
    text-align: center;
    line-height: 50px;
}

.no-data {
    margin-top: 30px;
    text-align: center;
}
</style>
