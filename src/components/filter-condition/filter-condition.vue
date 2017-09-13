<template>
    <div class="filter-condition">
        <slot></slot>
        <div class="line"></div>
        <div class="filter-detail">
            <ul class="list" ref="list">
                <li class="list-item">
                    <span class="desc">法律诉讼：</span>
                    <el-select v-model="selectValue.legealLitigation" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.legealLitigation"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">行政处罚：</span>
                    <el-select v-model="selectValue.administrationPunish" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.administrationPunish"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">上市情况：</span>
                    <el-select v-model="selectValue.listedStatus" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.listedStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">融资情况：</span>
                    <el-select v-model="selectValue.financingstatus" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.financingstatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">分公司：</span>
                    <el-select v-model="selectValue.branchOffice" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.branchOffice"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">负面舆情：</span>
                    <el-select v-model="selectValue.negativeInfo" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.negativeInfo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li class="list-item">
                    <span class="desc">国家扶持企业：</span>
                    <el-select v-model="selectValue.supportIndustry" placeholder="不限">
                      <el-option
                        v-for="item in selectOptios.supportIndustry"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
// 法律诉讼 等 各个 select 的数据 静态 或者动态
import * as options from 'api/selectoptions'

import DataPicker from 'components/date-picker/date-picker'

export default {
    name: 'filter-condition',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 下拉框的内容
            selectOptios: {
                legealLitigation: options.legealLitigation,
                administrationPunish: options.administrationPunish,
                listedStatus: options.listedStatus,
                financingstatus: options.financingstatus,
                branchOffice: options.branchOffice,
                negativeInfo: options.negativeInfo,
                supportIndustry: options.supportIndustry
            },
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
        }
    },
    components: {
        DataPicker
    },
    mounted() {
        this.calcMr()
        // window.addEventListener('resize', ()=>{
        //     this.calcMr()
        // })
    },
    methods: {
        calcMr() {
            let list = this.$refs.list
            let listWidth = parseInt(list.clientWidth)
            let item = list.children[0]
            let itemWidth = parseInt(item.clientWidth)
            let itemStyle = window.getComputedStyle(item, null)
            let itemMr = parseInt(itemStyle.marginRight.slice(0, -2))
            let num = Math.floor((listWidth + itemMr) / (itemWidth + itemMr))
            list.children[num - 1].style.marginRight = 0;
            if (list.children[2 * num - 1]) {
                list.children[2 * num - 1].style.marginRight = 0;
            }
        }
    },
    watch: {
        selectValue: {
            deep: true,
            handler: function(val, oldVal) {
                this.$emit("selectValues", val)
            }
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

// 筛选条件
.filter-condition {
    @extend %bg-four;
    margin-bottom: $module-mb;
    padding: $box-padding $box-padding 0;
    box-sizing: border-box;
    font-size: $fz-sm;
    .line {
        width: 100%;
        height: 1px;
        background: rgba(255, 254, 212, .1);
        margin: 13px 0;
    }
    // .top {
    //     @include flex(space-between, flex-start, column);
    //     .section {
    //         @include flex();
    //         height: 40px;
    //     }
    // }
    .filter-detail {
        .list {
            width: 100%;
            height: 100%;
            @include flex(flex-start, center, row, wrap);
            .list-item {
                position: relative;
                font-size: 0;
                text-align: right;
                // text-align-last: right;
                .desc, .el-select {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: $fz-sm;
                }
                .desc {
                    position: absolute;
                    right: 0;
                    z-index: 1;
                    right: 99px;
                    top: 50%;
                    width: 100px;
                    transform: translate3d(0, -50%, 0);
                }
                // @include flex(flex-end);
                width: $width-list-item;
                margin-right: 65px;
                margin-bottom: 14px;
                .el-select {
                    width: 99px;
                }
                // &:nth-child(5n+5) {
                //     margin-right: 0;
                // }
                // &:nth-child(5n+1):nth-last-child(1), &:nth-child(5n+1):nth-last-child(1) + .list-item,
                // &:nth-child(5n+1):nth-last-child(2), &:nth-child(5n+1):nth-last-child(2) + .list-item,
                // &:nth-child(5n+1):nth-last-child(3), &:nth-child(5n+1):nth-last-child(3) + .list-item,
                // &:nth-child(5n+1):nth-last-child(4), &:nth-child(5n+1):nth-last-child(4) + .list-item,
                // &:nth-child(5n+1):nth-last-child(5), &:nth-child(5n+1):nth-last-child(5) + .list-item
                //  {
                //     margin-bottom: 0;
                // }
            }
        }
        .desc {
            // @include flex(flex-end);
        }
    }
}

</style>
