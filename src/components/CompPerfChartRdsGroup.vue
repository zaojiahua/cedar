<template>
    <div>
        <comp-perf-histogram style="margin-top: 20px;" ref="histogram" :job-id="job.job_id"
                             @on-chart-click="onChartClick" @after-load-data="afterLoadData"
        ></comp-perf-histogram>

        <comp-perf-rds-list ref="perfRdsList" :prop-job-id="job.job_id" :prop-tboard-id="tboardId" :prop-time-range="timeRange"></comp-perf-rds-list>
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
                timeRange:""
            }
        },
        methods:{
            afterLoadData(item){
                this.timeRange = item
            },
            onChartClick(item){
                this.timeRange = item
            },
        }
    }
</script>

<style scoped>

</style>