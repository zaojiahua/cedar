<template>
    <div>
        <Card>
            <p class="user-head">
                <Button icon="md-add" style="margin-right: 20px" type="primary" @click="addUser">{{$t('userManagement.add')}}</Button>
                <!--<Button icon="ios-trash-outline" type="error" @click="delUserList">批量删除</Button>-->
            </p>
            <Table ref="table" stripe :columns="userColumns" :data="userData"></Table>
            <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange"
                  style="margin-top:20px;text-align: center "/>
        </Card>
        <Drawer v-model="showUserDetail" :draggable="true" width="50" :title="$t('userManagement.info')">
            <comp-user-detail :propStatus="componentStatus"  :prop-edit="isEdit" ref="userDetail" @onCancelClick="closeDrawer" @afterSendRequest="afterSendRequest"></comp-user-detail>
        </Drawer>
    </div>
</template>

<script>
    import CompUserDetail from "../components/CompUserDetail"
    import config from "../lib/config"
    import utils from "../lib/utils";

    export default {
        name: "UserManagement",
        components:{ CompUserDetail },
        data(){
            return {
                userColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title:this.$t('userManagement.userColumns.username'),
                        key:"username"
                    },
                    {
                        title:this.$t('userManagement.userColumns.firstname'),
                        key:"firstname"
                    },
                    {
                        title:this.$t('userManagement.userColumns.role'),
                        key:"role"
                    },
                    {
                        title:this.$t('userManagement.userColumns.job_amount'),
                        key:"job_amount",
                        maxWidth:120
                    },
                    {
                        title:this.$t('userManagement.userColumns.job_contribution'),
                        key:"job_contribution",
                        maxWidth:160
                    },
                    {
                        title:this.$t('userManagement.userColumns.action'),
                        key:"action",
                        // width:150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showUserInfo(params.index);
                                        }
                                    }
                                }, this.$t('userManagement.userColumns.btn_1')),
                                h('Button', {
                                    props: {
                                        type:  params.row.action ? 'error' : "default",
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.onFrozenAccount(params.row)
                                        }
                                    }
                                }, params.row.action ? this.$t('userManagement.userColumns.btn_2') : this.$t('userManagement.userColumns.btn_3'))
                            ]);
                        }
                    }
                ],
                userData:[],
                showUserDetail:false,
                componentStatus:false,
                isEdit:false,
                currentPage:1,
                dataTotal:0,
                pageSize:config.DEFAULT_PAGE_SIZE,
                offset:0,
            }
        },
        methods:{
            closeDrawer(msg){
                this.showUserDetail = msg;
            },
            showUserInfo(index){
                this.showUserDetail = true;
                this.componentStatus = true;
                this.isEdit = true;
                this.$refs.userDetail.showUserInfoBtn(this.userData[index]);
            },
            addUser(){
                this.showUserDetail = true;
                this.componentStatus = false;
                this.isEdit = false;
                this.$refs.userDetail.addUserBtn();
            },
            removeUserOne (index) {
                this.$Loading.start();
                this.$ajax
                    .delete("api/v1/cedar/reefuser/"+ this.userData[index].id +"/")
                    .then(response => {
                        this.showModal = false;
                        this.userData.splice(index, 1);
                        this.$Message.success(this.$t('public.delSuccess'));
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        }
                        else {
                            errorMsg = error.toString()
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error()
                    })
            },
            afterSendRequest(flag){
                this.showUserDetail = flag;
                this.getUserData();
            },
            getUserData(){
                this.$Loading.start();
                this.$ajax
                    .get('api/v1/cedar/reefuser/?fields=id,username,last_name,groups,groups.name,job_contribution,job_amount,is_active,is_superuser&ordering=username' +
                            '&limit=' + this.pageSize +
                            '&offset=' + this.offset )
                    .then(response => {
                        this.dataTotal = parseInt(response.headers["total-count"])
                        let userList = [];
                        for (let i=0;i<response.data.reefusers.length;i++) {
                            let group=[];
                            for (let j=0;j<response.data.reefusers[i].groups.length;j++) {
                                group.push(response.data.reefusers[i].groups[j].name)
                            }
                            group = group.join(",");
                            userList.push({
                                id:response.data.reefusers[i].id,
                                username:response.data.reefusers[i].username,
                                firstname:response.data.reefusers[i].last_name,
                                job_amount:response.data.reefusers[i].job_amount,
                                job_contribution:response.data.reefusers[i].job_contribution,
                                role:group,
                                action:response.data.reefusers[i].is_active,
                                is_superuser:response.data.reefusers[i].is_superuser,
                            })
                        }
                      userList.sort((a, b)=>b.job_contribution - a.job_contribution)
                        this.userData = userList;
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = error.toString()
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error()
                    })

            },
            //  批量删除用户
            delUserList(){
                let userList = this.$refs.table.getSelection();
                let root = this;
                if(userList.length>0){
                    this.$Modal.confirm({
                        title: root.$t('public.modal_warn'),
                        content: root.$t('userManagement.modalContent'),
                        onOk(){
                            let userIds = [];
                            userList.forEach(info=>{
                                userIds.push(info.id)
                            })
                            let ajaxObj = [];
                            for (let i=0;i<userIds.length;i++){
                                ajaxObj.push(root.$ajax.delete("api/v1/cedar/reefuser/"+ userIds[i] +"/"));
                            }
                            root.$ajax.all(ajaxObj)
                                .then(response=>{
                                    this.$Message.success(root.$t('public.delSuccess'))
                                    root.getUserData();
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error(root.$t('public.delFail'))
                                })
                        }
                    });
                }else{
                    this.$Modal.confirm({
                        title: root.$t('public.modal_info'),
                        content: root.$t('userManagement.modalContent_2')
                    });
                }
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.getUserData()
            },
            onFrozenAccount(row){
                let _this = this
                if(row.is_superuser){
                    this.$Message.warning(this.$t('userManagement.waringTit'))
                    return
                }

                let content = this.$t('userManagement.content')
                let successMsg = this.$t('userManagement.successMsg')
                let errorMsg = this.$t('userManagement.errorMsg')
                if(!row.action){
                    content = this.$t('userManagement.content_1')
                    successMsg = this.$t('userManagement.successMsg_1')
                    errorMsg = this.$t('userManagement.errorMsg_1')
                }
                this.$Modal.confirm({
                    title:_this.$t('public.modal_info'),
                    content: content,
                    onOk(){
                        this.$ajax.patch("api/v1/cedar/reefuser/"+ row.id +"/",{
                            is_active: !row.action
                        }).then(response=>{
                            this.$Message.success(successMsg)
                            _this.onPageChange(_this.currentPage)
                        }).catch(error=>{
                            this.$Message.error({content:errorMsg + error.response.data.non_field_errors[0],duration:3})
                        })
                    }
                })
            }
        },
        created(){
            this.pageSize = utils.getPageSize();
            this.getUserData();
        }
    }
</script>

<style scoped>
    .user-head{
        margin-bottom: 16px;
    }
    .ivu-icon{
        font-size: 16px;
    }
</style>
