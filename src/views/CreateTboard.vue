<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <Modal v-model="showSelectDeviceModal" :fullscreen="true" :transfer="false" :closable="false" @on-ok="getDeviceSelection">
                <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true" :prop-device-status="true"
                                  @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
            </Modal>
            <comp-device-list ref="deviceList" :prop-add-mode="false" :prop-auto-load="false" :prop-filter-status="true"></comp-device-list>
            <Row type="flex" justify="center" style="margin-top: 16px;">
                <Col>
                    <Button style="margin-right: 32px; width: 80px;" @click="showSelectDeviceModal=true">选择设备
                    </Button>
                    <Button type="primary" style="width: 80px;" @click="toPageChooseJob" :disabled="disableFlag">下一步</Button>
                </Col>
            </Row>
        </div>


        <div v-if="current===1">
            <Row>
                <comp-filter @on-return-data="onDefaultJobList" ref="jobFilter" :prop-default-device="selectedDevice" @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row type="flex">
                <Col span="11">
                    <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick"></comp-job-list>
                </Col>
                <Col span="2">
                    <Row type="flex" justify="center" style="margin-top: 48px;">
                        <Button @click="selectJob">
                            添加
                            <Icon type="ios-arrow-forward" />
                        </Button>
                    </Row>
                </Col>
                <Col span="11">
                    <comp-job-list style="margin-top: 48px" ref="jobSelectedList" :prop-auto-load="false" :prop-show-search="false"
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
                        <Input v-model="tboardName" style="max-width: 600px;" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">运行轮次</b>
                        <InputNumber v-model="tboardRepeatTime" :min="1" :precision="0"></InputNumber>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="backToPageChooseJob">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="complete">启动任务</Button>
            </Row>
        </div>


        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail"  @closeDrawer="closeDrawer"></comp-job-detail>
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
    import main from "../main";


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
                disableFlag:true,
                deviceSelection:[],
                jobSelection:[],
            }
        },
        methods: {
            // Page "Choose device"
            getDeviceSelection(){
                if(this.$refs.selectDevice.getSelection().length>0){
                    this.$refs.deviceList.refresh(this.$refs.selectDevice.getSelection())
                    this.disableFlag = false;
                    this.deviceSelection = this.$refs.selectDevice.getThisSelection()
                }
            },
            onSelectDeviceModalRowClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            },
            toPageChooseJob(){
                this.selectedDevice = this.$refs.deviceList.getData()
                if(this.selectedDevice.length>0){
                    this.current = 1
                    this.$nextTick(function () {
                        if(this.selectedJob.length>0 ) {
                            this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                            this.$refs.jobList.setSelection(this.jobSelection)
                        }
                    })
                }else {
                    this.$Message.warning("请选择要进行测试的设备！");
                }

            },
            onDefaultJobList(defaultSelection){
                this.$refs.jobList.refreshWithParam("&" + this.selectedDetail(defaultSelection))
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
                    else if(key==="reefuser") key = "author"


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
                this.$refs.jobList.refreshWithParam("&" + this.selectedDetail(selected))
            },
            selectJob(){
                this.$refs.jobSelectedList.refreshWithData(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection()))
            },
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.jobSelection = this.$refs.jobList.getThisSelection();
                if(this.selectedJob.length>0){
                    this.current = 2
                }else {
                    this.$Message.warning("请选择用例要进行测试的用例！");
                }

            },
            backToPageChooseDevice(){
                this.current = 0
                if(this.selectedDevice.length === 0)
                    this.disableFlag = true;
                this.$nextTick(function () {
                    this.$refs.deviceList.refresh(this.selectedDevice)
                    this.$refs.selectDevice.setSelection(this.deviceSelection)
                })
            },
            // Page "Fill info"
            complete(){
                if(config.DEBUG){
                    console.log(this.selectedDevice)
                    console.log(this.selectedJob)
                    console.log(this.tboardName)
                    console.log(this.tboardRepeatTime)
                }
                if(this.tboardRepeatTime===null){
                    this.$Message.warning("请输入运行轮次！")
                }else{
                    let deviceList = [];
                    this.selectedDevice.forEach(device=>{
                        deviceList.push(device.device_label);
                    })
                    let jobList = [];
                    this.selectedJob.forEach(job=>{
                        for (let i=0;i<job.counter;i++){
                            jobList.push(job.job_label);
                        }
                    })
                    utils._initDate();
                    let coralUrl = utils.getCoralUrl(5000)+"/tboard/insert_tboard/";
                    let userId = localStorage.getItem('id');
                    this.$ajax
                        .post(coralUrl,{
                            device_label_list:deviceList,
                            job_label_list:jobList,
                            repeat_time:this.tboardRepeatTime,
                            board_name:this.tboardName,
                            owner_label:userId
                        })
                        .then(response=>{
                            if(response.data.state){
                                this.$Message.success("任务启动成功！")
                                let route = this.$router.resolve({
                                    name: "tboard-management",
                                })
                                window.open(route.href, "_self")
                            }else {
                                this.$Message.error("任务启动失败！")
                                if(config.DEBUG) console.log(response.data);
                            }
                        })
                        .catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("任务启动失败")
                        })
                }

            },
            backToPageChooseJob(){
                this.current = 1
                this.$nextTick(function () {
                    this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                    this.$refs.jobList.setSelection(this.jobSelection);
                })
            },
            JobOnRowClick(row){
                this.showJobDetail = true;
                this.$refs.jobDetail.refresh(row.id)
            },
            closeDrawer(flag){
                this.showJobDetail = flag;
            }
        }
    }
</script>

<style scoped>

</style>