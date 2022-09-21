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
                                    distance:3,
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
                            this.$emit("after-load-data",response.data[0][0])
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
                        left:"43px",
                        right:"20px",
                        top: "15px",
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
                        nameGap:29,
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
            //getZr()方法可以监听到整个画布的点击事件
            this.histogram.getZr().on('click',params=> {
                let pointInPixel = [params.offsetX, params.offsetY];
                if (this.histogram.containPixel("grid", pointInPixel)) {
                    // containPixel:判断给定的点是否在指定的坐标系或者系列上
                    // convertFromPixel:转换像素坐标值到逻辑坐标系上的点
                    //点击第几个柱子   (pointInGrid：鼠标点击时对应坐标系x,y所在的位置)
                    let pointInGrid = this.histogram.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
                    //x轴索引此处取[0]
                    let xIndex = pointInGrid[0]

                    this.prevIndex = xIndex
                    this.onStyleRender();
                    this.$emit("on-chart-click",this.series[0].data[xIndex][0])
                }
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize',this.onResize)
        }
    }
</script>

<style>

</style>
