<template>
    <div data-comp="park-info-component" class="wrapper park">
        <nav-park class="nav"></nav-park>
        <div class="park-content">
            <v-title title="园区信息" icon="icon-xinxi" titleHeight="56" titleSize="18" fillet="2" iconSize="24"></v-title>
            <div class="content" >
                <ul class="detail" v-show="Object.keys(data).length">
                    <li class="item">
                        <span class="desc">园区名称：</span>
                        <span v-if="!modify">{{data.parkName}}</span>
                        <input v-if="modify" type="text" :value="data.parkName" class="input-text" name="" v-model="data.parkName">
                    </li>
                    <li class="item">
                        <span class="desc">所在地区：</span>
                        <span v-if="!modify">{{data.province}} {{data.city}}</span>
                        <el-select v-if="modify" v-model="selectProvinceCode" placeholder="请选择" @change="getCitys">
                            <el-option
                              v-for="item in provinceOptions"
                              :key="item.pcode"
                              :label="item.name"
                              :value="item.pcode">
                            </el-option>
                        </el-select>
                        <el-select style="margin-left:15px;" v-if="modify && cityOptions.length" v-model="selectCityCode" placeholder="请选择" @change="setCityName">
                            <el-option
                              v-for="item in cityOptions"
                              :key="item.pcode"
                              :label="item.name"
                              :value="item.pcode">
                            </el-option>
                        </el-select>
                    </li>
                    <li class="item">
                        <span class="desc">园区级别：</span>
                        <span v-if="!modify">{{data.parkLevel}}</span>
                        <div v-if="modify" class="level">
                            <span class="btn-level" v-for="(item, index) in parkLevel" :class="{'active': levelIndex === index}" @click="handleLevel(item, index)">{{item}}</span>
                        </div>
                    </li>
                    <li class="item">
                        <span class="desc">园区类型：</span>
                        <span v-if="!modify">{{data.parkType}}</span>
                        <div v-if="modify" class="type">
                            <span class="btn-type" v-for="(item, index) in parkType" :class="{'active': typeIndex === index}" @click="handleType(item, index)">{{item}}</span>
                        </div>
                    </li>
                </ul>
                <button v-show="Object.keys(data).length" class="btn" @click="modifyDeatil" v-html="!modify ? '修改' : '提交'" :class="[!modify ? 'modify' : 'submit']"></button>
                <loading v-show="!Object.keys(data).length"></loading>
            </div>
        </div>

        <!-- <test></test> -->

        <bg-body></bg-body>
    </div>
</template>

<script>
import {ERR_OK, STATUS} from 'api/config'
import {post,get} from 'assets/js/api'
import {detectUser} from 'assets/js/user'
import Loading from 'components/loading/loading'

import bgBody from 'components/bg-body/bg-body'
import VTitle from 'components/title/title.vue'
// 我的园区 左侧导航
import NavPark from 'components/nav-park/nav-park'

import Test from 'pages/test/test'


import {addClass} from 'assets/js/dom'

export default {
    name: 'park-info',
    data() {
        return {
            levelIndex: 0,
            typeIndex: 0,
            modify: false,
            data: {
            },
            parkLevel: ['国家级', '省级', '市级', '其它'],
            parkType: ['高新区', '经开区', '保税区', '工业区', '科技园', '孵化器', '商务区', '特色产业园区', '金融区', '特色产业园区'],
            provinceOptions: [],
            cityOptions: [],
            selectProvinceCode:"",
            selectCityCode:""
        }
    },
    components: {
        bgBody,
        VTitle,
        NavPark,
        Loading,
        Test
    },
    mounted() {
        if (sessionStorage.getItem('parkId')) {
            setTimeout(() => {
                this.getData()
                this.getProvinces();
            }, 200)
        } else {
            this.$router.push(`/domestic-park`)
        }
    },
    methods: {
        modifyDeatil() {
            this.modify = !this.modify
            if(this.modify == false){
                 post('/investment/updateMyPark',{
                    id: sessionStorage.getItem('parkId'),
                    ...this.data
                 })
                 .then((response) => {
                   console.log(response)
                })
            }
        },
        handleLevel(item,index) {
            this.data.parkLevel = item
            this.levelIndex = index
        },
        handleType(item,index) {
            this.data.parkType = item
            this.typeIndex = index
        },
        getData() {
            get('/investment/park/parkInfo', {
                params: {
                    parkId: sessionStorage.getItem('parkId')
                }
            })
            .then((response) => {
                let res = response.data
                this.data = res.data
                this.selectProvinceCode = res.data.province;
                this.selectCityCode = res.data.city;
            })
            .catch((error) => {
                console.log(error);
            });
        },
        getProvinces() {
            get('/investment/subdivided', {
                params:{
                    include: 'area',
                    pcode: 0
                }
            }).then((response) => {
                let jsonArr = response.data;
                this.provinceOptions = jsonArr.data;
            })
        },
         getCitys: function (value) {
            this.selectCityCode = null;
            get('/investment/subdivided', {
                params:{
                    include : 'area',
                    // pcode: this.selectProvinceCode
                    pcode: value
                }
            }).then((response) => {
                let jsonArr = response.data
                this.cityOptions = jsonArr.data

                //取得省份的中文  赋值给data
                let obj = {}
                obj = this.provinceOptions.find((v)=>{
                    return v.pcode === value;
                })
                console.log(obj)
                if(obj.name) {
                    this.data.province = obj.name;
                }
            });
        },
        setCityName(value){
             let obj = {};
             //console.log(this.cityOptions)
             obj = this.cityOptions.find((v)=>{
                  return v.pcode === value;
             });
             //console.log(obj.name)
             this.data.city = obj.name;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.content {
    padding: 47px;
    @extend %bg-two;
    .detail {
        margin-bottom: 20px;
    }
    .item {
        @include flex(flex-start, center);
        min-height: 40px;
        .desc {
            flex: 0 0 90px;
            width: 90px;
        }
        &:last-child {
            margin-top: 10px;
            span {
                align-self: flex-start;
            }
            .desc, .desc + span {
                padding-top: 5px;
            }
        }
    }
    .modify {
        // margin-top: 20px;
    }
}

.type {
    @include flex(flex-start, flex-start, row, wrap)
}

.btn-level, .btn-type {
    display: inline-block;
    margin-right: 20px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #6389c2;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    background: #013077;
    cursor: pointer;
    box-sizing: border-box;
    @include animation;
    &:hover, &.active {
        border: 1px solid #038ff3;
        background: #038ff3;
    }
}
.btn-type {
    width: 120px;
    margin-bottom: 15px;
}

.bg-modify {
    background: #0070D9;
}
.bg-submit {
    background: #FD6541;
}

</style>
