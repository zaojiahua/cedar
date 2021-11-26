<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <Modal v-model="showSelectDeviceModal" :fullscreen="true" :transfer="false" :closable="false" @on-ok="getDeviceSelection">
                <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true" :prop-device-status="true" :propCabinetType="propCabinetType"
                                  @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
            </Modal>
            <comp-device-list :prop-show-cabinet-select="false" :prop-show-select-number="false" ref="deviceList" :prop-add-mode="false" :prop-auto-load="false" :prop-filter-status="true"></comp-device-list>
            <Row type="flex" justify="center" style="margin-top: 16px;">
                <Col>
                    <Button style="margin-right: 32px; width: 90px;" @click="onBackClick">返回</Button>
                    <Button style="margin-right: 32px; width: 90px;" @click="showSelectDeviceModal=true">选择设备
                    </Button>
                    <Button type="primary" style="width: 90px;" @click="toPageChooseJob" :disabled="disableFlag">下一步( {{selectedDevice.length}} )</Button>
                </Col>
            </Row>
        </div>

        <div v-if="current===1">
            <RadioGroup v-model="groupType" type="button" style="margin-bottom: 12px;">
                <Radio :label="1">用例列表</Radio>
                <Radio :label="2">测试集列表</Radio>
            </RadioGroup>
            <div v-show="groupType===1">
                <Row>
                    <comp-filter @on-return-data="onDefaultJobList" ref="jobFilter" :prop-default-device="selectedDevice" @on-change="onJobFilterChange"></comp-filter>
                </Row>
                <Row type="flex">
                    <Col span="14">
                        <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick" :prop-show-job-type="true"></comp-job-list>
                    </Col>
                    <Col span="2">
                        <Row type="flex" justify="center" style="margin-top: 48px;">
                            <Button @click="selectJob">
                                添加
                                <Icon type="ios-arrow-forward" />
                            </Button>
                        </Row>
                    </Col>
                    <Col span="8">
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
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选设备</b>
                        <span> {{selectedDevice.length}} 台</span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选用例</b>
                        <span> {{selectedJob.length}} 个</span>
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
                    </FormItem>
                    <FormItem>
                        <b slot="label">已选设备</b>
                        <span> {{selectedDevice.length}} 台</span>
                    </FormItem>
                    <FormItem>
                    <b slot="label">已选测试集</b>
                    <span> {{selectedTestSet.length}} 个</span>
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
        <Spin size="large" fix v-if="showLoading"></Spin>
        <Modal v-model="showBeforeSelect" :closable="false" :mask-closable="false" :footer-hide="true" width="450">
            <p style="margin: 10px 0;">请选择测试柜类型：</p>
            <Select v-model="selectCabinetType" title="CabinetType">
                <Option v-for="item in cabinetTypeList" :value="item" :label="item" :key="item"></Option>
            </Select>
            <Row type="flex" justify="end" style="margin-top: 30px;">
                <Button type="text" @click="onBackClick">取消</Button>
                <Button type="primary" @click="onCabinetTypeClick">确定</Button>
            </Row>
        </Modal>

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

    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import CompTestSetSelectView from  "../components/CompTestSetSelectView"
    import CompInnerJobConnection from  "../components/CompInnerJobConnection"
    import config from "../lib/config";
    import utils from "../lib/utils";
    import main from "../main";


    export default {
        components: {CompJobList, CompDeviceList, CompFilter,CompJobDetail, CompTestSetSelectView, CompInnerJobConnection},
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
                showLoading:false,
                showBeforeSelect:true,
                selectCabinetType:"",
                cabinetTypeList:[],
                propCabinetType:"",
                groupType:1,
                selectedTestSet:[],
                selectedTestSetJobs:[],
                showJobConnectionModal:false,
                showErrorInner:false,
                errorInnerList:[],
                continueLabelList:[],
                userId:"",
                //已选定的device和job 的label集合
                deviceLabelList:[],
                jobLabelList:[],
            }
        },
        methods: {
            // Page "Choose device"
            getDeviceSelection(){
                if(this.$refs.selectDevice.getSelection().length>0){
                    this.$refs.deviceList.refresh(this.$refs.selectDevice.getSelection())
                    this.disableFlag = false;
                    this.deviceSelection = this.$refs.selectDevice.getThisSelection()

                    this.selectedDevice = this.$refs.deviceList.getData()
                }
            },
            onSelectDeviceModalRowClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            },
            toPageChooseJob(){
                this.selectedDevice = this.$refs.deviceList.getData()
                if(this.selectedDevice.length>0){
                    let ids = []
                    this.selectedDevice.forEach(item=>{
                        ids.push(item.id)
                    })
                    this.$ajax.get("api/v1/cedar/checkout_device/?devices=" + ids.join(","))
                        .then(response=>{
                            if(response.data.length===0){
                                this.current = 1
                                this.$nextTick(function () {
                                    if(this.selectedJob.length>0 ) {
                                        this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                                    }
                                })
                            }else {
                                let list = response.data.join(",")
                                this.$Modal.confirm({
                                    title: '设备校验',
                                    content: '请将设备'+ list +'添加到testbox类型的pane上或取消勾选该设备',
                                })
                            }
                        })
                        .catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error("设备校验出错")
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
                    if(key==="type"){    //key = cabinet_type时，condition=>name
                        selected[key].forEach(item=>{
                            condition.push(item.type)
                        })
                    }else {
                        selected[key].forEach(item=>{
                            condition.push(item.id)
                        })
                    }

                    // 不统一的命名额外处理
                    if(key==="job_test_area") key = "test_area"
                    else if(key==="phone_model") key = "phone_models"
                    else if(key==="reefuser") key = "author"

                    condition.forEach(item=>{
                        item = key+"__id="+item
                    })

                    let conditionStr = ""
                    if(key==="type"){
                        conditionStr = "cabinet_type__in=ReefList["+condition.join("{%,%}")+"]"
                    }else {
                        conditionStr = key+"__id__in="+"ReefList["+condition.join("{%,%}")+"]"
                    }
                    conditions.push(conditionStr)
                })

                let param = conditions.join("&")
                return param
            },
            onJobFilterChange(selected){
                this.$refs.jobList.refreshWithParam("&" + this.selectedDetail(selected))
            },
            selectJob(){
                this.$refs.jobSelectedList.refreshWithData(_.cloneDeep(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection())))
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.$refs.jobList.clearSelection()
                this.$refs.jobList.clearJobSelection()
            },
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
                    this.$ajax
                        .post("api/v1/coral/insert_tboard/ ",{
                            device_label_list:this.deviceLabelList,
                            job_label_list:this.jobLabelList,
                            repeat_time:this.tboardRepeatTime,
                            board_name:this.tboardName,
                            owner_label:this.userId
                        })
                        .then(response=>{
                            this._responseHandle(response)
                        })
                        .catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.showLoading = false;
                            if(error.response.data.custom_code==="0"){
                                if(error.response.data.error_job_name_list){
                                    this.errorInnerList =error.response.data.error_job_name_list.filter(item=>{
                                        return item.job_type==="InnerJob"
                                    })
                                    this.continueLabelList = error.response.data.correct_job_label_list
                                    this.showErrorInner = true
                                    return
                                }
                                if(error.response.data.data_info){
                                    this.$Message.error({content:error.response.data.message.fail_cabinet.join(',')+'下发任务失败。'+ error.response.data.description,duration:7})
                                }
                            }
                            this.$Message.error({content:"任务启动失败",duration:3})
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
                                _this.$refs.jobSelectedList.refreshWithData(this.selectedJob)
                            })
                        }
                    })
                }else {
                    this.current = 1
                    this.$nextTick(function () {
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
            onBackClick(){
                this.$emit("on-back-click")
            },
            getCabinetTypeList(){
                this.$ajax.get('api/v1/cedar/get_cabinet_type_info/')
                    .then(response=>{
                        this.cabinetTypeList = response.data
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"获取机柜类型失败！"+ error.response.data.message,duration:6})
                })
            },
            onCabinetTypeClick(){
                if(this.selectCabinetType===""){
                    this.$Message.warning("请选择机柜类型！")
                    return
                }
                this.propCabinetType = this.selectCabinetType
                this.showBeforeSelect = false
            },
            //继续下发剩下的用例做任务
            continueCreated(){
                this.showLoading = true;
                this.showErrorInner = false
                this.$ajax
                    .post("api/v1/coral/insert_tboard/ ",{
                        device_label_list:this.deviceLabelList,
                        job_label_list:this.continueLabelList,
                        repeat_time:this.tboardRepeatTime,
                        board_name:this.tboardName,
                        owner_label:this.userId
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
        },
        created(){
            this.getCabinetTypeList()
            this.userId = sessionStorage.getItem('id');
        }
    }
</script>

<style scoped>

</style>
