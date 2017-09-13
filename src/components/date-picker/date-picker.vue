<template>
    <div class="data-picker-comp">
        <div class="block">
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
            pickerOptions: {
               // disabledDate(time) {
               //      return time.getTime() < Date.now() - 8.64e7;
               // }
            },
            value: '',
        }
    },
    watch: {
        // a: function (val, oldVal) {
        //       console.log('new: %s, old: %s', val, oldVal)
        //     },
        // value(val) {
        //     this.$emit("time", val)
        // }
        value: function (val, oldVal) {
            this.$emit("time", val)
        }
    }
};
</script>
