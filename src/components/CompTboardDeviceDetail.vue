<template>
    <Card :title="'设备名称: ' + statistic.deviceName+' ('+statistic.deviceLabel + ')'" dis-hover>
        <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
            <Col>
                <i-circle :percent="statistic.pass/statistic.total*100">
                    <p style="font-size:24px">{{(statistic.pass/statistic.total*100).toFixed(1)}}%</p>
                    <small>成功率</small>
                </i-circle>
            </Col>
            <Col style="margin-left:16px;">
                <b>总共: </b><span>{{statistic.total}}</span><br>
                <b>成功: </b><span>{{statistic.pass}}</span><br>
                <b>失败: </b><span>{{statistic.fail}}</span><br>
                <b>无效: </b><span>{{statistic.invalid}}</span>
            </Col>
        </Row>
        <Divider orientation="left">{{statistic.deviceName}} 运行结果</Divider>
        <Form :label-width="80">
            <Card v-for="statistic in jobStatistic" :key="statistic.id" dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">用例名称:</b>
                    <Input disabled class="disabled-input"
                           :value="statistic.jobName + ' (' + statistic.jobLabel + ')'"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" :value="statistic.total.toFixed(0)"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">成功:</b>
                    <Progress :percent="statistic.pass/statistic.total*100" :stroke-width="4">{{statistic.pass}}</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">失败:</b>
                    <Progress :percent="statistic.fail/statistic.total*100" stroke-color="#ed4014" :stroke-width="4">{{statistic.fail}}</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">无效:</b>
                    <Progress :percent="statistic.invalid/statistic.total*100" stroke-color="#ff9900" :stroke-width="4">{{statistic.invalid}}</Progress>
                </FormItem>
            </Card>
        </Form>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";
    import utils from "../lib/utils";
    import config from "../lib/config";


    const statisticSerializer = {
        id: "number",
        deviceLabel: "string",
        deviceName: "string",
        total: "number",
        pass: "number",
        fail: "number",
        invalid: "number"
    }
    const jobStatisticSerializer = [
        {
            id: "number",
            job_name: "string",
            job_label: "string",
            total: "number",
            pass: "number",
            fail: "number",
            invalid: "number"
        }
    ]
    const getRdsSerializer = {
        rdss: [
            {
                id: "number",
                job_assessment_value: "string",
                job: {
                    id: "number",
                    job_name: "string",
                    job_label: "string",
                }
            }
        ]
    }


    export default {
        name: "CompTboardDeviceDetail",
        components: {CompDeviceDetail},
        data() {
            return {
                statistic: utils.validate(statisticSerializer, {}),
                jobStatistic: utils.validate(jobStatisticSerializer, []),
                spinShow:false,
            }
        },
        methods: {
            refresh(tboardId, statistic) {
                /* statistic has this structure
                {
                    id: 1,  <-- device.id
                    deviceLabel: "DeviceLabel",
                    deviceName: "Device1",
                    total: 1,
                    pass: 0,
                    fail: 0,
                    invalid: 0
                }
                */
                this.spinShow = true;
                this.statistic = statistic
                this.$ajax.get(
                    "api/v1/cedar/rds/?fields=" +
                    "id," +
                    "job_assessment_value," +
                    "job," +
                    "job.id," +
                    "job.job_name," +
                    "job.job_label" +
                    "&tboard=" + tboardId +
                    "&device=" + statistic.id
                ).then(response => {
                    /*  Parse data to structure
                        [
                            {
                                id: 1   <-- job.id
                                jobName: Job1
                                jobLabel: JobLabel1
                                total: 4
                                pass: 2
                                fail: 1,
                                invalid: 1
                            }
                        ]
                    */
                    let rdss = utils.validate(getRdsSerializer, response.data).rdss
                    let jobStatistic = []
                    let keys = {}
                    for (let i = 0; i < rdss.length; ++i) {
                        let rds = rdss[i]
                        let index = null
                        if (rds.job.id === null) continue
                        if (!keys.hasOwnProperty(rds.job.id)) {
                            jobStatistic.push({
                                id: rds.job.id,
                                jobName: rds.job.job_name,
                                jobLabel: rds.job.job_label,
                                total: 0.0001,
                                pass: 0,
                                fail: 0,
                                invalid: 0
                            })
                            keys[rds.job.id] = jobStatistic.length - 1
                        }

                        index = keys[rds.job.id]
                        jobStatistic[index].total += 1

                        if (rds.job_assessment_value === '0') {
                            jobStatistic[index].pass += 1
                        } else if (rds.job_assessment_value === '1') {
                            jobStatistic[index].fail += 1
                        } else {
                            jobStatistic[index].invalid += 1
                        }

                        this.jobStatistic = jobStatistic
                    }
                    this.spinShow = false;
                }).catch(reason => {
                    if (config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                    this.spinShow = false;
                })
            }
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>
