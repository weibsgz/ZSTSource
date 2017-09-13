<template>
  <div class="add-my-park">
  <div class="add-upload" :class="{uploadShow:uploadShow}" >
  <div class="add-warp">
    <div class="input-warp">
        <div class="input-cell">
          <span class="cell-name">园区名称</span>
          <input class="input-text" v-model="parkData.parkName" @input="testInput">
        </div>
        <div class="input-cell">
          <span class="cell-name">所在地区</span>
          <el-select v-model="regionCode.province" placeholder="请选择" @change="getCitys">
            <el-option
              v-for="item in provinceOptions"
              :key="item.pcode"
              :label="item.name"
              :value="item.pcode">
            </el-option>
          </el-select>
          <el-select v-model="regionCode.city" placeholder="请选择" @change="testInput">
          <el-option
            v-for="item in cityOptions"
            :key="item.pcode"
            :label="item.name"
            :value="item.pcode">
          </el-option>
        </el-select>
        </div>
        <div class="input-cell">
          <span class="cell-name">园区级别</span>
          <div class="btnBox">
              <el-radio-group v-model="parkData.parkLevel" @change="testInput">
                  <el-radio-button v-for="level in levelArr" :label="level.name" :key="level.name"></el-radio-button>
              </el-radio-group>
          </div>
        </div>
        <div class="input-cell special-cell">
          <span class="cell-name">园区类别</span>
          <div class="btnBox">
              <el-radio-group v-model="parkData.parkType" @change="testInput">
                  <el-radio-button v-for="type in typeArr" :label="type.name" :key="type.name"></el-radio-button>
              </el-radio-group>
          </div>
        </div>
    </div>
    <div class="footer">
      <div class="btn disable" v-if="disableNext">下一步</div>
      <div class="btn next" v-if="!disableNext" @click="next">下一步</div>
    </div>
  </div>
  <div class="upload-wrap">
    <ul class="file-box">
      <el-upload class="upload-demo" :action="action"
                 name="fileData"
                 ref="upload"
                 :headers="tokenid"
                 :data="parkData"
                 :on-success="uploadSuccess"
                 :on-change="handleChange"
                 :on-remove="handleRemove"
                 :before-upload="beforeUpload"
                 :auto-upload="false">
        <el-button size="small" class="upload btn" type="primary">上传政策</el-button>
        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <!--<li class="file-cell">-->
        <!--<i class="iconfont icon-pdf"></i>-->
        <!--<span class="file-name">界定外商投资审批/备案范围.pdf</span>-->
      <!--</li>-->
      <!--<li class="file-cell">-->
        <!--<i class="iconfont icon-doc"></i>-->
        <!--<span class="file-name">界定外商投资审批/备案范围.doc</span>-->
      <!--</li>-->
      <!--<li class="file-cell">-->
        <!--<i class="iconfont icon-pdf"></i>-->
        <!--<span class="file-name">界定外商投资审批/备案范围.pdf</span>-->
      <!--</li>-->
    </ul>

    <div class="footer">
      <a class="skip" @click="jumpUpload">跳过，稍后上传</a>
        <div class="btn confirm" @click="upload">确定</div>
    </div>
    <div class="tips-wrap" :class="{tipsShow:tipsShow}">
      <div class="tips-box">
        <i class="iconfont icon-gantanhao_gray"></i>
        <span class="tips-text">{{tipsText}}</span>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<script>
