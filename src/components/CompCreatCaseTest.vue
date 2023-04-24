<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step :title="$t('createTboard.selDev')"></Step>
            <Step :title="$t('createTboard.selJob')"></Step>
            <Step :title="$t('createTboard.write')"></Step>
        </Steps>

        <div v-if="current===0">
            <Row>
                <comp-filter ref="jobFilter"  @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row>
                <comp-job-list ref="jobList" :prop-multi-select="true" :prop-auto-load="true" @on-row-click="JobOnRowClick" :prop-show-job-type="true" @get-job-count="getJobNumbers" :prop-accept-param="true"></comp-job-list>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button style="minWidth: 90px;" @click="onBackClick">{{$t('public.btn_back')}}</Button>
                <Button type="primary" style="minWidth: 90px; margin-left:32px;" @click="toPageFillInfo">{{$t('public.btn_next')}}( {{jobCount}} )</Button>
            </Row>
        </div>

        <div v-if="current===1">
            <Row style="margin-bottom: 20px"><b>{{$t('functionalTest.paired')}}：</b></Row>
            <Table ref="table" border :columns="tableColumn" :data="tableData" @on-cell-click="jobOnCellClick"></Table>
            <div v-show="failList.length>0">
                <Row style="margin: 20px 0"><b>{{$t('functionalTest.paired_1')}}：</b></Row>
                <Button style="margin: 0 5px 5px 0" v-for="(fail,index) in failList" :key="index" @click="onOpenJobDetail(fail.job_id)">{{ fail.job_name }}</Button>
            </div>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button style="minWidth: 90px;" @click="backToPageChooseJob">{{$t('public.btn_prev')}}</Button>
                <Button type="primary" style="minWidth: 90px; margin-left:32px;" @click="current=2">{{$t('public.btn_next')}}</Button>
            </Row>
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
                        <!--<InputNumber v-model="tboardRepeatTime" :min="1" :precision="0" :disabled="true"></InputNumber>-->
                        <span>  1 </span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.selDev')}}</b>
                        <span> {{selectedDevice.length}} {{$t('functionalTest.pcs')}}</span>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('functionalTest.selJob')}}</b>
                        <span> {{tableData.length}} {{$t('functionalTest.config_5')}}</span>
                    </FormItem>
                </Form>
            </Card>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="minWidth: 80px;" @click="current=1">{{$t('public.btn_prev')}}</Button>
                <Button type="primary" style="minWidth: 80px; margin-left:32px;" @click="complete">{{$t('functionalTest.complete')}}</Button>
            </Row>
        </div>

        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail"  @closeDrawer="closeDrawer"></comp-job-detail>
        </Drawer>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Drawer>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Card>
</template>

