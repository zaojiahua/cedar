<template>
    <div>
        <comp-perf-histogram style="margin-top: 20px;" ref="histogram" :job-id="job.job_id"
                             @on-chart-click="onChartClick" @after-load-data="afterLoadData"
        ></comp-perf-histogram>

        <comp-perf-rds-list ref="perfRdsList" :is-min="isMin" :prop-job-id="job.job_id" :prop-tboard-id="tboardId" :prop-time-range="timeRange"></comp-perf-rds-list>
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
            tboardId:{
                type: Number,
                default: null
            }
        },
        data(){
            return{
                timeRange:"",
                isMin:false,
                minTime:null,
            }
        },
        methods:{
            afterLoadData(item){
                this.timeRange = item
                if(this.timeRange){
                    this.minTime = parseFloat(this.timeRange.split("-")[0])
                    this.isMin = true
                }
            },
            onChartClick(item){
                this.timeRange = item
                let min = parseFloat(this.timeRange.split("-")[0])
                this.isMin = this.minTime===min
            },
        }
    }
</script>

<style scoped>

</style>