<template>
    <div class="title" :class="[fillet === '4' ? 'fillet-fourth' : 'fillet-two']" ref="title">
        <div class="title-left">
            <i class="line" v-if="iconType === 0 && icon"></i>
            <i class="iconfont" :class="icon" v-if="iconType === 1  && icon" ref="icon"></i>
            <!-- <i :class="[ICONTYPE === 0 ? 'line' : icon + 'iconfont']">zidingyi</i> -->
            <span @click="jump" class="text" v-html="title" ref="text"></span>
        </div>
        <div class="title-right" v-if="right">
            <i class="iconfont" :class="right" @click="jump"></i>
        </div>
        <div class="title-right" v-if="diy === '1'">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'title',
    props: {
        title: {
            type: String,
            default: 'title标题'
        },
        titleHeight: {
            type: String,
            default: ''             // 标题高度
        },
        titleSize: {
            type: String,
            default: ''              // 标题字体大小
        },
        icon: {
            type: String,
            default: ''             // 传入字体名称 或者 line
        },
        iconSize: {
            type: String,
            default: ''              // 传入 字体 图标的 大小
        },
        right: {
            type: String,
            default: ''         // 传入字体名称 icon-more, icon-close
        },
        fillet: {
            type: String,
            default: '4'
        },
        diy: {
            type: String,       // 其它自定义的 无法达到，只需一个背景的时候
            default: '0'
        }
    },
    mounted() {
        if (this.titleHeight) {
            this.$refs.title.style.height = this.titleHeight + 'px'
        }
        if (this.iconSize && this.$refs.icon) {
            this.$refs.icon.style.fontSize = this.iconSize + 'px'
        }
        if (this.titleSize) {
            this.$refs.text.style.fontSize = this.titleSize + 'px'
        }
    },
    computed: {
        iconType() {
            return (this.icon).indexOf('line') >= 0 ? 0 : 1
        },
        left() {

        }
    },
    methods: {
        jump() {
            this.$emit("jump")
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";

.title {
    @include flex(space-between);
    width: 100%;
    height: 40px;
    padding-left: $box-padding;
    background: rgba(102, 175, 255, 0.6);
    box-sizing: border-box;
    .title-left {
        @include flex();
        box-sizing: border-box;
        .line {
            display: inline-block;
            width: 2px;
            height: 20px;
            margin-right: 10px;
            color: $cl-text-red;
            background: #fd6541;
        }
        .iconfont {
            margin-right: 14px;
            color: $cl-text-red;
        }
        .text {
            font-size: 14px;
            cursor: pointer;
        }
    }
    .title-right {
        margin-right: 10px;
        box-sizing: border-box;
        .iconfont {
            cursor: pointer;
            &:hover {
                color: #333;
                @include animation;
            }
        }
    }
}

// 圆角
.fillet-fourth {
    border-radius: 10px;
}
.fillet-two {
    border-radius: 10px 10px  0 0 / 10px 10px 0 0;
}

</style>
