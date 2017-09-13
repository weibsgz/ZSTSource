<template>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: () => {
                return [{
                      value: '选项1',
                      label: '黄金糕'
                    }, {
                      value: '选项2',
                      label: '双皮奶'
                    }, {
                      value: '选项3',
                      label: '蚵仔煎'
                    }]
            }
        }
    },
    data() {
        return {
            value: {
                type: String,
                default: ''
            }
        }
    },
    watch: {
        value: function (val, oldVal) {
            this.$emit("selectVal", val)
        }
    }
}
</script>
