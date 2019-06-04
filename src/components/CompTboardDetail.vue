<template>
    <Card title="Tboard1" dis-hover>
        <Form :label-width="80">
            <FormItem>
                <b slot="label">任务名称:</b>
                <Input disabled class="disabled-input" :value="data.board_name"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">测试用例:</b>
                <ButtonGroup>
                    <Tooltip v-for="job in data.job" :content="job.job_label" :key="job.id" placement="top" transfer>
                        <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.id)">{{job.job_name}}</Button>
                    </Tooltip>
                </ButtonGroup>
            </FormItem>
            <FormItem>
                <b slot="label">测试设备:</b>
                <ButtonGroup>
                    <Tooltip v-for="device in data.device" :content="device.device_label" :key="device.id" placement="bottom" transfer>
                        <Button @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                            {{device.device_name}}
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
                <Input disabled class="disabled-input" :value="data.author.username"></Input>
            </FormItem>
            <Divider orientation="left">总体运行结果</Divider>
            <Row type="flex" align="middle" style="margin: 32px 16px 32px 16px;">
                <Col>
                    <i-circle :percent="(totalStatisticData.pass/totalStatisticData.total*100)">
                        <p style="font-size:24px">{{(totalStatisticData.pass/totalStatisticData.total*100).toFixed(1)}}%</p>
                        <small>成功率</small>
                    </i-circle>
                </Col>
                <Col style="margin-left:16px;">
                    <b>总共: </b><span>{{totalStatisticData.total.toFixed()}}</span><br>
                    <b>通过: </b><span>{{totalStatisticData.pass}}</span><br>
                    <b>失败: </b><span>{{totalStatisticData.fail}}</span><br>
                    <b>无效: </b><span>{{totalStatisticData.invalid}}</span>
                </Col>
            </Row>
            <Divider orientation="left">设备运行结果</Divider>
                <div v-for="statistic in deviceStatisticData" :key="statistic.device_label" style="padding: 7px 16px;">
                    <Row type="flex" align="middle" style="margin-top: 16px; margin-bottom: 16px;" @click.native="onCellClick(statistic)">
                        <Col>
                            <i-circle :size="80" :percent="statistic.pass*100/statistic.total">
                                <p>{{(statistic.pass*100/statistic.total).toFixed(1)}}%</p>
                                <small>成功率</small>
                            </i-circle>
                        </Col>
                        <Col style="margin-left: 16px;">
                            <b>设备名称: </b><span>{{statistic.deviceName}}</span><br>
                            <b>总共: </b><span>{{statistic.total}}</span><br>
                            <b>通过: </b><span>{{statistic.pass}}</span><br>
                            <b>失败: </b><span>{{statistic.fail}}</span><br>
                            <b>无效: </b><span>{{statistic.invalid}}</span>
                        </Col>
                    </Row>
                    <Row>
                        <comp-temperature-histogram v-if="showTemperatures" :device-id="statistic.id" ref="histogram" @isShow="isShowTemperatures"></comp-temperature-histogram>
                    </Row>
                    <Row style="margin-top: 10px;">
                        <comp-battery-level-histogram v-if="showPower" :device-id="statistic.id" ref="histogram" @isShow="isShowPower"></comp-battery-level-histogram>
                    </Row>
                </div>
            <Divider orientation="left">用例运行结果</Divider>
            <div v-for="statistic in jobStatisticData" :key="statistic.id" @click="onJobCellClick(statistic)" style="padding: 7px 16px;">
                <Row type="flex" align="middle" style="margin: 16px 0">
                    <Col>
                        <i-circle :size="80" :percent="statistic.pass*100/statistic.total">
                            <p>{{(statistic.pass*100/statistic.total).toFixed(1)}}%</p>
                            <small>成功率</small>
                        </i-circle>
                    </Col>
                    <Col style="margin-left: 16px;">
                        <b>用例名称: </b><span>{{statistic.job_name}}</span><br>
                        <b>总共: </b><span>{{statistic.total}}</span><br>
                        <b>通过: </b><span>{{statistic.pass}}</span><br>
                        <b>失败: </b><span>{{statistic.fail}}</span><br>
                        <b>无效: </b><span>{{statistic.na}}</span>
                    </Col>
                </Row>
            </div>
        </Form>
        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompJobList from "./CompJobList";
    import CompJobDetail from "./CompJobDetail";
    import CompTemperatureHistogram from "./CompTemperatureHistogram";
    import CompBatteryLevelHistogram from "./CompBatteryLevelHistogram";

    const getTboardSerializer = {
        board_name: "string",
        job: [
            {
                id: "number",
                job_name: "string",
                job_label: "string"
            }
        ],
        device: [
            {
                id: "number",
                device_name: "string",
                device_label: "string"
            }
        ],
        repeat_time: "number",
        author: {
            id: "number",
            username: "string",
            last_name: "string"
        },
        board_stamp: "date",
        end_time: "date"

    }
    const getRdsSerializer = {
        rdss: [
            {
                id: "number",
                job_assessment_value: "string",
                device: {
                    id: "number",
                    device_label: "string",
                    device_name: "string"
                }
            }
        ]
    }
    const statisticDataSerializer = [
        {
            id: "number",
            deviceLabel: "string",
            deviceName: "string",
            total: "number",
            pass: "number",
            fail: "number",
            invalid: "number"
        }
    ]
    const jobStatisticDataSerializer = [
        {
            id: "number",
            job_name: "string",
            total: "number",
            pass: "number",
            fail: "number",
            na: "number"
        }
    ]

    export default {
        name: "CompTboardDetail",
        components: {CompTemperatureHistogram, CompJobList, CompDeviceDetail, CompJobDetail, CompBatteryLevelHistogram},
        data() {
            return {
                data: utils.validate(getTboardSerializer, {}),
                deviceStatisticData: utils.validate(statisticDataSerializer, []),
                totalStatisticData: {
                    total: 0.0001,  // Prevent divide by zero
                    pass: 0,
                    fail: 0,
                    invalid: 0
                },
                showMoreDetail: false,
                showDeviceDetail: false,
                showJobDetail: false,
                showPower:true,
                showTemperatures:true,
                showLoading:false,
                jobStatisticData:utils.validate(jobStatisticDataSerializer, []),

            }
        },
        methods: {
            refresh(tboardId) {
                this.showLoading = true;
                this.showPower = true;
                this.showTemperatures = true;
                this.totalStatisticData.pass
                    = this.totalStatisticData.fail
                    = this.totalStatisticData.invalid
                    = 0
                this.totalStatisticData.total = 0.0001  // Prevent divide by zero

                this.$ajax.get(
                    "api/v1/cedar/tboard/" + tboardId + "/?fields=" +
                    "id," +
                    "board_name," +
                    "job," +
                    "job.id," +
                    "job.job_name," +
                    "job.job_label," +
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label," +
                    "repeat_time," +
                    "author," +
                    "author.id," +
                    "author.username," +
                    "author.last_name," +
                    "board_stamp," +
                    "end_time"
                ).then(response => {
                    this.data = utils.validate(getTboardSerializer, response.data)
                    // 刷新所有温度图表
                    this.$refs.histogram.forEach(histogram=>{
                        histogram.refresh(this.data.board_stamp, this.data.end_time)
                    })
                    this.showLoading = false;
                }).catch(reason => {
                    if (config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                    this.showLoading = false;
                })
                this.$ajax.get(
                    "api/v1/cedar/get_rds_rapid/?tboard__id=" + tboardId
                ).then(response => {
                    let rdss = utils.validate(getRdsSerializer, response.data).rdss
                    let keys = []
                    /*
                        keys structure:
                        {
                            DeviceLabel1: 0,
                            DeviceLabel2: 1
                        }

                    */
                    let statistic = []
                    /* After processing, statistic will like below:
                        [
                            {
                                id: 1,  <-- device.id
                                deviceLabel: "DeviceLabel",
                                deviceName: "Device1",
                                total: 1,
                                pass: 0,
                                fail: 0,
                                invalid: 0
                            }
                        ]
                    */
                    for (let i = 0; i < rdss.length; ++i) {
                        let deviceLabel = rdss[i].device.device_label
                        if (deviceLabel === null) continue

                        let index = null

                        if (!keys.hasOwnProperty(deviceLabel)) {
                            statistic.push({
                                id: rdss[i].device.id,
                                deviceLabel: rdss[i].device.device_label,
                                deviceName: rdss[i].device.device_name,
                                total: 0,
                                pass: 0,
                                fail: 0,
                                invalid: 0
                            })
                            index = statistic.length - 1
                            keys[deviceLabel] = index
                        }
                        index = keys[deviceLabel]

                        statistic[index].total += 1
                        this.totalStatisticData.total += 1

                        if (rdss[i].job_assessment_value === "0") {  // 成功
                            this.totalStatisticData.pass += 1
                            statistic[index].pass += 1
                        } else if (rdss[i].job_assessment_value === "1") {  //失败
                            this.totalStatisticData.fail += 1
                            statistic[index].fail += 1
                        } else {
                            this.totalStatisticData.invalid += 1
                            statistic[index].invalid += 1
                        }
                    }
                    this.deviceStatisticData = utils.validate(statisticDataSerializer, statistic)
                })
                this.$ajax.get("api/v1/statistics/get_tboard_running_detail/?tboard_id=" + tboardId )
                    .then(response=>{
                        this.jobStatisticData = utils.validate(jobStatisticDataSerializer, response.data.jobs)

                    })
            },
            onCellClick(statistic){
                this.$emit('on-cell-click', this.data.id, statistic)
            },
            onJobCellClick(statistic){
                this.$emit('on-job-cell-click', this.data.id, statistic)
            },
            isShowPower(flag){
                this.showPower = flag;
            },
            isShowTemperatures(flag){
                this.showTemperatures = flag;
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