<script>
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import CompDeviceDetail from  "../components/CompDeviceDetail"
    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: {CompJobList, CompFilter,CompJobDetail, CompDeviceDetail},
        data() {
            return {
                current: 0,
                // Page "Choose job"
                selectedJob: [],
                // Page "Fill info"
                selectedDevice:[],
                tboardName: "",
                tboardRepeatTime: 1,
                showJobDetail:false,
                showLoading:false,
                tableColumn:[
                    {
                        title: this.$t('functionalTest.jobName'),
                        key: "job_name",
                    },
                    {
                        title: this.$t('functionalTest.devName'),
                        key: "device_name",
                    },
                ],
                tableData:[],
                jobCount:0,
                failList:[],
                showDeviceDetail:false,
            }
        },
        methods: {
            //获取当前选择的job的数量
            getJobNumbers(number){
                this.jobCount = number
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

                    condition.forEach(item=>{  //这段代码不起作用，不需要
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
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobList.getThisSelection();
                if(this.selectedJob.length>0){
                    let ids = []
                    this.selectedJob.forEach(item=>{
                        ids.push(item.id)
                    })
                    this.$ajax.get("api/v1/cedar/get_job_prior_tboard/?jobs_id=" + ids.join(","))
                        .then(response=>{
                            if (response.data.matching_success.length === 0){
                                this.$Message.error({content:this.$t('functionalTest.noDevTit'),duration:3})
                                return
                            }
                            this.tableData = []
                            this.current = 1
                            this.failList = response.data.matching_fail
                            this.selectedDevice = []
                            response.data.matching_success.forEach(item=>{
                                this.tableData.push(
                                    {"device_id":item.device.device_id,
                                    "device_name":item.device.device_name,
                                    "device_label":item.device.device_label,
                                    "job_id":item.job.job_id,
                                    "job_name":item.job.job_name,
                                    "job_label":item.job.job_label})
                                if(this.selectedDevice.indexOf(item.device.device_label)===-1)
                                    this.selectedDevice.push(item.device.device_label)
                            })
                        }).catch(error=>{
                            if (config.DEBUG) console.log(error)
                            this.$Message.error({content:this.$t('functionalTest.devFail'),duration:3})
                    })
                }else {
                    this.$Message.warning(this.$t('functionalTest.selTit'));
                }
            },
            // Page "Fill info"
            complete(){
                let jobList = [];
                this.tableData.forEach(item=>{
                    jobList.push(item.job_label);
                })

                let obj = {}
                for(let i=0;i<this.selectedDevice.length;i++){
                    let jobs = []
                    this.tableData.forEach(item=>{
                        if(item.device_label===this.selectedDevice[i])
                            jobs.push(item.job_label)
                    })
                    obj[this.selectedDevice[i]] = jobs
                }

                this.showLoading = true;
                let userId = sessionStorage .getItem('id');
                this.$ajax
                    .post("api/v1/coral/insert_tboard/ ",{
                        device_label_list:this.selectedDevice,
                        job_label_list:jobList,
                        repeat_time:1,   //this.tboardRepeatTime,
                        board_name:this.tboardName,
                        owner_label:userId,
                        tboard_type: "PriorJob",
                        job_prior_data: obj
                    })
                    .then(response=>{
                        console.log(response)
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
                                        name: "tboard-management",
                                    })
                                }
                            })
                        }else if(response.data.status==="success"){
                            this.$Message.success(this.$t('functionalTest.success'))
                            this.$router.push({
                                name: "tboard-management",
                            })
                        }
                        this.showLoading = false;
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.showLoading = false;
                        if(error.response.data.custom_code==="0"){
                            if(error.response.data.error_job_name_list){
                                let errorList = []
                                error.response.data.error_job_name_list.forEach(item=>{
                                    errorList.push(item.job_name)
                                })
                                let _this = this
                                this.$Modal.warning({
                                    title:this.$t('functionalTest.err_5'),
                                    width:60,
                                    content:this.$t('functionalTest.jobMissing_1')+errorList.join(",") +this.$t('functionalTest.jobMissing_2')
                                })
                                return
                            }
                            if(error.response.data.data_info===''){
                                this.$Message.error({content:error.response.data.message.fail_cabinet.join(',')+ error.response.data.description,duration:10})
                                return
                            }
                        }
                        this.$Message.error({content:this.$t('functionalTest.err_5'),duration:3})
                    })
            },
            backToPageChooseJob(){
                this.current = 0
                this.$nextTick(function () {
                    this.$refs.jobList.setSelection(this.selectedJob);
                    this.$refs.jobList.setSelectionJob(this.selectedJob);
                })
            },
            onOpenJobDetail(id){
                this.showJobDetail = true
                this.$refs.jobDetail.refresh(id)
            },
            jobOnCellClick(row, column){
                if(column.key==="device_name"){
                    this.showDeviceDetail = true;
                    this.$refs.deviceDetail.refresh(row.device_id)
                }else if(column.key==="job_name"){
                    this.showJobDetail = true;
                    this.$refs.jobDetail.refresh(row.job_id)
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
            }
        }
    }
</script>

<style scoped>

</style>
