<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>

        <div v-if="current===0">
            <Row>
                <comp-filter ref="jobFilter"  @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row type="flex">
                <Col span="11">
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
                <Col span="11">
                    <comp-job-list style="margin-top: 48px" ref="jobSelectedList" :prop-auto-load="false" :prop-show-search="false"
                                   :prop-deletable="true" :prop-show-page="false"></comp-job-list>
                </Col>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button style="width: 90px;" @click="onBackClick">返回</Button>
                <Button type="primary" style="width: 90px; margin-left:32px;" @click="toPageFillInfo">下一步( {{selectedJob.length}} )</Button>
            </Row>
        </div>

        <div v-if="current===1">
            <Card title="填写任务讯息" dis-hover>
                <Form :label-width="80">
                    <FormItem>
                        <b slot="label">任务名称</b>
                        <Input v-model="tboardName" style="max-width: 600px;" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label">运行轮次</b>
                        <InputNumber v-model="tboardRepeatTime" :min="1" :precision="0" :disabled="true"></InputNumber>
                    </FormItem>
                    <Table border :columns="tableColumn" :data="tableData"></Table>
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
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: {CompJobList, CompFilter,CompJobDetail},
        data() {
            return {
                current: 0,
                // Page "Choose job"
                selectedJob: [],
                // Page "Fill info"
                tboardName: "",
                tboardRepeatTime: 1,
                showJobDetail:false,
                jobSelection:[],
                showLoading:false,
                tableColumn:[
                    {
                        title: "用例名称",
                        key: "job_name",
                    },
                    {
                        title: "设备名称",
                        key: "device_name",
                    },
                    {
                        title: "设备编号",
                        key: "device_label",
                    },
                ],
                tableData:[],
            }
        },
        methods: {
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
                if(this.$refs.jobList.getSelection().length>1 || this.selectedJob.length===1){
                    this.$Message.warning("只允许选择一个用例！")
                    return
                }
                this.$refs.jobSelectedList.refreshWithData(_.cloneDeep(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelection())))
                this.selectedJob = this.$refs.jobSelectedList.getData()
            },
            toPageFillInfo(){
                this.selectedJob = this.$refs.jobSelectedList.getData()
                this.jobSelection = this.$refs.jobList.getThisSelection();
                if(this.selectedJob.length>0){
                    this.$ajax.get("api/v1/cedar/get_job_prior_tboard/?jobs_id=" + this.selectedJob[0].id)
                        .then(response=>{
                            if (Object.keys(response.data).length === 0){
                                this.$Message.error({content:"该用例暂时没有找到符合条件的设备",duration:3})
                                return
                            }
                            this.current = 1
                            this.tableData = [].concat(response.data)
                        }).catch(error=>{
                            if (config.DEBUG) console.log(error)
                            this.$Message.error("设备匹配失败")
                    })
                }else {
                    this.$Message.warning("请选择要进行测试的用例！");
                }
            },
            // Page "Fill info"
            complete(){
                if(this.tboardRepeatTime===null){
                    this.$Message.warning("请输入运行轮次！")
                }else{
                    let deviceList = [];
                    this.tableData.forEach(device=>{
                        deviceList.push(device.device_label);
                    })
                    let jobList = [];
                    this.tableData.forEach(job=>{
                        jobList.push(job.job_label);
                    })
                    this.showLoading = true;
                    utils._initDate();
                    let userId = localStorage.getItem('id');
                    this.$ajax
                        .post("api/v1/coral/insert_tboard/ ",{
                            device_label_list:deviceList,
                            job_label_list:jobList,
                            repeat_time:this.tboardRepeatTime,
                            board_name:this.tboardName,
                            owner_label:userId
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
                this.current = 0
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
            },
            onBackClick(){
                this.$emit("on-back-click")
            }
        }
    }
</script>

<style scoped>

</style>