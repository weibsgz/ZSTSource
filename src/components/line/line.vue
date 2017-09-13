<template>
    <div :id="lineChartsData.id" ref="aa" :style="{height:+lineChartsData.height+'px'}">
        
    </div>
</template>

<script>
export default {
    name: 'lineChart',
    props: {
        lineChartsData: {
            type: Object,
            default: null
        }
       
    },
    watch:{
        lineChartsData: {
          handler: function (val, oldVal) { 
            console.log("watch")
            this.initLineChart()
          },
          deep: true  //增加deep 观察对象的子对象变化
        }
    },
    mounted() {
        this.$nextTick(()=>{     
            this.initLineChart()
        })
       
    },
    computed: {
       
    },
    methods: {
        initLineChart(){
            console.log('123123')
            let id = this.lineChartsData.id
            let myChart = this.$echarts.init(document.getElementById(id))
           // this.myChart = this.$echarts.init(this.$refs.aa)
           
            let option = {
                title: '',

                tooltip: {
                     trigger: 'axis',
                     axisPointer : {
                        type : 'shadow',
                        shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    } 
                    },
                },
                xAxis:{
                    type : 'category',  
                    name: this.lineChartsData.option.xAxis.name,   
                    nameTextStyle:{
                        fontSize: 14
                    },            
                    splitLine: {
                       show:true,
                       lineStyle: {
                            color: ['#2f46a1']
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{
                            fontSize:16
                        }
                    },
                    axisLine:{
                        lineStyle: {
                            color:'#fff',
                            fontSize:28
                        }
                    },
                     data : this.lineChartsData.option.xAxis.data,
                },
                yAxis: {
                        type : 'value',
                        name:'数量',
                        nameTextStyle:{
                            fontSize: 14
                        },  
                        axisLabel:{

                            textStyle:{
                                color:"#fff",
                                fontSize:15
                            }
                        },
                         axisLine: {
                            lineStyle: {
                                color:'#fff'
                            }
                        },
                        splitLine: {
                               show:true,
                               lineStyle: {
                                    color: ['#2f46a1']
                                }
                            },
                        axisTick:{
                            show:false
                        },
                },
                series: [{
                    name: this.lineChartsData.option.series.name,
                    type: 'bar',
                    barWidth : 20,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 10, 10],
                            color: new this.$echarts.graphic.LinearGradient(0,0, 0, 1, [{
                                    offset: 0,
                                    color: '#00d8ff'
                                }, {
                                    offset: 1,
                                    color: '#0079ff'
                                }])
                         }
              
                        },
                    data: this.lineChartsData.option.series.data,
                }]
            }
            var me = this;
            
            myChart.on('click', function (params) {
                console.log('点击柱图')
                //有个两次触发的BUG
                let flag = false 
                if(!flag){
                   me.$emit('clickYear',params.name) 
                   flag = true;
                }
             

            });
            myChart.setOption(option);
        },
        // chufa() {
        //     var me = this;
        //     console.log("something")
        //     this.myChart.on('click', function (params) {
        //         console.log('click')
        //         me.$emit('clickYear',params.name)
        //     });
        // }
    }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/css/variable.sass";
@import "./../../assets/css/mixin.sass";


</style>
