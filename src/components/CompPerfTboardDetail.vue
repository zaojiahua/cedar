<template>
    <div>
        <Card :title="data.board_name + '(' + data.id + ')'" dis-hover>
            <Form :label-width="80">
                <FormItem>
                    <b slot="label">任务名称:</b>
                    <Input disabled class="disabled-input" :value="data.board_name"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">测试用例:</b>
                    <ButtonGroup>
                        <Tooltip v-for="job in data.job_data" :content="job.job_num" :key="job.job_id" placement="top" transfer>
                            <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.job_id)">{{job.job_num}}</Button>
                        </Tooltip>
                    </ButtonGroup>
                </FormItem>
                <FormItem>
                    <b slot="label">测试设备:</b>
                    <ButtonGroup>
                        <Tooltip :content="data.device_name" placement="bottom" transfer>
                            <Button @click="showDeviceDetail=true;$refs.deviceDetail.refresh(data.device_id)">
                                {{data.device_name}}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </FormItem>
                <FormItem>
                    <b slot="label">运行轮次:</b>
                    <Input disabled class="disabled-input" :value="data.repeat_time"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">操作人员:</b>
                    <Input disabled class="disabled-input" :value="data.author_name"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">结束时间:</b>
                    <Input disabled class="disabled-input" :value="data.end_time"></Input>
                </FormItem>
            </Form>
        </Card>

        <Card v-for="(job,index) in data.job_data" :key="job.job_id" style="margin-top: 20px;">
            <Divider orientation="left">测试用例{{ index+1 }}：{{ job.job_num }}</Divider>
            <Table border :columns="jobColumn" :data="[].concat(job)"></Table>
            <comp-perf-chart-rds-group ref="chartRdsGroup" :job="job" :tboard-id="data.id"></comp-perf-chart-rds-group>
        </Card>

        <div></div>

        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompJobDetail from "../components/CompJobDetail";
    import CompPerfChartRdsGroup from "../components/CompPerfChartRdsGroup";

    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        components: { CompDeviceDetail, CompJobDetail, CompPerfChartRdsGroup, },
        data() {
            return {
                data:{},
                showLoading:false,
                showJobDetail:false,
                showDeviceDetail:false,
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
        methods: {
            refresh(tboardId) {
                this.showLoading = true;
                this.$ajax.get("api/v1/cedar/get_tboard_perf_dtail_data/?tboard=" + tboardId)
                    .then(response => {
                        this.data = response.data
                        console.log(111111)
                        // 刷新所有性能图表
                        this.$nextTick(function () {
                            if (this.$refs.chartRdsGroup) {
                                this.$refs.chartRdsGroup.forEach(group => {
                                    group.$refs.histogram.refresh(this.data.id)
                                })
                            }
                        })
                        this.showLoading = false;
                    }).catch(reason => {
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error("载入失败")
                        this.showLoading = false;
                })
            },
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    /deep/ .ivu-table td.avgColumn{
        background-color: #FFAE25;
    }

</style>