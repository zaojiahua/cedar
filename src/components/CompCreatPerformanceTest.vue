<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-device-status="true" :prop-paneview-type="true" :prop-high-light="true" @on-row-click="onSelectDeviceClick"></comp-device-list>
            <Row type="flex" justify="center" style="margin-top: 16px;">
                <Col>
                    <Button style="margin-right: 32px; width: 90px;" @click="onBackClick">返回</Button>
                    <Button type="primary" style="width: 90px;" @click="toPageChooseJob" :disabled="disableFlag">下一步</Button>
                </Col>
            </Row>
        </div>

        <div v-if="current===1">
            <!--<Tabs type="card">-->
                <!--<TabPane label="启动时间"></TabPane>-->
            <!--</Tabs>-->
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
                <Button type="primary" style="width: 90px;" @click="backToPageChooseDevice">上一步</Button>
                <Button type="primary" style="width: 90px; margin-left:32px;" @click="toPageFillInfo">下一步( {{selectedJob.length}} )</Button>
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
                    <FormItem>
                        <b slot="label">已选设备</b>
                        <span> {{selectedDevice.device_label}} ( {{selectedDevice.device_name}} ) </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选用例</b>
                        <span> {{selectedJob.length}} 个</span>
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
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        components: {CompJobList, CompDeviceList,CompJobDetail},
        data() {
            return {
                current: 0,
                // Page "Choose device"
                selectedDevice:{},
                // Page "Choose job"
                selectedJob: [],
                // Page "Fill info"
                tboardName: "",
                tboardRepeatTime: 1,
                showJobDetail:false,
                disableFlag:true,
                jobSelection:[],
                showLoading:false,
            }
        },
        methods: {
            onBackClick(){
                this.$emit("on-back-click")
            },
            //select Device
            onSelectDeviceClick(data, index){
                this.selectedDevice = data
                this.disableFlag = false
            },
            //next step to select job
            toPageChooseJob(){
                this.current = 1
                this.$nextTick(()=>{
                    this.$refs.jobList.refreshWithParam("&job_type=PerfJob")
                })
            },
            // back step to select Device
            backToPageChooseDevice(){
                this.current = 0
                this.disableFlag = true;
                this.selectedJob = []
            },
            // next step to create Tboard
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.jobSelection = this.$refs.jobList.getThisSelection();
                if(this.selectedJob.length>0){
                    this.current = 2
                }else {
                    this.$Message.warning("请选择要进行测试的用例！");
                }
            },
            // select Job
            selectJob(){
                this.$refs.jobSelectedList.refreshWithData(_.cloneDeep(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection())))
                this.selectedJob = this.$refs.jobSelectedList.getData()
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
                    deviceList.push(this.selectedDevice.device_label);
                    let jobList = [];
                    this.selectedJob.forEach(job=>{
                        for (let i=0;i<job.counter;i++){
                            jobList.push(job.job_label);
                        }
                    })
                    this.showLoading = true;
                    utils._initDate();
                    let userId = sessionStorage.getItem('id');
                    this.$ajax
                        .post("api/v1/coral/insert_tboard/ ",{
                            device_label_list:deviceList,
                            job_label_list:jobList,
                            repeat_time:this.tboardRepeatTime,
                            board_name:this.tboardName,
                            owner_label:userId,
                            tboard_type:"PerfJob",
                            tboard_second_type:"TimeJob"
                        })
                        .then(response=>{
                            let str = ""
                            if(response.data.fail_cabinet){
                                response.data.fail_cabinet.forEach(item=>{
                                    str = str + item+"服务器启动任务失败；"
                                })
                            }
                            let root = this
                            if(response.data.status==="fail"){
                                this.$Modal.error({
                                    title:"启动失败！",
                                    content:str
                                })
                            }else if(response.data.status==="warning"){
                                this.$Modal.warning({
                                    title:"部分服务器启动失败！",
                                    content:str,
                                    onOk(){
                                        root.$router.push({
                                            name: "tboard-management",
                                        })
                                    }
                                })
                            }else if(response.data.status==="success"){
                                this.$Message.success("任务启动成功！")
                                this.$router.push({
                                    name: "tboard-management",
                                })
                            }
                            this.showLoading = false;
                        })
                        .catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("任务启动失败")
                            this.showLoading = false;
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