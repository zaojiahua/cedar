<template>
    <div>
        <Row style="margin-bottom: 16px;">
            <RadioGroup v-model="groupView" type="button">
                <Radio style="width: 100px;text-align: center;" :label="1">测试轨迹</Radio>
                <Radio style="width: 100px;text-align: center;" :label="2">统计视图</Radio>
            </RadioGroup>
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
            }
        },
        methods:{

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
                },
                immediate: true
            },
        }
    }

</script>
