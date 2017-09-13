<template>
    <div :id="pieChartsData.id" :style="{height:+pieChartsData.height+'px'}">
        
    </div>
</template>

<script>
export default {
    name: 'pieChart',
    props: {
        pieChartsData: {
            type: Object,
            default: null
        }
       
    },
    
    mounted() {
       // console.log(this.pieChartsData)
         this.initPieChart()
    },
    watch:{
        pieChartsData: {
          handler: function (val, oldVal) { 
            console.log("watch")
            this.initPieChart()
          },
          deep: true  //增加deep 观察对象的子对象变化
        }
    },
    computed: {
       
    },
    methods: {
        initPieChart(){
            let id = this.pieChartsData.id
            let myChart = this.$echarts.init(document.getElementById(id))
           
            let option = {
                     series: [{
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['50%', '50%'],
                        color:['#09c063','#00ffcc','#1693ed','#38a8f8','#d15d39','#0075c9',
                        '#f79e83','#fcc5b5','#e6e6e6','#d7d5d5','#bebebe','#a6a6a6','#808080',"#595959",'#0075c9'],
                        label: {
                            normal: {
                                textStyle: {
                                    color: "#fff",
                                    fontSize:15
                                },
                                formatter: function(params) {
                                    return  params.name +'(' +(params.percent + '%')+')';
                                }
                            }
                        },
                        data: this.pieChartsData.data.data
                    }]
                };

            var me = this;
            myChart.setOption(option);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";


</style>
