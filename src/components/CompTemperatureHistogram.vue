<template>
    <div>
        <div v-if="showTemperatures" ref="main" :id="'main'+deviceId" style="height: 100px;">
        </div>
        <p v-else style="margin-left: 40px;color: #FF9900">该设备没有温度信息</p>
    </div>
</template>

<script>
    import echarts from "echarts"
    import utils from "../lib/utils"

    const getTemperatureSerializer = {
        "devicetemperatures": [
            {
                "temperature": "number",
                "record_datetime": "date",
                "temp_port": {
                    "port": "string"
                },
            }
        ]
    }

    export default {
        name: "CompTemperatureHistogram",
        props:{
            deviceId:{
                type: Number
            }
        },
        data(){
            return {
                histogram: null,
                series: [],
                showTemperatures:true,
            }
        },
        methods:{
            refresh(startTime, endTime){
                this.showTemperatures=true;
                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("main"+this.deviceId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()
                    this.$ajax.get("api/v1/cedar/get_device_temperature_rapid/?device_id=" + this.deviceId +
                        "&record_datetime__gt=" + startTime +
                        "&record_datetime__lt=" + endTime
                    ).then(response=>{
                        let deviceTemperatures = utils.validate(getTemperatureSerializer, response.data).devicetemperatures
                        if(deviceTemperatures.length===0){
                            this.showTemperatures=false;
                            this.histogram.hideLoading()
                            return;
                        }
                        let temperatureList = [];
                        let curPort = null
                        let curData = []
                        let data = {}
                        deviceTemperatures.forEach(dt=>{
                            if(dt.temp_port.port !== curPort){
                                curPort = dt.temp_port.port
                                if(data.hasOwnProperty(curPort)){
                                    curData = data[curPort].data
                                } else {
                                    curData = []
                                    data[curPort] = {
                                        name: curPort,
                                        type: 'line',
                                        smooth: true,
                                        lineStyle:{
                                        },
                                        areaStyle: {
                                        },
                                        data: curData
                                    }
                                }
                            }
                            curData.push([dt.record_datetime, dt.temperature])
                            temperatureList.push(dt.temperature)
                        })
                        let maxTemperature = Math.ceil(Math.max.apply(null,temperatureList)+2);
                        let minTemperature = Math.floor(Math.min.apply(null,temperatureList)-2);

                        let series = []
                        Object.keys(data).forEach(key=>{
                            series.push(data[key])
                        })

                        this.series = series
                        let temperRange = {
                            max:maxTemperature,
                            min:minTemperature,
                        }

                        this.histogram.setOption({
                            series: this.series,
                            yAxis: temperRange
                        })
                        this.histogram.hideLoading()
                    })
                })
            },
            setDefaultOption(){
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        "text": "温度",
                        "textStyle": {
                            "fontSize": 12
                        },
                        top: "0px",
                        left: "0px"
                    },
                    legend:{
                        right:"20px"
                    },
                    tooltip:{
                        trigger: "axis",
                        formatter: function (obj) {
                            let time = "";
                            let str = "";
                            obj.forEach(item=>{
                                let value = item.value
                                time = value[0] + '<br>'
                                str += item.seriesName + ' ：' + value[1] + '℃' + '<br>'
                            })
                            return time + str
                        }
                    },
                    grid:{
                        left:"30px",
                        right:"30px",
                        top: "30px",
                        bottom: "30px"
                    },
                    xAxis: {
                        type: "time",
                    },
                    yAxis: {
                        type: "value",
                        splitNumber: 1,
                        show: true
                    },
                    dataZoom:[
                        {
                            height: 8,
                            bottom: 20,
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
            this.histogram = echarts.init(document.getElementById("main"+this.deviceId))
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