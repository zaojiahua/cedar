<template>
    <div>
        <Row style="margin-bottom: 16px;">
            <RadioGroup v-model="groupView" type="button">
                <Radio style="minWidth: 100px;text-align: center;" :label="1">{{$t('rdsTboardDeviceStatistic.tip_2')}}</Radio>
                <Radio style="minWidth: 100px;text-align: center;" :label="2">{{$t('perfDataView.label_5')}}</Radio>
            </RadioGroup>
            <Button style="float: right;" @click="refreshData">{{$t('perfDataView.btn_3')}}</Button>
            <div style="float: right;margin-right:16px;width:230px;">
                <Input class="search-box" v-model="rdsId" :number="true" search enter-button placeholder="输入RDS ID" @on-search="rdsIdentify" @on-clear="onClearIdentify" :clearable="true"/>
            </div>
        </Row>
        <div v-show="groupView===1">
            <comp-perf-chart-rds-track-group v-if="groupView===1" ref="tarckRdsGroup" :job="job" :tboard-id="tboardId" :index="index" :device-id="deviceId"></comp-perf-chart-rds-track-group>
        </div>
        <div v-show="groupView===2">
            <Table border :columns="jobColumn" :data="jobData"></Table>
            <comp-perf-chart-rds-group v-if="groupView===2" ref="chartRdsGroup" :job="job" :tboard-id="tboardId" :device-id="deviceId"></comp-perf-chart-rds-group>
        </div>
    </div>
</template>

<script>
    import CompPerfChartRdsGroup from "../components/CompPerfChartRdsGroup";
    import CompPerfChartRdsTrackGroup from "./CompPerfChartRdsTrackGroup";
    import config from "../lib/config";

    export default {
        components:{ CompPerfChartRdsGroup, CompPerfChartRdsTrackGroup, },
        props:{
            index:{
                type:Number,
            },
            job:{
                type:Object,
            },
            tboardId:{
                type:Number,
            },
            deviceId:{
                type:Number,
            }
        },
        data(){
            return{
                groupView:1,
                jobColumn:[
                    {
                        title: this.$t('perfDataView.jobColumn_1') +'[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_2') +'[s]',
                        key: 'max',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_3') +'[s]',
                        key: 'median',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_4'),
                        key: 'success_num',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_5'),
                        key: 'failed_num',
                        align: 'center'
                    },
                ],
                rdsId:null,
                jobData:[],
            }
        },
        methods:{
            //刷新当前数据
            refreshData(){
                if(this.groupView===1){
                    this.$nextTick(function () {
                        this.$refs.tarckRdsGroup.$refs.histogram.refresh(this.tboardId)
                    })
                }
                if(this.groupView===2){
                    this.$nextTick(function () {
                        this.getJobData()
                        this.$refs.chartRdsGroup.$refs.histogram.refresh(this.tboardId)
                    })
                }
                this.rdsId = null
            },
            //获取中位数等信息
            getJobData(){
                this.$ajax.get("api/v1/cedar/get_tboard_perf_dtail_data/?tboard=" + this.tboardId +"&devices="+this.deviceId)
                    .then(response => {
                        this.data = response.data
                        let hash = {};
                        // job_data 用例信息去重
                        let jobDataList = response.data.job_data.reduce(function(item, next) {
                            hash[next.job_num] ? '' : hash[next.job_num] = true && item.push(next);
                            return item
                        }, [])
                        jobDataList.forEach(item=>{
                            if(item.job_id===this.job.job_id){
                                this.jobData = [].concat(item)
                            }
                        })
                    }).catch(reason => {
                    if (config.DEBUG) console.log(reason)
                    this.$Message.error(this.$t('perfDataView.error_2'))
                })
            },
            rdsIdentify(){
                if(typeof this.rdsId !== 'number'){
                    this.$Message.warning(this.$t('rdsTboardDeviceStatistic.tips_2'))
                    return
                }
                if(this.groupView===1){
                    this.$nextTick(function () {
                        this.$refs.tarckRdsGroup.$refs.rdsCard._setSearchId(this.rdsId)
                        this.$refs.tarckRdsGroup.$refs.rdsCard.showRdsIdentity(this.rdsId)
                    })
                }
                if(this.groupView===2){
                    this.$nextTick(function () {
                        this.$refs.chartRdsGroup.$refs.perfRdsList.$refs.perfRdsCard._setSearchId(this.rdsId)
                        this.$refs.chartRdsGroup.$refs.perfRdsList.$refs.perfRdsCard.showRdsIdentity(this.rdsId)
                    })
                }
            },
            onClearIdentify(){
                this.rdsId = null
                if(this.groupView===1){
                    this.$nextTick(function () {
                        this.$refs.tarckRdsGroup.$refs.rdsCard._setSearchId(this.rdsId)
                        this.$refs.tarckRdsGroup.$refs.rdsCard.showRdsIdentity(this.rdsId)
                    })
                }
                if(this.groupView===2){
                    this.$nextTick(function () {
                        this.$refs.chartRdsGroup.$refs.perfRdsList.$refs.perfRdsCard._setSearchId(this.rdsId)
                        this.$refs.chartRdsGroup.$refs.perfRdsList.$refs.perfRdsCard.showRdsIdentity(this.rdsId)
                    })
                }
            },
        },
        watch:{
            groupView:{
                handler:function (val) {
                    if(val===1){
                        this.$nextTick(function () {
                            this.$refs.tarckRdsGroup.$refs.histogram.refresh(this.tboardId)
                        })
                    }
                    if(val===2){
                        this.$nextTick(function () {
                            this.getJobData()
                            this.$refs.chartRdsGroup.$refs.histogram.refresh(this.tboardId)
                        })
                    }
                    this.rdsId = null
                },
                immediate: true
            },
            deviceId:{
                handler:function (val) {
                    if(this.groupView===1){
                        this.$nextTick(function () {
                            this.$refs.tarckRdsGroup.$refs.histogram.refresh(this.tboardId)
                        })
                    }
                    if(this.groupView===2){
                        this.$nextTick(function () {
                            this.getJobData()
                            this.$refs.chartRdsGroup.$refs.histogram.refresh(this.tboardId)
                        })
                    }
                },
                immediate: true
            },
        }
    }

</script>
<style scoped>
    /deep/.search-box .ivu-input-icon-clear{
        margin-right: 45px!important;
    }
</style>
