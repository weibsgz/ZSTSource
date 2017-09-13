<template>
    <div data-comp="record-component" class="record">
        <div class="target">
            <div class="item">
                <span class="desc">跟进对象：</span>
                <span>{{data.followPeople}}</span>
            </div>
            <div class="item">
                <div class="cell">
                    <span class="desc">跟进时间：</span>
                    <data-picker @time="time"></data-picker>
                </div>
                <div class="cell">
                    <span class="desc">跟进人：</span>
                    <input type="text" :value="data.followPeople" name="" class="input-text">
                </div>
            </div>
            <div class="item">
                <span class="desc res-desc">跟进结果：</span>
                <textarea class="res input-text">{{data.followRes}}</textarea>
            </div>
            <button class="btn submit">提交</button>
        </div>
        <div class="line"></div>
        <div class="history">
            <h3 class="title">历史跟进</h3>
                <div class="result">
            <!-- <v-scrollbar> -->
                    <div class="item" v-for="(item, index) in reverseFollowHistory">
                        <div class="bar"></div>
                        <div class="people">
                            <span class="time">{{item.time}}</span>
                            <span class="name">{{item.name}}</span>
                        </div>
                        <div class="detail">{{item.detail}}</div>
                    </div>
            <!-- </v-scrollbar> -->
                </div>
        </div>
    </div>
</template>

<script>
import DataPicker from 'components/date-picker/date-picker'
// import vScrollbar from 'vue-scrollbar-custom'

export default {
    name: 'record',
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {

        }
    },
    components: {
        DataPicker
        // vScrollbar
    },
    methods: {
        // 时间选择，日历组件传递过来的日期
        time(val) {
            console.log(val)
            this.time.start = val
        },
    },
    computed: {
        reverseFollowHistory() {
            return this.data.followHistory.reverse();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.record {
    position: relative;
    width: 815px;
    box-sizing: border-box;
}

.target {
    @include flex(flex-start, flex-start, column);
    padding: 30px;
    box-sizing: border-box;
    border-radius: 10px;
    @include cl-bg(0.2);
    .item {
        @include flex();
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 20px;
        .desc {
            display: inline-block;
            width: 80px;
        }
        .cell {
            @include flex();
            margin-right: 30px;
        }
        .res-desc {
            align-self: flex-start;
        }
        .res {
            align-self: flex-start;
            padding: 10px;
            flex: 1;
            height: 90px;
        }
    }
    .submit {
        align-self: flex-end;
    }
}

.line {
    width: 855px;
    height: 1px;
    margin: 25px 0;
    background: #0f3865;
    transform: translate3d(-20px, 0, 0);
}

.history {
    .title {
        padding-left: 10px;
        height: 20px;
        line-height: 20px;
        border-left: 2px solid #ff802b;
        margin-bottom: 20px;
    }
    .result {
        height: 220px;
        overflow: auto;
        padding-right: 10px;
        @include flex(flex-start, flex-start, column);
        .item {
            flex: 0 0 95px;
            @include flex(flex-start, flex-start);
            width: 100%;
            height: 95px;
            box-sizing: border-box;
            .bar {
                position: relative;
                flex: 0 0 1px;
                width: 1px;
                margin: 0 32px;
                height: 100%;
                transform: translate3d(0, 10px, 0);
                background-image: linear-gradient(180deg, rgba(256, 128, 43, 1) 3px, transparent 0px, transparent 4px);
                background-repeat: repeat;
                background-size: 1px 4px;
                // border-right: 1px dashed #FF802B;
                box-sizing: border-box;
                &:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate3d(-50%, 0, 0);
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    background: rgba(256, 128, 43, 1);
                }
            }
            .people {
                flex: 0 0 85px;
                @include flex(flex-start, flex-start, column);
                .time {
                    margin: 9px 0 13px;
                }
            }
            .detail {
                position: relative;
                flex: 1;
                padding: 7px 20px;
                height: 75px;
                box-sizing: border-box;
                border-radius: 10px;
                @include cl-bg(0.2);
                &:before {
                    content: '';
                    position: absolute;
                    top: 8px;
                    left: -14px;
                    z-index: 9999;
                    width: 0;
                    height: 0;
                    border: 7px solid;
                    border-color: transparent rgba(102, 175, 255, .2) transparent transparent;
                }
            }
        }
    }
}

.vue-scrollbar-custom {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

</style>
