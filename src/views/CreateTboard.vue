<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <Modal v-model="showSelectDeviceModal" :fullscreen="true" :transfer="false" :closable="false" @on-ok="getDeviceSelection">
                <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                                  @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
            </Modal>
            <comp-device-list ref="deviceList" :prop-add-mode="false" :prop-auto-load="false"></comp-device-list>
            <Row type="flex" justify="center" style="margin-top: 16px;">
                <Col>
                    <Button style="margin-right: 32px; width: 80px;" @click="showSelectDeviceModal=true">选择设备
                    </Button>
                    <Button type="primary" style="width: 80px;" @click="toPageChooseJob">下一步</Button>
                </Col>
            </Row>
        </div>


        <div v-if="current===1">
            <Row>
                <comp-filter @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row type="flex" style="margin-top: 16px;">
                <Col span="11">
                    <comp-job-list ref="jobList" :prop-multi-select="true"></comp-job-list>
                </Col>
                <Col span="2">
                    <Row type="flex" justify="center"style="margin: auto;">
                        <Button @click="selectJob">
                            添加
                            <Icon type="ios-arrow-forward" />
                        </Button>
                    </Row>
                </Col>
                <Col span="11">
                    <comp-job-list ref="jobSelectedList" :prop-auto-load="false"
                                   :prop-show-counter="true" :prop-deletable="true"></comp-job-list>
                </Col>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="backToPageChooseDevice">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="toPageFillInfo">下一步</Button>
            </Row>
        </div>


        <div v-if="current===2">
            <Card title="填写任务讯息" dis-hover>
                <Form :label-width="80">
                    <FormItem>
                        <b slot="label">任务名称</b>
                        <Input v-model="tboardName" style="max-width: 600px;"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">运行轮次</b>
                        <InputNumber v-model="tboardRepeatTime"></InputNumber>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="backToPageChooseJob">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="complete">启动任务</Button>
            </Row>
        </div>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: {CompJobList, CompDeviceList, CompFilter},
        data() {
            return {
                current: 0,
                // Page "Choose device"
                showSelectDeviceModal: false,
                selectedDevice:[],
                // Page "Choose job"
                jobRequestQueue:[],
                jobRequestSource: this.$ajax.CancelToken.source(),
                selectedJob: [],
                // Page "Fill info"
                tboardName: "",
                tboardRepeatTime: 1
            }
        },
        methods: {
            // Page "Choose device"
            getDeviceSelection(){
                this.$refs.deviceList.refresh(this.$refs.selectDevice.getSelection())
            },
            onSelectDeviceModalRowClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            },
            toPageChooseJob(){

                this.selectedDevice = this.$refs.deviceList.getData()
                this.current = 1
            },
            // Page "Choose job"
            onJobFilterChange(selected){
                // this.jobRequestSource.cancel()
                let conditions = []
                Object.keys(selected).forEach(key=>{
                    let condition = []  // store id data like [1,2,3]
                    selected[key].forEach(item=>{
                        condition.push(item.id)
                    })

                    // 不统一的命名额外处理
                    if(key==="job_test_area") key = "test_area"
                    else if(key==="phone_model") key = "phone_models"


                    condition.forEach(item=>{
                        item = key+"__id="+item
                    })

                    let conditionStr = key+"__id__in="+"ReefList["+condition.join("{%,%}")+"]"
                    conditions.push(conditionStr)
                })

                let param = conditions.join("&")
                this.$refs.jobList.refreshViaUrl(
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_name," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description&"+param
                )
            },
            selectJob(){
                this.$refs.jobSelectedList.refresh(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection()))
            },
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.current = 2
            },
            backToPageChooseDevice(){
                this.current = 0
            },
            // Page "Fill info"
            complete(){
                console.log(this.selectedDevice)
                console.log(this.selectedJob)
                console.log(this.tboardName)
                console.log(this.tboardRepeatTime)
            },
            backToPageChooseJob(){
                this.current = 1
            }
        }
    }
</script>

<style scoped>

</style>