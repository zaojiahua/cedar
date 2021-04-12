<template>
    <Card>
        <Row>
            <comp-filter ref="jobFilter" @on-change="onJobFilterChange"></comp-filter>
        </Row>
        <!-- 普通用户权限  -->
        <Row style="height: 50px;"  v-if="!roles.includes('Admin')">
            <Col span="8">
                <Upload ref="upload" :action="uploadUrl" :data="userMsg" :on-error="handleUploadError" :on-success="handleUploadSuccess" style="float:left;height: 31px;">
                    <Button icon="ios-cloud-upload-outline">导入用例</Button>
                </Upload>
            </Col>
            <Col span="16" style="text-align: right">
                <Button type="primary" class="job-btn" @click="exportCase">导出用例</Button>
                <Button type="warning" class="job-btn" @click="cancelJobList">取消选择（{{jobNumbers}}）</Button>
                <Button type="error" class="job-btn" @click="delJobList">批量删除</Button>
            </Col>
        </Row>
        <!-- 超级用户权限  -->
        <Row style="height: 50px;" v-if="roles.includes('Admin')">
            <Col span="12">
                <Upload ref="upload" :action="uploadUrl" :data="userMsg" :on-error="handleUploadError" :on-success="handleUploadSuccess" style="float:left;height: 31px;">
                    <Button icon="ios-cloud-upload-outline" class="job-btn">导入用例</Button>
                </Upload>
                <Button type="primary" class="job-btn" @click="exportCase">导出用例</Button>
            </Col>
            <Col span="12" style="text-align: right">
                <Button type="warning" class="job-btn" @click="cancelJobList">取消选择（{{jobNumbers}}）</Button>
                <Dropdown trigger="click" class="job-btn">
                    <Button>
                        更多操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list" style="text-align: left">
                        <span @click="onOpenModal"><DropdownItem>变更归属账号</DropdownItem></span>
                        <span @click="delJobList"><DropdownItem>批量删除</DropdownItem></span>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>

        <Divider></Divider>
        <Row>
            <comp-job-list ref="jobList" :prop-multi-select="true" @on-row-click="JobOnRowClick" :prop-show-job-type="true" @get-job-count="getJobNumbers"></comp-job-list>
        </Row>
        <Drawer v-model="showDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail" :prop-del-job="true" @closeDrawer="closeDrawer" @delJobOne="delJobOne"></comp-job-detail>
        </Drawer>
        <Spin size="large" fix v-if="showLoading"></Spin>

        <Modal v-model="showUserModal" :closable="false" :footer-hide="true" :mask-closable="false" width="550">
            <Card>
                <p style="text-align: center;font-size: 18px;margin-bottom: 30px;"><b>请选择目标账号</b></p>
                <div class="scroll-modal">
                    <Row v-for="(item,index) in userList" style="margin-bottom: 16px;">
                        <p v-model="item.username" class="p-c" :class="{ active: isActive===index }" @click="isActive=index;targetUserId = item.id">{{ item.username }}</p>
                    </Row>
                </div>

                <p style="text-align: center;margin-top: 30px;">
                    <Button style="margin-right: 30px;width: 100px"  @click="showUserModal=false">取消</Button>
                    <Button style="width: 100px" type="primary" @click="onChangeOwner">确认</Button>
                </p>
            </Card>
        </Modal>
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
                baseUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT,
                showDetail:false,
                selectedJob:[],
                rowIndex:null,
                uploadUrl:"",
                jobNumbers:0,
                userMsg:{ user_id: parseInt(sessionStorage.getItem("id"))},
                roles:"",
                userId:null,
                showUserModal:false,
                userList:[],
                isActive:null,
                targetUserId:null,
                showLoading:false,
            }
        },
        methods:{
            //获取当前选择的job的数量
            getJobNumbers(count){
                this.jobNumbers = count
            },
            //取消全选
            cancelJobList(){
                this.$refs.jobList.resetJobList()
            },
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
                            this.$ajax.post("api/v1/cedar/job_deleted/", { job_ids:jobList } )
                                .then(response=>{
                                    this.$Message.success("用例删除成功！")
                                    that.onJobFilterChange(that.$refs.jobFilter._jobRender())
                                })
                                .catch(error=>{
                                    let errorMsg = ""
                                    if (config.DEBUG) console.log(error)
                                    if(error.response.data.custom_code==="203001"){
                                        errorMsg = error.response.data.description.join(",") + "job不存在"
                                    }else if (error.response.data.custom_code === "203002") {
                                        errorMsg = error.response.data.description.join(",") + "关联了其他用例，无法完成删除操作"
                                    }
                                    this.$Message.error({content:errorMsg,duration:8})
                                    that.onJobFilterChange(that.$refs.jobFilter._jobRender())
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
            handleUploadError( error, file){
                if (config.DEBUG) console.log(error);
                this.$Message.error({content:"文件上传失败! " + file.error,duration: 6})
            },
            handleUploadSuccess(response, file, fileList){
                this.$Message.success("文件上传成功！")
                setTimeout(function (){
                    location.reload()
                },1000)
            },
            exportCase(){
                let root = this;
                let jobList = this.getJobList();
                let userId = sessionStorage.getItem('id')
                if(jobList.length===0){
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请选择要导出的用例！"
                    });
                }else{
                    this.$Modal.confirm({
                        title: "提示",
                        content: "您确定要导出这些用例吗?<p>普通用户只能导出自己的用例，管理员可以导出全部用例。</p>",
                        onOk(){
                            root.showLoading = true
                            this.$ajax
                                .post("api/v1/cedar/job_export/",{
                                    job_ids: jobList,
                                    user_id:parseInt(userId)
                                })
                                .then(response=>{
                                    if(response.data.success){
                                        window.location.href=root.baseUrl + response.data.success;
                                        root.cancelJobList()
                                        this.$Message.success({content:"正在导出用例...",duration: 3})
                                        root.showLoading = false
                                    }else {
                                        this.$Message.error("导出用例失败!")
                                        root.showLoading = false
                                    }
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error({content:"导出用例失败! " + error.response.data.error,duration: 6})
                                    root.showLoading = false
                                })
                        }
                    });
                }
            },
            onOpenModal(){
                this.isActive = null;
                this.targetUserId = null;
                let jobList = this.getJobList();
                if(jobList.length===0){
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请先选择用例！"
                    });
                    return
                }
                this.showUserModal = true;
                this.getUserList()
            },
            getUserList(){
                this.$ajax
                    .get('api/v1/cedar/reefuser/?fields=id,username&ordering=username&is_active=True')
                    .then(response => {
                        this.userList = response.data.reefusers
                    })
                    .catch(error => {
                        this.$Message.error("获取目标用户失败")
                    })
            },
            onChangeOwner(){
                if(this.targetUserId===null){
                    this.$Message.warning({content:'请先选择用例归属目标！',duration:3})
                    return
                }
                let jobList = this.getJobList();
                this.$ajax .post("api/v1/cedar/job_change_owner/",{
                        operate_user_id: this.userId,
                        transfer_user_id: this.targetUserId,
                        job_ids: jobList
                    }).then(response=>{
                        this.$Message.success({content:'用例变更归属成功',duration:3})
                        this.showUserModal = false
                        setTimeout(function (){
                            location.reload()
                        },500)
                    }).catch(error=>{
                        this.$Message.error({content:"变更归属账号失败！ " + error.response.data.error,duration:5 })
                })
            }
        },
        created(){
            this.uploadUrl =this.baseUrl + "/api/v1/cedar/job_import/";

            this.userId = parseInt(sessionStorage.getItem('id'));
            this.$ajax
                .get("api/v1/cedar/reefuser/?fields=id,username," +
                    "groups,groups.id,groups.name" +
                    "&id="+ this.userId)
                .then(response=>{
                    let groups = [];
                    for(let i=0;i<response.data.reefusers[0].groups.length;i++){
                        groups.push(response.data.reefusers[0].groups[i].name)
                    }
                    this.roles = groups.join(",");
                }).catch(error=>{
                    this.$Message.error("获取用户权限信息失败")
            })
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
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #ccc dotted 1px;
        cursor: pointer!important;
    }
    .p-c{
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 14px;
        border-radius: 4px;
        border: #ccc dotted 1px;
        cursor: pointer;
    }
    .active{
        background-color: #f2f2f2;
    }
    .scroll-modal{
        max-height: 370px;
        overflow-y: auto;
    }
</style>