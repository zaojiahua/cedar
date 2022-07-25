<template>
    <div>
        <comp-perf-histogram style="margin: 20px 0;" ref="histogram" :job-id="job.job_id"
                             @on-chart-click="onChartClick" @after-load-data="afterLoadData"
        ></comp-perf-histogram>

        <comp-perf-rds-list v-show="timeRange" ref="perfRdsList" :is-min="isMin" :prop-job-id="job.job_id" :prop-tboard-id="tboardId" :prop-time-range="timeRange"></comp-perf-rds-list>
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
                isMin:false,  //已修改：表示是否是最大值=> 图表取值左闭右开，最后一条左闭右闭
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
