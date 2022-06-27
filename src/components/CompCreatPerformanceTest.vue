<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true" :prop-device-status="true" :prop-paneview-type="true"
                              :prop-perf-cabinet="true" @on-row-click="onSelectDeviceClick" @get-selection="getDeviceSelection"></comp-device-list>
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
            <RadioGroup v-model="groupType" type="button" style="margin-bottom: 12px;">
                <Radio :label="1">用例列表</Radio>
                <Radio :label="2">测试集列表</Radio>
            </RadioGroup>
            <div v-show="groupType===1">
                <Row type="flex">
                    <Col span="12">
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
                    <Col span="10">
                        <comp-job-list style="margin-top: 48px" ref="jobSelectedList" :prop-auto-load="false" :prop-show-search="false"
                                       :prop-show-counter="true" :prop-deletable="true" :prop-show-page="false"></comp-job-list>
                        <Row type="flex" justify="center" style="margin-top: 32px;">
                            <Button type="primary" style="width: 90px;" @click="backToPageChooseDevice">上一步</Button>
                            <Button type="primary" style="width: 90px; margin-left:32px;" @click="toPageFillInfo">下一步( {{selectedJob.length}} )</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div v-show="groupType===2">
                <comp-test-set-select-view @on-back="backToPageChooseDevice" @on-next-step="toPageFillInfoNext"></comp-test-set-select-view>
            </div>
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
                        <span style="margin: 0 10px 0 20px">用例顺序随机</span><i-switch v-model="isRandom"/>
                    </FormItem>
                    <FormItem>
                        <b slot="label">任务配置</b>
                        <span> 设备 {{selectedDevice.length}} 台；用例 {{selectedJob.length}} 个 </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选设备</b>
                        <ButtonGroup>
                            <Button v-for="device in selectedDevice">
                                {{device.device_name}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="backToPageChooseJob">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="complete(false)">启动任务</Button>
            </Row>
        </div>
        <div v-if="current===3">
            <Card title="填写任务讯息" dis-hover>
                <Form :label-width="90">
                    <FormItem>
                        <b slot="label">任务名称</b>
                        <Input v-model="tboardName" style="max-width: 600px;" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">运行轮次</b>
                        <InputNumber v-model="tboardRepeatTime" :min="1" :precision="0"></InputNumber>
                        <span style="margin: 0 10px 0 20px">用例顺序随机</span><i-switch v-model="isRandom"/>
                    </FormItem>
                    <FormItem>
                        <b slot="label">任务配置</b>
                        <span> 设备 {{selectedDevice.length}} 台；测试集 {{selectedTestSet.length}} 个；用例 {{selectedTestSetJobs.length}} 个 </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选设备</b>
                        <ButtonGroup>
                            <Button v-for="device in selectedDevice">
                                {{device.device_name}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                    <FormItem>
                        <b slot="label">测 试 集</b>
                        <ButtonGroup>
                            <Button v-for="item in selectedTestSet">
                                {{item.title}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="backToPageChooseJob">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="complete(true)">启动任务</Button>
            </Row>
        </div>

        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail"  @closeDrawer="closeDrawer"></comp-job-detail>
        </Drawer>
        <Modal v-model="showErrorInner" :closable="false" :mask-closable="false" :footer-hide="true" width="60">
            <Icon type="ios-help-circle" style="color: #ff9900;float: left;margin: 15px 10px 0 0;" size="24"/>
            <p style="margin: 15px 0;font-size: 16px">任务启动失败</p>
            <Row>以下用例：</Row>
            <Row style="margin: 10px 0">
                <Button v-for="item in errorInnerList" @click="getJobConnection(item.job_label,item.job_name)">{{item.job_name}}</Button>
            </Row>
            <p>缺少资源文件，请尝试重新保存用例，是否继续运行其他用例？</p>
            <Row type="flex" justify="end" style="margin-top: 30px;">
                <Button type="text" @click="showErrorInner=false">取消</Button>
                <Button type="primary" @click="continueCreated">继续</Button>
            </Row>
        </Modal>

        <Modal v-model="showJobConnectionModal" :fullscreen="true" :transfer="false" :closable="false" >
            <comp-inner-job-connection ref="innerJobConnection"></comp-inner-job-connection>
            <div slot="footer">
                <Button type="primary" @click="showJobConnectionModal = false">关闭</Button>
            </div>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import CompTestSetSelectView from  "../components/CompTestSetSelectView"
    import CompInnerJobConnection from  "../components/CompInnerJobConnection"
    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        components: {CompJobList, CompDeviceList,CompJobDetail,CompTestSetSelectView,CompInnerJobConnection},
        data() {
            return {
                current: 0,
                // Page "Choose device"
                selectedDevice:[],
                // Page "Choose job"
                selectedJob: [],
                // Page "Fill info"
                tboardName: "",
                tboardRepeatTime: 1,
                showJobDetail:false,
                disableFlag:true,
                showLoading:false,
                groupType:1,
                selectedTestSet:[],
                selectedTestSetJobs:[],
                showJobConnectionModal:false,
                showErrorInner:false,
                errorInnerList:[],
                continueLabelList:[],
                //已选定的device和job 的label集合
                deviceLabelList:[],
                jobLabelList:[],
                isRandom:false,
            }
        },
        methods: {
            onBackClick(){
                this.$emit("on-back-click")
            },
            //select Device
            onSelectDeviceClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            },
            getDeviceSelection(selection){
                this.selectedDevice = selection
                this.disableFlag = selection.length <= 0;
            },
            //next step to select job
            toPageChooseJob(){
                this.current = 1
                this.$nextTick(()=>{
                    this.$refs.jobList.refreshWithParam("&job_type=PerfJob")
                    if(this.selectedJob.length>0 ) {
                        this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                    }
                })
            },
            // back step to select Device
            backToPageChooseDevice(){
                this.current = 0
                if(this.selectedDevice.length === 0)
                    this.disableFlag = true;
                this.$nextTick(function () {
                    this.$refs.selectDevice.setSelection(this.selectedDevice)
                })
            },
            // next step to create Tboard
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobSelectedList.getData()
                if(this.selectedJob.length>0){
                    this.current = 2
                }else {
                    this.$Message.warning("请选择要进行测试的用例！");
                }
            },
            toPageFillInfoNext(jobs,selectSet){
                this.selectedTestSet = selectSet
                this.selectedTestSetJobs = jobs
                this.current = 3
            },
            // select Job
            selectJob(){
                this.$refs.jobSelectedList.refreshWithData(_.cloneDeep(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection())))
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.$refs.jobList.clearSelection()
                this.$refs.jobList.clearJobSelection()
            },
            // Page "Fill info"
            complete(flag){
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
                    this.deviceLabelList = deviceList
                    let jobList = [];
                    this.selectedJob.forEach(job=>{
                        for (let i=0;i<job.counter;i++){
                            jobList.push(job.job_label);
                        }
                    })
                    if(flag)   //测试集合并过来的用例
                        jobList = this.selectedTestSetJobs
                    this.jobLabelList = jobList
                    this.showLoading = true;
                    utils._initDate();
                    let userId = sessionStorage.getItem('id');
                    this.$ajax
                        .post("api/v1/coral/insert_tboard/ ",{
                            device_label_list:this.deviceLabelList,
                            job_label_list:this.jobLabelList,
                            repeat_time:this.tboardRepeatTime,
                            board_name:this.tboardName,
                            job_random_order:this.isRandom,
                            owner_label:userId,
                            tboard_type:"PerfJob",
                            tboard_second_type:"TimeJob"
                        })
                        .then(response=>{
                            this._responseHandle(response)
                        })
                        .catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.showLoading = false;
                            if(error.response.status===400){
                                if(error.response.data.error_job_name_list){
                                    this.errorInnerList =error.response.data.error_job_name_list.filter(item=>{
                                        return item.job_type==="InnerJob"
                                    })
                                    this.continueLabelList = error.response.data.correct_job_label_list
                                    this.showErrorInner = true
                                    return
                                }
                                if(error.response.data.data_info!==undefined){
                                    this.$Message.error({content:error.response.data.description,duration:7})
                                }
                            }else if(error.response.status>=500)
                                this.$Message.error("服务器错误")
                            else
                                this.$Message.error({content:error.response.data.description,duration:7})
                        })
                }
            },
            _responseHandle(response){
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
            },
            backToPageChooseJob(){
                if(this.current===3){
                    let _this = this
                    this.$Modal.confirm({
                        title:"提示",
                        content:"返回上一步将不会保存已选测试集，是否继续？",
                        onOk(){
                            _this.current = 1
                            _this.$nextTick(function () {
                                _this.$refs.jobList.refreshWithParam("&job_type=PerfJob")
                                _this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                            })
                        }
                    })
                }else {
                    this.current = 1
                    this.$nextTick(function () {
                        this.$refs.jobList.refreshWithParam("&job_type=PerfJob")
                        this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                    })
                }

            },
            JobOnRowClick(row){
                this.showJobDetail = true;
                this.$refs.jobDetail.refresh(row.id)
            },
            closeDrawer(flag){
                this.showJobDetail = flag;
            },
            //继续下发剩下的用例做任务
            continueCreated(){
                this.showLoading = true;
                this.showErrorInner = false
                let userId = sessionStorage.getItem('id');
                this.$ajax
                    .post("api/v1/coral/insert_tboard/ ",{
                        device_label_list:this.deviceLabelList,
                        job_label_list:this.continueLabelList,
                        repeat_time:this.tboardRepeatTime,
                        board_name:this.tboardName,
                        owner_label:userId
                    })
                    .then(response=>{
                        this._responseHandle(response)
                    }) .catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.showLoading = false
                    this.$Message.error({content:"任务启动失败",duration:3})
                })
            },
            //查看缺少资源的 innerJob 对应关联的 普通job
            getJobConnection(label,name){
                this.showJobConnectionModal = true
                this.$refs.innerJobConnection.setInnerName(name)
                this.$refs.innerJobConnection.refresh(label,this.jobLabelList)
            }
        }
    }
</script>

<style scoped>

</style>