import {post,get,baseurl} from 'assets/js/api'
import {getUser} from 'assets/js/user'
export default {
    name: 'add-my-park',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tokenid:{tokenid:sessionStorage.getItem('tokenid')},
            action:baseurl+'/investment/domesticPark/addMyPark',
            tipsShow:false,
            tipsText:'请选择上传文件',
            regionCode:{
                province:null,
                city: null
            },
            parkData:{
                parkName:'',
                province: null,
                city: null,
                parkLevel:'',
                parkType:''
            },
            fileList: [],
            disableNext:true,
            provinceOptions: [],
            cityOptions: [],
            levelArr:[],
            typeArr:[],
            uploadShow:false
        }
    },
    created:function () {
        this.getProvinces();
        this.getRadioButton();
    },
    watch: {
        'regionCode.province': 'codeToName',
        'regionCode.city': 'codeToName'
    },
    methods: {
        codeToName:function () {
            //console.log(this.provinceOptions);
            if(this.regionCode.province) {
                let r = this.provinceOptions.find((x)=>{
                    return x.pcode === this.regionCode.province;
                })
                this.parkData.province = r.name;
            }
            if(this.regionCode.city) {
                let c = this.cityOptions.find((x)=>{
                    return x.pcode === this.regionCode.city;
                })
                this.parkData.city = c.name;
            }
        },
        getRadioButton:function () {
            let _this = this;
            get('/investment/select', {
            }).then((response) => {
                let jsonArr = response.data;
                _this.levelArr = jsonArr.data.gardenLevel;
                _this.typeArr = jsonArr.data.gardenType;
                //console.log(jsonArr);
            });
        },
        getProvinces:function () {
            let _this = this;
            get('/investment/subdivided', {
                params:{
                    pcode:0,
                    include : 'area'
                }
            }).then((response) => {
                let jsonArr = response.data;
                _this.provinceOptions = jsonArr.data;
                //_this.typeArr = jsonArr.data.gardenType;
                //console.log(jsonArr);
            });
        },
        getCitys:function () {
            let _this = this;
            _this.regionCode.city = null;
            get('/investment/subdivided', {
                params:{
                    pcode:_this.regionCode.province,
                    include : 'area'
                }
            }).then((response) => {
                let jsonArr = response.data;
                _this.cityOptions = jsonArr.data;
                //_this.typeArr = jsonArr.data.gardenType;
                //console.log(jsonArr);
            });
        },
        testInput:function () { //检测必填项
            let _this = this;
            let n = _this.parkData.parkName,
                p = _this.parkData.province,
                c = _this.parkData.city,
                l = _this.parkData.parkLevel,
                t = _this.parkData.parkType;
            if ( n && p && c && l && t){
             _this.disableNext = false;
             //console.log('禁用');
            }else{
             _this.disableNext = true;
             //console.log('启用');
            }
        },
        next:function () {
            this.uploadShow = true;
            this.$emit("changeTitle","上传我的园区政策");
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
                  _this.$emit("jumpUpload");
                  this.$refs.upload.clearFiles();
              }
            }, 1000);
        },
        jumpUpload:function () {
            let _this = this
            post('/investment/domesticPark/addParkNoFile', this.parkData).then((response) => {
                let jsonArr = response.data;

                if (jsonArr.code=='1'){
                    this.showTips('新建成功',true);

                    getUser()
                        .then((response) => {
                            console.log(response)
                            if (response.getItem('parkId')) {
                                this.dialogVisible = false
                            } else {
                                this.dialogVisible = true
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            // 用户未登录，返回到登录界面
                            // console.log('用户未登录，返回到登录界面')
                            // window.location.href="https://www.baidu.com"
                        })
                }else {
                    this.showTips('新建失败');
                    console.log(jsonArr.msg);
                }
            });
        },
        upload:function () {
            if (this.fileList.length<1){
                this.showTips('请选择上传文件');
                return;
            }
            this.$refs.upload.submit();
        },
        uploadSuccess(response, file, fileList) {
            console.log(response);
            if (response.code == '1'){
                this.showTips('新建成功',true);

                getUser()
                    .then((response) => {
                        console.log(response)
                        if (response.getItem('parkId')) {
                            this.dialogVisible = false
                        } else {
                            this.dialogVisible = true
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        // 用户未登录，返回到登录界面
                        // console.log('用户未登录，返回到登录界面')
                        // window.location.href="https://www.baidu.com"
                    })

            }else{
                this.showTips('新建失败');
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

    },
    components: {
//      FilterCondition
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";
.add-my-park {
  position: relative;
  width: 762px;
  overflow: hidden;
    .el-select {
        width: 150px;
        margin-right: 10px;
        vertical-align: middle;
    }
  .input-warp {
      min-height: 250px;
  }
  .input-cell {
    font-size: 0;
    margin-bottom: 20px;
    .cell-name{
        font-size: 16px !important;
        margin-right: 30px !important;
        display: inline-block;
        vertical-align: middle;
    }
    .input-text {
        width: 310px;
        display: inline-block;
        vertical-align: middle;
    }
    .btnBox {
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
    }
    }
}
    .add-upload {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }
    .add-warp , .upload-wrap{
      -webkit-flex-shrink: 0;
      -ms-flex: 0 0 auto;
      flex-shrink: 0;
      width: 100%;
      position: relative;
    }
    .footer {
        text-align: center;
        border-top: 1px inset #346faf;
        padding-top: 30px;
        box-sizing: border-box;
        .skip {
        color: #fff;
        margin-right: 25px;
        cursor: pointer;
        }
    }
.upload-wrap  {
    .file-box {
        height: calc(100% - 61px);
        .file-cell {
            line-height: 35px;
            margin-bottom: 10px;
            .iconfont {
                font-size: 26px;
                vertical-align: middle;
                margin-right: 5px;
            }

            .icon-pdf {
                color: #e45453;
            }
            .icon-doc {
                color: #54cbed;
            }
            .file-name {
                font-size: 14px;
                vertical-align: middle;
            }
        }
    }
}
.next,.upload {
  background-color: #0096ff;
}

.uploadShow {
  animation: next 0.3s forwards;
}
@keyframes next {
  to {
    transform: translateX(-100%);
  }
}
/*上传控件样式重置*/
.el-upload-list__item-name {
  color: #f5f5f5;
}
.el-upload-list__item {
  line-height: 35px;
  margin-bottom: 10px;
}
.el-icon-document {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e45453 !important;
  font-size: 26px;
  vertical-align: middle;
  margin-right: 5px;
}
.el-upload-list {
  margin: 50px 0;
  min-height: 140px;
}
.el-icon-document:before {
  content: "\E615";
}
.el-upload-list__item .el-icon-close {
  top: 50%;
  margin-top: -5px;
  width: 10px;
  height: 10px;
  right: 10px;
}

.special-cell {
    @include flex();
    .cell-name {
        align-self: flex-start;
        flex: 0 0 64px;
    }
    .btnBox {
        @include flex(flex-start, center, row, wrap);
        flex: 1 0 10px;
    }
    .el-radio-button {
        margin-bottom: 10px;
    }
}
</style>
