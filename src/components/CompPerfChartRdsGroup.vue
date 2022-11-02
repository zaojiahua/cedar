<template>
    <div>
        <comp-perf-histogram style="margin: 20px 0;" ref="histogram" :job-id="job.job_id" :device-id="deviceId"
                             @on-chart-click="onChartClick" @after-load-data="afterLoadData"
        ></comp-perf-histogram>

        <comp-perf-rds-list v-show="timeRange" ref="perfRdsList" :is-min="isMin" :prop-job-id="job.job_id" :prop-tboard-id="tboardId" :device-id="deviceId" :prop-time-range="timeRange"></comp-perf-rds-list>
    </div>
</template>

<script>
    import CompPerfHistogram from "../components/CompPerfHistogram";
    import CompPerfRdsList from "../components/CompPerfRdsList";

    export default {
        name: "CompPerfChartRdsGroup",
        components:{ CompPerfHistogram, CompPerfRdsList },
        props:{
            job:{
                type: Object,
                default: ()=>{
                    return {}
                }
            },
            deviceId:{
                type: Number
            },
            tboardId:{
                type: Number,
                default: null
            }
        },
        data(){
            return{
                timeRange:"",
                isMin:false,  //修改=> 图表取值左开右闭，第一条一条左闭右闭
                maxTime:null,
            }
        },
        methods:{
            afterLoadData(item){
                this.timeRange = item
                if(this.timeRange){
                    this.maxTime = parseFloat(this.timeRange.split("-")[1])
                    this.isMin = true
                }
            },
            onChartClick(item){
                this.timeRange = item
                let max = parseFloat(this.timeRange.split("-")[1])
                this.isMin = this.maxTime===max
            },
        }
    }
</script>

<style scoped>

</style>
