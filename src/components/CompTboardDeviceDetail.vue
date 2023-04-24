<template>
    <Card :title="$t('tboardDetail.devName')+': ' + statistic.deviceName+' ('+statistic.deviceLabel + ')'" dis-hover>
        <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
            <Col>
                <i-circle :percent="statistic.pass/statistic.total*100">
                    <p style="font-size:24px">{{(statistic.pass/statistic.total*100).toFixed(1)}}%</p>
                    <small>{{$t('tboardDetail_2.successRatio')}}</small>
                </i-circle>
            </Col>
            <Col style="margin-left:16px;">
                <b>{{$t('tboardDetail.total')}}: </b><span>{{statistic.total}}</span><br>
                <b>{{$t('tboardDetail.pass')}}: </b><span>{{statistic.pass}}</span><br>
                <b>{{$t('tboardDetail.fail')}}: </b><span>{{statistic.fail}}</span><br>
                <b>{{$t('tboardDetail.invalid')}}: </b><span>{{statistic.invalid}}</span>
            </Col>
        </Row>
        <Divider orientation="left">{{statistic.deviceName}} {{$t('tboardDetail_2.result')}}</Divider>
        <Form :label-width="85">
            <Card v-for="statistic in jobStatistic" :key="statistic.id" dis-hover style="margin-bottom: 16px;">
                <FormItem style="margin-bottom: 8px;">
                    <b slot="label">{{$t('tboardDetail.jobName')}}:</b>
                    <Input disabled class="disabled-input"
                           :value="statistic.jobName + ' (' + statistic.jobLabel + ')'"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">{{$t('tboardDetail.total')}}:</b>
                    <Input disabled class="disabled-input" :value="statistic.total.toFixed(0)"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">{{$t('tboardDetail.pass')}}:</b>
                    <Progress :percent="statistic.pass/statistic.total*100" :stroke-width="4">{{statistic.pass}}</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">{{$t('tboardDetail.fail')}}:</b>
                    <Progress :percent="statistic.fail/statistic.total*100" stroke-color="#ed4014" :stroke-width="4">{{statistic.fail}}</Progress>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">{{$t('tboardDetail.invalid')}}:</b>
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
                    this.$Message.error(this.$t('public.loadFail'))
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
