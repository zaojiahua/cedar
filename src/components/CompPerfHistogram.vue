<template>
    <div>
        <div v-show="showChart" :id="'histogram'+propCanvasId+'-'+jobId" style="height: 250px;"></div>
        <div v-show="!showChart" style="font-size: 12px;text-align: center">暂无性能图表信息！</div>
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
            propPhoneModels:{
                type: Array,
                default: ()=>{return []}
            },
            propCanvasId:{
                type: Number
            },
        },
        data(){
            return{
                histogram: null,
                series: {},
                prevIndex:0,
                showChart:true
            }
        },
        methods:{
            refresh(tboardIds){
                this.showChart = true
                let phoneModelsCondition = ""
                if(this.propPhoneModels && this.propPhoneModels.length>0){
                    let phone_model = []
                    let rom = []
                    this.propPhoneModels.forEach(item=>{
                        phone_model.push(item[0])
                        rom.push(item[1])
                    })
                    phoneModelsCondition = "&phone_model_obj="+ phone_model.join(",")+"&rom_version_obj=" + rom.join(",")
                }
                this.prevIndex = 0
                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("histogram"+this.propCanvasId+"-"+this.jobId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()
                    this.$ajax.get("api/v1/cedar/get_perf_data_bar_chart/?tboard="+ tboardIds +"&job="+ this.jobId + phoneModelsCondition
                    ).then(response=>{
                        if(response.data.length===0)
                            this.showChart =  false;
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
                                name:'次数',
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
                        if(response.data.length>0)
                            this.$emit("after-load-data",response.data[response.data.length-1][0])
                        else
                            this.$emit("after-load-data",null)

                        this.prevIndex = 0
                        this.onStyleRender();
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
                        bottom: "41px"
                    },
                    xAxis: {
                        type: "category",
                        name:"应用启动时间/s",
                        nameLocation:"center",
                        nameGap:30,
                    },
                    yAxis: {
                        type: "value",
                        name:"启动时间出现频数",
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
            //突出样式显示
            onStyleRender(){
                this.histogram.setOption({
                    series: [
                        {
                            itemStyle:{
                                normal:{
                                    color: param =>{
                                        if((this.prevIndex === param.dataIndex) ){
                                            return '#ffb381';
                                        }else{
                                            return '#1bbc9c';
                                        }
                                    }
                                }
                            }
                        }]
                });
            },
        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("histogram"+this.propCanvasId+"-"+this.jobId))
            this.setDefaultOption()
            window.addEventListener('resize', this.onResize);
            this.histogram.on('click',params=> {
                this.prevIndex = params.dataIndex
                this.onStyleRender();
                this.$emit("on-chart-click",params.data[0])
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style>

</style>
