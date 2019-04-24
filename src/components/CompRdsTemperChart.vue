<template>
    <div style="height: 300px;" id="temper"></div>
</template>

<script>
    import echarts from 'echarts'
    import echartsList from '../lib/echartsList'


    export default {
        name:"CompRdsTemperChart",
        props:{
            propDeviceId:{
                type: Number,
                default:null
            },
            propRdsStart_time:{
                type: String,
                default:""
            },
            propRdsEnd_time:{
                type: String,
                default:""
            }
        },
        data(){
            return{

            }
        },
        methods:{
            showTemper(){
                this.$ajax.get('/api/v1/cedar/device_temperature/' +
                    '?record_datetime__gt=' + this.propRdsStart_time +
                    '&record_datetime__lt=' + this.propRdsEnd_time  +
                    '&device_id=' + this.propDeviceId +
                    '&fields=' +
                    'device,' +
                    'device.id,' +
                    'temperature,' +
                    'record_datetime,' +
                    'temp_port,' +
                    'temp_port.port')
                    .then(response=>{
                        response.data.devicetemperatures.sort(this.sortTemperData);
                        if(response.data.devicetemperatures.length>0){
                            let data = response.data['devicetemperatures'];
                            let handled_data = {};
                            for (let i = 0; i < data.length; i++) {
                                let temp = data[i];
                                let port = temp['temp_port']['port'];
                                if(!(port in handled_data)){
                                    handled_data[port] = {
                                        'temperatures': [],
                                        'record_datetimes': []
                                    }
                                }
                                handled_data[port]['temperatures'].push(temp['temperature']);
                                handled_data[port]['record_datetimes'].push(temp['record_datetime']);
                            }
                            let titArr=[], timeArr=[],tempArr=[],maxArr=[],minArr=[];
                            for(let key in handled_data){
                                timeArr = handled_data[key].record_datetimes;
                                tempArr.push(handled_data[key].temperatures);
                                maxArr.push(Math.max.apply(null,handled_data[key].temperatures));
                                minArr.push(Math.min.apply(null,handled_data[key].temperatures));
                            }
                            let Y_data=[];
                            for(var i=0;i<tempArr.length;i++){
                                Y_data.push({
                                    type:'line',
                                    name:titArr[i],//在图表的上方显示jobId
                                    data:tempArr[i]
                                });
                            }
                            let maxObj = Math.ceil(Math.max.apply(null,maxArr)+3);
                            let minObj = Math.floor(Math.min.apply(null,minArr)-3);
                            let myChart=echarts.init(document.getElementById("temper"));
                            let option= echartsList.temper(timeArr,Y_data,titArr,maxObj,minObj);
                            myChart.setOption(option);
                        }

                    })
            },
            sortTemperData(a,b){
                return Date.parse(a.record_datetime)-Date.parse(b.record_datetime);
            }
        },
        mounted(){
            this.showTemper();
        }
    }
</script>