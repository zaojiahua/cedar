<template>
    <div>
        <Card>
            <p class="user-head">
                <Button icon="md-add" style="margin-right: 20px" type="primary" @click="addUser">添加用户</Button>
                <!--<Button icon="ios-trash-outline" type="error" @click="delUserList">批量删除</Button>-->
            </p>
            <Table ref="table" stripe :columns="userColumns" :data="userData"></Table>
            <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange"
                  style="margin-top:20px;text-align: center "/>
        </Card>
        <Drawer v-model="showUserDetail" :draggable="true" width="50" title="用户信息">
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
                        title:"用户名",
                        key:"username"
                    },
                    {
                        title:"真实姓名",
                        key:"firstname"
                    },
                    {
                        title:"角色",
                        key:"role"
                    },
                    {
                        title:"操作",
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
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type:  params.row.action ? 'error' : "normal",
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.onFrozenAccount(params.row)
                                        }
                                    }
                                }, params.row.action ? '冻结账户' : "解冻账户")
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
                        this.$Message.success('删除成功');
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
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
                    .get('api/v1/cedar/reefuser/?fields=id,username,last_name,groups,groups.name,is_active,is_superuser' +
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
                                role:group,
                                action:response.data.reefusers[i].is_active,
                                is_superuser:response.data.reefusers[i].is_superuser,
                            })
                        }
                        this.userData = userList;
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
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
                if(userList.length>0){
                    let root = this;
                    this.$Modal.confirm({
                        title: "警告！",
                        content: "您确定要删除这些数据吗?",
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
                                    this.$Message.success("数据删除成功！")
                                    root.getUserData();
                                })
                                .catch(error=>{
                                    if (config.DEBUG) console.log(error)
                                    this.$Message.error("数据删除失败！")
                                })
                        }
                    });
                }else{
                    this.$Modal.confirm({
                        title: "提示",
                        content: "请选择要删除的数据！"
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
                    this.$Message.warning("不能对该账户进行此操作！")
                    return
                }

                let content = "您确定要冻结该账户吗?"
                let successMsg = "冻结账户成功！"
                let errorMsg = "冻结账户失败！"
                if(!row.action){
                    content = "您确定要恢复该账户吗?"
                    successMsg = "解冻账户成功！"
                    errorMsg = "解冻账户失败！"
                }
                this.$Modal.confirm({
                    title:'提示',
                    content: content,
                    onOk(){
                        this.$ajax.patch("api/v1/cedar/reefuser/"+ row.id +"/",{
                            is_active: !row.action
                        }).then(response=>{
                            this.$Message.success(successMsg)
                            _this.onPageChange(_this.currentPage)
                        }).catch(error=>{
                            this.$Message.error(errorMsg)
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