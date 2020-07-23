<template>
    <div>
        <div ref="power" id="powerAbnormal" style="height: 250px;">
        </div>
    </div>
</template>

<script>
    import echarts from "echarts"
    import config from "../lib/config";
    import utils from "../lib/utils"

    export default {
        props:{
            propAbnormalKey:{
                type: Number
            }
        },
        data(){
            return{
                histogram: null,
            }
        },
        methods:{
            refresh(){
                this.$nextTick(function () {
                    this.setDefaultOption()
                    this.histogram.showLoading()
                    this.$ajax.get("/api/v1/cedar/power_abnormity_chart?abnormity="+ this.propAbnormalKey)
                        .then(response=>{
                            let series = [
                                {
                                    type:'line',
                                    markArea: {
                                        silent: true,
                                        data: [[{
                                            xAxis: response.data.abnormity[0]
                                        }, {
                                            xAxis: response.data.abnormity[1]
                                        }]],
                                        itemStyle:{
                                            color:"#FD7173"
                                        }
                                    },
                                    lineStyle: {
                                        width: 5
                                    },
                                    data:response.data.data
                                }
                            ]

                            let powerList = []
                            response.data.data.forEach(item=>{
                                powerList.push(item[1])
                            })

                            let maxPower = Math.ceil(Math.max.apply(null,powerList)+3)>100 ? 100 : Math.ceil(Math.max.apply(null,powerList)+3);
                            let minPower = Math.floor(Math.min.apply(null,powerList)-3<0) ? 0 : Math.floor(Math.min.apply(null,powerList)-3);

                            let powerRange = {
                                max:maxPower,
                                min:minPower,
                            }

                            this.histogram.setOption({
                                series: series,
                                yAxis: powerRange,
                            })

                            this.histogram.hideLoading()
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("异常图表加载失败")
                    })

                })
            },
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    tooltip:{
                        trigger: "axis",
                    },
                    grid:{
                        left:"40px",
                        right:"20px",
                        top: "10px",
                        bottom: "45px"
                    },
                    xAxis: {
                        type: "time",
                        name:"测试时间",
                        nameLocation:"center",
                        nameGap:35,
                    },
                    yAxis: {
                        type: "value",
                        name:"电池电量（%）",
                        nameLocation:"middle",
                        nameGap:23,
                        splitNumber: 1,
                        show: true,
                    },
                    color:["#259D27"],
                    barMaxWidth: 40,
                    dataZoom:[
                        {
                            height: 8,
                            bottom: 35,
                            type:'slider',
                        },
                        {
                            type:'inside'
                        }
                    ],
                };
                // 使用刚指定的配置项和数据显示图表。
                this.histogram.setOption(option)
            },
            onResize(){
                this.histogram.resize()
            },
        },
        watch:{
            propAbnormalKey:{
                handler: function(val){
                    this.refresh()
                },
                immediate: true
            }
        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("powerAbnormal"))
            this.setDefaultOption()
            window.addEventListener('resize', this.onResize);
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style scoped>

</style>
