<template>
    <div>
        <Row style="margin-bottom: 16px;">
            <RadioGroup v-model="groupView" type="button">
                <Radio style="width: 100px;text-align: center;" :label="1">测试轨迹</Radio>
                <Radio style="width: 100px;text-align: center;" :label="2">统计视图</Radio>
            </RadioGroup>
            <div style="float: right;margin-right:20px;width:230px;">
                <Input class="search-box" v-model="rdsId" :number="true" search enter-button placeholder="输入RDS ID" @on-search="rdsIdentify" @on-clear="onClearIdentify" :clearable="true"/>
            </div>
        </Row>
        <div v-show="groupView===1">
            <comp-perf-chart-rds-track-group v-if="groupView===1" ref="tarckRdsGroup" :job="job" :tboard-id="tboardId" :index="index" :device-id="deviceId"></comp-perf-chart-rds-track-group>
        </div>
        <div v-show="groupView===2">
            <Table border :columns="jobColumn" :data="[].concat(job)"></Table>
            <comp-perf-chart-rds-group v-if="groupView===2" ref="chartRdsGroup" :job="job" :tboard-id="tboardId"></comp-perf-chart-rds-group>
        </div>
    </div>
</template>

<script>
    import CompPerfChartRdsGroup from "../components/CompPerfChartRdsGroup";
    import CompPerfChartRdsTrackGroup from "./CompPerfChartRdsTrackGroup";

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
                        title: '平均值[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn'
                    },
                    {
                        title: '最大值[s]',
                        key: 'max',
                        align: 'center'
                    },
                    {
                        title: '中位数[s]',
                        key: 'median',
                        align: 'center'
                    },
                    {
                        title: '启动成功/次',
                        key: 'success_num',
                        align: 'center'
                    },
                    {
                        title: '启动失败/次',
                        key: 'failed_num',
                        align: 'center'
                    },
                ],
                rdsId:null,
            }
        },
        methods:{
            rdsIdentify(){
                if(typeof this.rdsId !== 'number'){
                    this.$Message.warning("请输入正确的 RDS ID")
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
