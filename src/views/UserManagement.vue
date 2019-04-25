<template>
    <div>
        <Card>
            <p class="user-head">
                <Button icon="md-add" style="margin-right: 20px" type="primary" @click="addUser">添加用户</Button>
                <Button icon="ios-trash-outline" type="error" @click="delUserList">批量删除</Button>
            </p>
            <Table ref="table" stripe :columns="userColumns" :data="userData"></Table>
        </Card>
        <Drawer v-model="showUserDetail" :draggable="true" width="50" title="用户信息">
            <Card>
                <Form  v-model="userInfo" :label-width="80">
                    <FormItem label="登录名：">
                        <Input v-model="userInfo.username" placeholder="Enter username..."></Input>
                    </FormItem>
                    <FormItem label="真实姓名：">
                        <Input v-model="userInfo.firstname" placeholder="Enter your name..."></Input>
                    </FormItem>
                    <FormItem label="密码：" v-if="addShow">
                        <Input v-model="userInfo.password" type="password" placeholder="Enter password..."></Input>
                    </FormItem>
                    <FormItem label="角色：">
                        <CheckboxGroup v-model="userInfo.role">
                            <Checkbox v-for="item in groupList" :label="item" :key="item"></Checkbox><br/>
                        </CheckboxGroup>
                    </FormItem>
                </Form>
                <div  class="drawer-footer">
                    <Button v-if="updatePwd" style="float: left" @click="addShow=true;userInfo.password=null">修改密码</Button>
                    <Button type="primary" style="margin-right: 20px" @click="update">确认</Button>
                    <Button  @click="showUserDetail = false">取消</Button>
                </div>
            </Card>
        </Drawer>
        <Modal v-model="showModal" :closable="false" :mask-closable="false"  width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <p style="text-align: center;font-size: 16px;">你确定要删除该用户吗？</p>
            <p slot="footer" style="text-align: center">
                <Button type="primary" style="margin-right: 100px;" @click="remove(delObj)">确定</Button>
                <Button @click="showModal = false">取消</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
    import config from "../lib/config"
    export default {
        name: "UserManagement",
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
                                            this.show(params.index);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showModal = true;
                                            this.delObj = params.index;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                userData:[],
                showUserDetail:false,
                addShow:false,
                updatePwd:false,
                showModal:false,
                delObj:'',
                groupList:[],
                userInfo:{
                    id:null,
                    username:"",
                    firstname:"",
                    role:[],
                    password:null
                }
            }
        },
        methods:{
            show(index){
                this.showUserDetail = true;
                this.addShow=false;
                this.updatePwd=true;
                this.userInfo.username  = this.userData[index].username;
                this.userInfo.firstname  = this.userData[index].firstname;
                this.userInfo.id  = this.userData[index].id;
                if(this.userData[index].role){
                    this.userInfo.role  = this.userData[index].role.split(",");
                }else {
                    this.userInfo.role  = [];
                }
            },
            remove (index) {
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
            update (){
                let AjaxParamObj={};
                if(this.addShow===true){
                    AjaxParamObj = {
                        username:this.userInfo.username,
                        last_name:this.userInfo.firstname,
                        groups:this.userInfo.role,
                        password:this.userInfo.password
                    }
                }else {
                    AjaxParamObj = {
                        username:this.userInfo.username,
                        last_name:this.userInfo.firstname,
                        groups:this.userInfo.role
                    }
                }
                if(this.updatePwd===true){
                    if(this.userInfo.username===""){
                        this.$Message.warning("请输入登录名！");
                    }else if(this.addShow===true&&this.userInfo.password===null){
                        this.$Message.warning("请输入密码！");
                    } else {
                        this.$Loading.start();
                        this.$ajax
                            .patch("api/v1/cedar/reefuser/"+ this.userInfo.id +"/",AjaxParamObj)
                            .then(response => {
                                this.showUserDetail = false;
                                this.$Message.success('修改成功');
                                this.getUserData();
                                this.$Loading.finish()
                            })
                            .catch(error => {
                                let errorMsg = "";
                                if (error.response.status >= 500) {
                                    errorMsg = "服务器错误！"
                                }else if(error.response.status=== 400){
                                    errorMsg = "该用户名已存在，请重新输入！"
                                } else {
                                    errorMsg = error.toString()
                                }
                                this.$Message.error(errorMsg)
                                this.$Loading.error()
                            })
                    }

                }else {
                    if(this.userInfo.username===""){
                        this.$Message.warning("请输入登录名！");
                    }else if(this.userInfo.password===null){
                        this.$Message.warning("请输入密码！");
                    }else {
                        this.$Loading.start();
                        this.$ajax
                            .post("api/v1/cedar/reefuser/",AjaxParamObj)
                            .then(response => {
                                this.showUserDetail = false;
                                this.$Message.success('添加成功');
                                this.getUserData();
                                this.$Loading.finish()
                            })
                            .catch(error => {
                                let errorMsg = "";
                                if (error.response.status >= 500) {
                                    errorMsg = "服务器错误！"
                                }else if(error.response.status=== 400){
                                    errorMsg = "该用户名已存在，请重新输入！"
                                } else {
                                    errorMsg = error.toString()
                                }
                                this.$Message.error(errorMsg)
                                this.$Loading.error()
                            })
                    }
                }
            },
            addUser(){
                this.updatePwd=false;
                this.addShow=true;
                this.showUserDetail = true;
                this.userInfo.username  = "";
                this.userInfo.firstname  = "";
                this.userInfo.password  = null;
                this.userInfo.role  = [];
            },
            getUserData(){
                this.$Loading.start();
                this.$ajax
                    .get('api/v1/cedar/reefuser/?fields=id,username,last_name,groups,groups.name')
                    .then(response => {
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
                                role:group
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
            getGroup(){
                this.$Loading.start()
                this.$ajax
                    .get("api/v1/cedar/group/?fields=name")
                    .then(response=>{
                        let groupObj = [];
                        for (let i=0;i<response.data.groups.length;i++){
                            groupObj.push(response.data.groups[i].name)
                        }
                        this.groupList = groupObj;
                        this.$Loading.finish();
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error);
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = error.toString()
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error();
                    })

            },
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

            }
        },
        created(){
            this.getUserData();
            this.getGroup();
        }
    }
</script>

<style>
    .user-head{
        margin-bottom: 16px;
    }
    .drawer-footer{
        text-align: right;
    }
    .ivu-icon{
        font-size: 16px;
    }
</style>