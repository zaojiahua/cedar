<template>
    <Card>
        <Row>
            <comp-filter ref="jobFilter" @on-change="onJobFilterChange"></comp-filter>
        </Row>
        <Row style="height: 50px;">
            <Col span="12">
                <Upload ref="upload" :data="uploadData" :action="uploadUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess" style="float:left;height: 31px;">
                    <Button icon="ios-cloud-upload-outline">导入用例</Button>
                </Upload>
            </Col>
            <Col span="12" style="text-align: right">
                <Button type="primary" class="job-btn" @click="exportCase">导出用例</Button>
                <Button type="error" class="job-btn" @click="delJobList">批量删除</Button>
            </Col>

        </Row>
        <Divider></Divider>
        <Row>
            <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick"></comp-job-list>
        </Row>
        <Drawer v-model="showDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail" :prop-del-job="true" @closeDrawer="closeDrawer" @delJobOne="delJobOne"></comp-job-detail>
        </Drawer>
    </Card>
</template>

<script>
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from "../components/CompJobDetail";
    import utils from "../lib/utils"
    import config from "../lib/config"

    export default {
        components:{ CompFilter,CompJobList,CompJobDetail},
        data(){
            return{
                showDetail:false,
                selectedJob:[],
                rowIndex:null,
                uploadData:{
                    requestName:"importJob"
                },
                uploadUrl:"",
            }
        },
        methods:{
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

                return conditions.join("&")
            },
            onJobFilterChange(selected){
                this.$refs.jobList.refreshWithParam("&" + this.selectedDetail(selected))
            },
            getJobList(){
                this.selectedJob = this.$refs.jobList.getSelection();
                let jobList = [];
                this.selectedJob.forEach(job=>{
                    jobList.push(job.id);
                })
                return jobList
            },
            delJobList(){
                let jobList = this.getJobList();
                let that = this;
                if(jobList.length===0){
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请选择要删除的数据！"
                    });
                }else{
                    this.$Modal.confirm({
                        title: "警告！",
                        content: "您确定要删除这些用例吗?",
                        onOk(){
                            let delUrlList = [];
                            for (let i=0;i<jobList.length;i++){
                                delUrlList.push(this.$ajax.patch("api/v1/cedar/job/"+jobList[i]+"/",{job_deleted:true}));
                                //push进去之后，会自动执行patch操作,返回promise
                            }
                            console.log(delUrlList)
                            this.$ajax.all(delUrlList)
                                .then(response=>{
                                    // 上面两个请求都完成后，才执行这个回调方法
                                    this.$Message.success("用例删除成功！")
                                    that.onJobFilterChange(that.$refs.jobFilter._jobRender())
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error("用例删除失败！")
                                })

                        }
                    });
                }
            },
            JobOnRowClick(row,index){
                this.showDetail = true;
                this.$refs.jobDetail.refresh(row.id);
                this.rowIndex = index;
            },
            closeDrawer(msg){
                this.showDetail = msg;
            },
            delJobOne(flag){
                this.$refs.jobList.deleteRow(this.rowIndex);
                this.showDetail = flag;
            },
            handleUploadError(error){
                if (config.DEBUG) console.log(error);
                this.$Message.error("文件上传失败！")
            },
            handleUploadSuccess(response){
                if(response.state==="OK"){
                    this.$Message.success("文件上传成功！")
                }else{
                    this.$Notice.error({
                        title:"文件上传失败",
                        desc:"未使用正确的压缩包文件,请检查后重试！"
                    })
                    setTimeout(hander=>{
                        this.$refs.upload.clearFiles();
                    },500)
                }
            },
            exportCase(){
                let jobList = this.getJobList();
                let that = this;
                if(jobList.length===0){
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请选择要导出的用例！"
                    });
                }else{
                    this.$Modal.confirm({
                        title: "提示",
                        content: "您确定要导出这些用例吗?",
                        onOk(){
                            this.$ajax
                                .post(that.uploadUrl,{
                                    requestName: "exportJob",
                                    jobIdList: jobList
                                })
                                .then(response=>{
                                    if(response.data.file){
                                        window.location.href=response.data.file;
                                    }else {
                                        this.$Message.error("导出用例失败!")
                                    }
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error("导出用例失败!")
                                })
                        }
                    });
                }
            }
        },
        created(){
            this.uploadUrl = utils.getCoralUrl(config.JOBSVC_PORT);
        }
    }
</script>

<style scoped>
    .job-btn{
        margin-right: 15px;
    }
    .ivu-upload .ivu-btn{
        height: 33px;
    }
</style>