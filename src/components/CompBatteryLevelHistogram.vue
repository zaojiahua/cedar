<template>
    <div>
        <div ref="power"  v-if="showPower" :id="'power'+deviceId" style="height: 80px;">
        </div>
        <p v-else style="margin-left: 40px;color: #FF9900">该设备没有电量信息</p>
    </div>
</template>

<script>
    import echarts from "echarts"
    import utils from "../lib/utils"

    const getPowersSerializer = {
        "devicepowers": [
            {
                "battery_level": "number",
                "record_datetime": "date",
                "power_port": {
                    "port": "string"
                },
            }
        ]
    }
    export default {
        name:"CompBatteryLevelHistogram",
        props:{
            deviceId:{
                type: Number
            }
        },
        data(){
            return{
                histogram: null,
                series: {},
                showPower:true,
            }
        },
        methods:{
            refresh(startTime, endTime){
                this.showPower = true;
                this.$nextTick(function () {
                    this.histogram = echarts.init(document.getElementById("power"+this.deviceId))
                    this.histogram.clear()
                    this.setDefaultOption()
                    this.histogram.showLoading()

                    this.$ajax.get("api/v1/cedar/get_device_power_rapid/?device_id=" + this.deviceId +
                        "&record_datetime__gt=" + startTime +
                        "&record_datetime__lt=" + endTime
                    ).then(response=>{
                        let devicePowers = utils.validate(getPowersSerializer, response.data).devicepowers
                        if(devicePowers.length === 0){
                            this.showPower = false;
                            this.histogram.hideLoading()
                            return;
                        }
                        let curData = []
                        devicePowers.forEach(dp=>{
                            let port = "未配置"
                            let charging = ""
                            if(dp.power_port.port !== null){
                                port = dp.power_port.port;
                            }
                            if(dp.charging){
                                charging = "正在充电"
                            }else {
                                charging = "未充电"
                            }
                            curData.push([dp.record_datetime, dp.battery_level,port,charging ])
                        })
                        let series = {
                            type: 'line',
                            smooth: true,
                            areaStyle: {
                            },
                            data: curData
                        }

                        this.series = series

                        this.histogram.setOption({
                            series: this.series
                        })
                        this.histogram.hideLoading()
                    })
                })
            },
            setDefaultOption(){
                let schema = [
                    {name: 'power', index: 0, text: '电量'},
                    {name: 'port', index: 1, text: '充电口'},
                    {name: 'charging', index: 2, text: '充电状态'},
                ];
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        "text": "电量",
                        "textStyle": {
                            "fontSize": 12
                        },
                        top: "0px",
                        left: "0px"
                    },
                    tooltip:{
                        trigger: "axis",
                        formatter: function (obj) {
                            let value = obj[0].value
                            return value[0] + '<br>'
                                + schema[0].text + '：' + value[1] + '<br>'
                                + schema[1].text + '：' + value[2] + '<br>'
                                + schema[2].text + '：' + value[3] + '<br>'
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
                    color:["#25a902"],
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
            }
        },
        mounted() {
            this.histogram = echarts.init(document.getElementById("power"+this.deviceId))
            this.setDefaultOption()
        }
    }
</script>
