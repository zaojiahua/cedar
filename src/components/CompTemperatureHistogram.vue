<template>
    <div ref="main" :id="'main'+deviceId" style="height: 80px;">
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
                series: []
            }
        },
        methods:{
            refresh(startTime, endTime){
                this.histogram.clear()
                this.setDefaultOption()
                this.histogram.showLoading()

                this.$ajax.get("api/v1/cedar/get_device_temperature_rapid/?device_id=" + this.deviceId +
                    "&record_datetime__gt=" + startTime +
                    "&record_datetime__lt=" + endTime
                ).then(response=>{
                    let deviceTemperatures = utils.validate(getTemperatureSerializer, response.data).devicetemperatures
                    if(deviceTemperatures.length===0){
                        this.$emit("on-no-data");
                        this.histogram.hideLoading()
                        return;
                    }
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
                    })



                    let series = []
                    Object.keys(data).forEach(key=>{
                        series.push(data[key])
                    })

                    this.series = series

                    this.histogram.setOption({
                        series: this.series
                    })
                    this.histogram.hideLoading()

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
                    tooltip:{
                        trigger: "axis"
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
                    }
                };

                // 使用刚指定的配置项和数据显示图表。
                this.histogram.setOption(option)
            }
        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("main"+this.deviceId))
            this.setDefaultOption()
        }
    }
</script>

<style scoped>

</style>