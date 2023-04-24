<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step :title="$t('createTboard.selDev')"></Step>
            <Step :title="$t('createTboard.selJob')"></Step>
            <Step :title="$t('createTboard.write')"></Step>
        </Steps>
        <div v-if="current===0">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true" :prop-device-status="true" :prop-paneview-type="true"
                              :prop-perf-cabinet="true" @on-row-click="onSelectDeviceClick" @get-selection="getDeviceSelection"></comp-device-list>
            <Row type="flex" justify="center" style="margin-top: 16px;">
                <Col>
                    <Button style="margin-right: 32px; minWidth: 90px;" @click="onBackClick">{{$t('public.btn_back')}}</Button>
                    <Button type="primary" style="minWidth: 90px;" @click="toPageChooseJob" :disabled="disableFlag">{{$t('public.btn_next')}}</Button>
                </Col>
            </Row>
        </div>

        <div v-if="current===1">
            <!--<Tabs type="card">-->
                <!--<TabPane label="启动时间"></TabPane>-->
            <!--</Tabs>-->
            <RadioGroup v-model="groupType" type="button" style="margin-bottom: 12px;">
                <Radio :label="1">{{$t('functionalTest.list_1')}}</Radio>
                <Radio :label="2">{{$t('functionalTest.list_2')}}</Radio>
            </RadioGroup>
            <div v-show="groupType===1">
                <Row type="flex">
                    <Col span="12">
                        <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick" :prop-accept-param="true"></comp-job-list>
                    </Col>
                    <Col span="2">
                        <Row type="flex" justify="center" style="margin-top: 48px;">
                            <Button @click="selectJob">
                                {{$t('public.btn_add')}}
                                <Icon type="ios-arrow-forward" />
                            </Button>
                        </Row>
                    </Col>
                    <Col span="10">
                        <comp-job-list style="margin-top: 48px" ref="jobSelectedList" :prop-auto-load="false" :prop-show-search="false"
                                       :prop-show-counter="true" :prop-deletable="true" :prop-show-page="false"></comp-job-list>
                        <Row type="flex" justify="center" style="margin-top: 32px;">
                            <Button type="primary" style="minWidth: 90px;" @click="backToPageChooseDevice">{{$t('public.btn_prev')}}</Button>
                            <Button type="primary" style="minWidth: 90px; margin-left:32px;" @click="toPageFillInfo">{{$t('public.btn_next')}}( {{selectedJob.length}} )</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div v-show="groupType===2">
                <comp-test-set-select-view @on-back="backToPageChooseDevice" @on-next-step="toPageFillInfoNext"></comp-test-set-select-view>
            </div>
        </div>

        <div v-if="current===2">
            <Card :title="$t('functionalTest.cardTit')" dis-hover>
                <Form :label-width="120">
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.tboardName')}}</b>
                        <Input v-model="tboardName" style="max-width: 600px;" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.tboardRepeatTime')}}</b>
                        <InputNumber v-model="tboardRepeatTime" :min="1" :precision="0"></InputNumber>
                        <span style="margin: 0 10px 0 20px">{{$t('functionalTest.random')}}</span><i-switch v-model="isRandom"/>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.config')}}</b>
                        <span> {{$t('functionalTest.config_1')}}{{selectedDevice.length}}{{$t('functionalTest.config_4')}}{{selectedJob.length}}{{$t('functionalTest.config_5')}} </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.selDev')}}</b>
                        <ButtonGroup>
                            <Button v-for="device in selectedDevice" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                                {{device.device_name}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="minWidth: 80px;" @click="backToPageChooseJob">{{$t('public.btn_prev')}}</Button>
                <Button type="primary" style="minWidth: 80px; margin-left:32px;" @click="complete(false)">{{$t('functionalTest.complete')}}</Button>
            </Row>
        </div>
        <div v-if="current===3">
            <Card :title="$t('functionalTest.cardTit')" dis-hover>
                <Form :label-width="120">
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.tboardName')}}</b>
                        <Input v-model="tboardName" style="max-width: 600px;" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.tboardRepeatTime')}}</b>
                        <InputNumber v-model="tboardRepeatTime" :min="1" :precision="0"></InputNumber>
                        <span style="margin: 0 10px 0 20px">{{$t('functionalTest.random')}}</span><i-switch v-model="isRandom"/>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.config')}}</b>
                        <span> {{$t('functionalTest.config_1')}}{{selectedDevice.length}}{{$t('functionalTest.config_2')}}{{selectedTestSet.length}}{{$t('functionalTest.config_3')}}{{selectedTestSetJobs.length}}{{$t('functionalTest.config_5')}} </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.selDev')}}</b>
                        <ButtonGroup>
                            <Button v-for="device in selectedDevice" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(device.id)">
                                {{device.device_name}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.set')}}</b>
                        <ButtonGroup>
                            <Button v-for="item in selectedTestSet">
                                {{item.title}}
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="minWidth: 80px;" @click="backToPageChooseJob">{{$t('public.btn_prev')}}</Button>
                <Button type="primary" style="minWidth: 80px; margin-left:32px;" @click="complete(true)">{{$t('functionalTest.complete')}}</Button>
            </Row>
        </div>

        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail"  @closeDrawer="closeDrawer"></comp-job-detail>
        </Drawer>
        <Modal v-model="showErrorInner" :closable="false" :mask-closable="false" :footer-hide="true" width="60">
            <Icon type="ios-help-circle" style="color: #ff9900;float: left;margin: 15px 10px 0 0;" size="24"/>
            <p style="margin: 15px 0;font-size: 16px">{{$t('functionalTest.runError')}}</p>
            <Row>{{$t('functionalTest.errTit')}}：</Row>
            <Row style="margin: 10px 0">
                <Button v-for="item in errorInnerList" @click="getJobConnection(item.job_label,item.job_name)">{{item.job_name}}</Button>
            </Row>
            <p>{{$t('functionalTest.errTit_2')}}</p>
            <Row type="flex" justify="end" style="margin-top: 30px;">
                <Button type="text" @click="showErrorInner=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="continueCreated">{{$t('functionalTest.continue')}}</Button>
            </Row>
        </Modal>

        <Modal v-model="showJobConnectionModal" :fullscreen="true" :transfer="false" :closable="false" >
            <comp-inner-job-connection ref="innerJobConnection"></comp-inner-job-connection>
            <div slot="footer">
                <Button type="primary" @click="showJobConnectionModal = false">{{$t('public.btn_close')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompJobList from "../components/CompJobList";
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompJobDetail from  "../components/CompJobDetail"
    import CompTestSetSelectView from  "../components/CompTestSetSelectView"
    import CompInnerJobConnection from  "../components/CompInnerJobConnection"
    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        components: {CompJobList, CompDeviceList,CompJobDetail,CompTestSetSelectView,CompInnerJobConnection,CompDeviceDetail},
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
                showDeviceDetail:false,
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
                    this.$Message.warning(this.$t('functionalTest.selTit'));
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
                    this.$Message.warning(this.$t('functionalTest.enterNum'))
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
                                this.$Message.error(this.$t('public.error_500'))
                            else
                                this.$Message.error({content:error.response.data.description,duration:7})
                        })
                }
            },
            _responseHandle(response){
                let str = ""
                if(response.data.fail_cabinet){
                    response.data.fail_cabinet.forEach(item=>{
                        str = str + item+this.$t('functionalTest.err_1')
                    })
                }
                let root = this
                if(response.data.status==="fail"){
                    this.$Modal.error({
                        title:this.$t('functionalTest.err_2'),
                        content:str
                    })
                }else if(response.data.status==="warning"){
                    this.$Modal.warning({
                        title:this.$t('functionalTest.err_3'),
                        content:str,
                        onOk(){
                            root.$router.push({
                                name: "perf-data-management",
                            })
                        }
                    })
                }else if(response.data.status==="success"){
                    this.$Message.success(this.$t('functionalTest.success'))
                    this.$router.push({
                        name: "perf-data-management",
                    })
                }
                this.showLoading = false;
            },
            backToPageChooseJob(){
                if(this.current===3){
                    let _this = this
                    this.$Modal.confirm({
                        title:this.$t('public.modal_info'),
                        content:this.$t('functionalTest.modalContent'),
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
                    this.$Message.error({content:this.$t('functionalTest.err_5'),duration:3})
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
