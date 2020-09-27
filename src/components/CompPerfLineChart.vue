<template>
    <div :id="'lineChart'+jobId" style="height: 250px;">

    </div>
</template>

<script>
    import echarts from "echarts"
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
                prevIndex:0,
            }
        },
        methods:{
            refresh(tboardIds){
                let phone_models = []
                this.propPhoneModels.forEach(item=>{
                    phone_models.push(item.join("."))
                })

                this.prevIndex = 0
                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("lineChart"+this.jobId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()
                    this.$ajax.get("api/v1/cedar/get_perf_data_chart/?tboard="+ tboardIds +
                        "&job="+ this.jobId +
                        "&model_rom_version="+ phone_models.join(",") +
                        "&sizer=line_chart"
                    ).then(response=>{
                        let list = []
                        response.data.forEach(item=>{
                            list.push(item[1])
                        })
                        let max = Math.ceil(Math.max.apply(null,list)+3);

                        let vRange = {
                            max:max,
                        }
                        this.series = [
                            {
                                name:'均值',
                                type:'line',
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
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("图表加载失败")
                        this.histogram.hideLoading()
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
                        type: "category",
                    },
                    yAxis: {
                        type: "value",
                        name:"启动时间均值(s)",
                        nameLocation:"middle",
                        nameGap:23,
                        show: true,
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    color:["#2f83e4"],
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
            //突出样式显示
            onStyleRender(){
                this.histogram.setOption({
                    series: [
                        {
                            symbolSize:(data,param)=>{
                                if((this.prevIndex === param.dataIndex) )
                                    return 10
                                else
                                    return 4
                            },
                        }]
                });
            },

        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("lineChart"+this.jobId))
            this.setDefaultOption()
            window.addEventListener('resize', this.onResize);
            this.refresh(this.propTboardIds.join(","))
            this.histogram.on('click',params=> {
                this.prevIndex = params.dataIndex
                this.onStyleRender();
                this.$emit("on-chart-click",params.data)
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style>

</style>