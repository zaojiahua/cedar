<template>
    <div :id="'plot'+jobId" style="height: 250px;">

    </div>
</template>

<script>
    import echarts from "echarts"
    import dataTool  from "echarts/extension/dataTool"
    import config from "../lib/config"

    export default {
        props:{
            jobId:{
                type: Number
            },
            propPhoneModels:{
                type: Array,
                default: ()=>{return []}
            },
            propTboardIds:{
                type: Array,
                default: ()=>{return []}
            }
        },
        data(){
            return{
                histogram: null,
                series: {},
            }
        },
        methods:{
            refresh(tboardIds){
                let phone_models = []
                this.propPhoneModels.forEach(item=>{
                    phone_models.push(item.join("."))
                })

                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("plot"+this.jobId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()

                    this.$ajax.get("api/v1/cedar/get_perf_data_chart/?tboard="+ tboardIds +
                        "&job="+ this.jobId +
                        "&model_rom_version="+ phone_models.join(",") +
                        "&sizer=box_chart"
                    ).then(response=>{
                        //将数据处理成盒须图数据
                        let data = echarts.dataTool.prepareBoxplotData(response.data.y_data,{boundIQR: 'none'})

                        this.series = [
                            {
                                name:this.$t('perfDataView.title'),
                                type:'boxplot',
                                data:data.boxData
                            },
                            {
                                name: 'outlier',
                                type: 'scatter',
                                data: data.outliers
                            }
                        ]
                        this.histogram.setOption({
                            series: this.series,
                            xAxis:{ data: response.data.x_data }
                        })
                        this.histogram.hideLoading()

                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('perfDataView.error_5'))
                        this.histogram.hideLoading()
                    })
                })
            },
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    tooltip:{
                        trigger: 'item',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid:{
                        left:"40px",
                        right:"20px",
                        top: "10px",
                        bottom: "45px"
                    },
                    xAxis: {
                        type: 'category',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: "value",
                        name:this.$t('perfDataView.title')+"(s)",
                        nameLocation:"middle",
                        nameGap:25,
                        show: true,
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        splitArea: {             //坐标轴在 grid 区域中的分隔区域
                            show: true
                        }
                    },
                    // color:["#2f83e4"],
                };
                // 使用刚指定的配置项和数据显示图表。
                this.histogram.setOption(option)
            },
            onResize(){
                this.histogram.resize()
            },

        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("plot"+this.jobId))
            this.setDefaultOption()
            window.addEventListener('resize', this.onResize);
            this.refresh(this.propTboardIds.join(","))
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style>

</style>
