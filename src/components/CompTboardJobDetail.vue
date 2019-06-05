<template>
    <Card :title="'用例名称: ' + statistic.job_name+'('+statistic.id + ')'" dis-hover>
        <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
            <Col>
                <i-circle :percent="statistic.pass/statistic.total*100">
                    <p style="font-size:24px">{{(statistic.pass/statistic.total*100).toFixed(1)}}%</p>
                    <small>成功率</small>
                </i-circle>
            </Col>
            <Col style="margin-left:16px;">
                <b>总共: </b><span>{{statistic.total}}</span><br>
                <b>通过: </b><span>{{statistic.pass}}</span><br>
                <b>失败: </b><span>{{statistic.fail}}</span><br>
                <b>无效: </b><span>{{statistic.na}}</span>
            </Col>
        </Row>
        <Divider orientation="left">{{statistic.job_name}} 运行结果</Divider>
        <Form :label-width="80">
            <Card v-for="statistic in deviceStatistic" :key="statistic.id" dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">设备名称:</b>
                    <Input disabled class="disabled-input"
                           :value="statistic.device_name + ' (' + statistic.device_label + ')'"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">结果总数:</b>
                    <Input disabled class="disabled-input" :value="statistic.total.toFixed(0)"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">通过:</b>
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
    import utils from "../lib/utils";
    import config from "../lib/config";


    const statisticSerializer = {
        id: "number",
        job_name: "string",
        total: "number",
        pass: "number",
        fail: "number",
        invalid: "number"
    }
    const deviceStatisticSerializer = [
        {
            id: "number",
            device_name: "string",
            device_label: "string",
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
                device: {
                    id: "number",
                    device_name: "string",
                    device_label: "string",
                }
            }
        ]
    }


    export default {
        name: "CompTboardJobDetail",
        data() {
            return {
                statistic: utils.validate(statisticSerializer, {}),
                deviceStatistic: utils.validate(deviceStatisticSerializer, []),
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
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label" +
                    "&tboard=" + tboardId +
                    "&job=" + statistic.id
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
                    let deviceStatistic = []
                    let keys = {}
                    for (let i = 0; i < rdss.length; ++i) {
                        let rds = rdss[i]
                        let index = null
                        if (rds.device.id === null) continue
                        if (!keys.hasOwnProperty(rds.device.id)) {
                            deviceStatistic.push({
                                id: rds.device.id,
                                device_name: rds.device.device_name,
                                device_label: rds.device.device_label,
                                total: 0.0001,
                                pass: 0,
                                fail: 0,
                                invalid: 0
                            })
                            keys[rds.device.id] = deviceStatistic.length - 1
                        }

                        index = keys[rds.device.id]
                        deviceStatistic[index].total += 1

                        if (rds.job_assessment_value === '0') {
                            deviceStatistic[index].pass += 1
                        } else if (rds.job_assessment_value === '1') {
                            deviceStatistic[index].fail += 1
                        } else {
                            deviceStatistic[index].invalid += 1
                        }

                        this.deviceStatistic = deviceStatistic
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