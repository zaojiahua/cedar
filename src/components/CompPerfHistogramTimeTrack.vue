<template>
    <div>
        <div v-if="showChart" :id="'histogram'+propCanvasId+'-'+jobId" style="height: 250px;"></div>
        <div v-else>
            <div style="font-size: 12px;text-align: center">{{$t('perfDataView.noChart')}}</div>
        </div>
    </div>
</template>

<script>
    import echarts from "echarts"
    import utils from "../lib/utils"
    import config from "../lib/config"

    export default {
        props:{
            jobId:{
                type: Number
            },
            deviceId:{
                type: Number
            },
            propPhoneModels:{
                type: Array,
                default: ()=>{return []}
            },
            propCanvasId:{
                type: Number,
                default:1
            },
        },
        data(){
            return{
                histogram: null,
                series: {},
                showChart:true
            }
        },
        methods:{
            refresh(tboardIds){
                this.showChart = true
                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("histogram"+this.propCanvasId+"-"+this.jobId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()
                    this.$ajax.get("api/v1/cedar/get_perf_data_bar_chart_by_time_order/?tboard="+ tboardIds +"&job="+ this.jobId +"&devices=" +this.deviceId
                    ).then(response=>{
                        if(response.data.length===0)
                            this.showChart =  false;
                        let list = []
                        response.data.forEach(item=>{
                            list.push(item[1])
                        })
                        let max = Math.ceil(Math.max.apply(null,list))+0.5;
                        let vRange = {
                            max:max,
                        }
                        this.series = [
                            {
                                name:this.$t('perfDataView.startTime'),
                                type:'bar',
                                label: {
                                    show: true,
                                    position:"top",
                                    color:"#333"
                                },
                                data:response.data
                            }
                        ]
                        this.histogram.setOption({
                            series: this.series,
                            yAxis: vRange
                        })
                        this.histogram.hideLoading()
                        this.$emit("after-load-data",response.data.length>0)
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('perfDataView.error_3'))
                        this.histogram.hideLoading()
                    })
                })
            },
            setDefaultOption(){
                let _this = this
                // 指定图表的配置项和数据
                let option = {
                    tooltip:{
                        trigger: "axis",
                        formatter: function (obj) {
                            return obj[0].value[0]+ '<br>'
                                + _this.$t('perfDataView.startTime') +'：' + obj[0].value[1] + ' s<br>'
                        }
                    },
                    grid:{
                        show:false,
                        left:"40px",
                        right:"20px",
                        top: "10px",
                        bottom: "41px"
                    },
                    xAxis: {
                        type: "time",
                        splitLine:{
                            show:false
                        }
                    },
                    yAxis: {
                        type: "value",
                        name:_this.$t('perfDataView.startTime')+" /s",
                        nameLocation:"middle",
                        nameGap:27,
                        show: true,
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    color:["#1bbc9c"],
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
        mounted() {
            this.histogram = echarts.init(document.getElementById("histogram"+this.propCanvasId+"-"+this.jobId))
            this.setDefaultOption()
            window.addEventListener('resize', this.onResize);
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style>

</style>
