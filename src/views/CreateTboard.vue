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
                <comp-filter ref="jobFilter" @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row type="flex" style="margin-top: 16px;">
                <Col span="11">
                    <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick" @pageData="pageData"></comp-job-list>
                </Col>
                <Col span="2">
                    <Row type="flex" justify="center" style="margin: auto;">
                        <Button @click="selectJob">
                            添加
                            <Icon type="ios-arrow-forward" />
                        </Button>
                    </Row>
                </Col>
                <Col span="11">
                    <comp-job-list ref="jobSelectedList" :prop-auto-load="false"
                                   :prop-show-counter="true" :prop-deletable="true" :prop-show-page="false"></comp-job-list>
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


        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail" @closeDrawer="closeDrawer"></comp-job-detail>
        </Drawer>

    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: {CompJobList, CompDeviceList, CompFilter,CompJobDetail},
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
                tboardRepeatTime: 1,
                showJobDetail:false,
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
            selectedDetail(selected){
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
                return param
            },
            onJobFilterChange(selected){
                // this.jobRequestSource.cancel()
                let param = this.selectedDetail(selected);
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
            pageData(pageIndex){
                let param = this.selectedDetail(this.$refs.jobFilter._jobRender())
                let url = "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_name," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description&"+param
                this.$refs.jobList.getPageData(url,pageIndex);
            },
            // Page "Fill info"
            complete(){
                console.log(this.selectedDevice)
                console.log(this.selectedJob)
                console.log(this.tboardName)
                console.log(this.tboardRepeatTime)
                let deviceList = [];
                this.selectedDevice.forEach(device=>{
                    deviceList.push(device.device_label);
                })
                let jobList = [];
                this.selectedJob.forEach(job=>{
                    jobList.push(job.job_label);
                })
                utils._initDate();
                let boardStamp = new Date().format("yyyy_MM_dd_hh_mm_ss");
                let coralUrl = utils.getCoralUrl(config.CREATETBOARD_PORT);
                this.$ajax
                    .post(coralUrl,{
                        requestName:"insertTBoard",
                        boardDict:{
                            boardName:this.tboardName,
                            deviceIDList:deviceList,
                            jobIDList:jobList,
                            jobListNum:this.tboardRepeatTime,
                            boardStamp:boardStamp,
                            ownerID:3       //动态获取当前用户的id=>TO DO
                        }
                    })
                    .then(response=>{
                        this.$Message.success("任务启动成功！")
                    })
                    .catch(error=>{
                        this.$Message.error("任务启动失败")
                    })
            },
            backToPageChooseJob(){
                this.current = 1
            },
            JobOnRowClick(row){
                this.showJobDetail = true;
                this.$refs.jobDetail.refresh(row.id)
            },
            closeDrawer(msg){
                this.showJobDetail = msg;
            }
        }
    }
</script>

<style scoped>

</style>