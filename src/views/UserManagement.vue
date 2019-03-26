<template>
    <div>
        <Card>
            <p solt="title" class="user-head">
                <Button icon="md-add" style="margin-right: 20px" type="primary" @click="adduser">添加用户</Button>
                <Button icon="ios-trash-outline" type="error">批量删除</Button>
            </p>
            <Table stripe height="700px" :columns="UserColumns" :data="UserData"></Table>
        </Card>
        <Drawer v-model="showUserDetail" :draggable="true" width="50" title="用户信息">
            <Card>
                <Form  v-model="UserInfo" :label-width="80">
                    <FormItem label="登录名：">
                        <Input v-model="UserInfo.username" placeholder="Enter username..."></Input>
                    </FormItem>
                    <FormItem label="真实姓名：">
                        <Input v-model="UserInfo.firstname" placeholder="Enter your name..."></Input>
                    </FormItem>
                    <FormItem label="密码：" v-if="addShow">
                        <Input v-model="UserInfo.password" type="password" placeholder="Enter password..."></Input>
                    </FormItem>
                    <FormItem label="角色：">
                        <CheckboxGroup v-model="UserInfo.role">
                            <Checkbox label="Admin"></Checkbox><br/>
                            <Checkbox label="TestOperator"></Checkbox><br/>
                            <Checkbox label="DataViewer"></Checkbox><br/>
                            <Checkbox label="Manager"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </Form>
                <div  class="drawer-footer">
                    <Button v-if="updatePwd" style="float: left" @click="addShow=true">修改密码</Button>
                    <Button style="margin-right: 20px" @click="showUserDetail = false">取消</Button>
                    <Button type="primary" @click="update">确认</Button>
                </div>
            </Card>
        </Drawer>
    </div>
</template>

<script>
    export default {
        name: "UserManagement",
        data(){
            return {
                UserColumns:[
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                UserData:[],
                showUserDetail:false,
                addShow:false,
                updatePwd:false,
                UserInfo:{
                    id:"",
                    username:"",
                    firstname:"",
                    role:["Manager"],
                    password:""
                }
            }
        },
        methods:{
            show(index){
                this.showUserDetail = true;
                this.addShow=false;
                this.updatePwd=true;
                this.UserInfo.username  = this.UserData[index].username;
                this.UserInfo.firstname  = this.UserData[index].firstname;
                this.UserInfo.id  = this.UserData[index].id;
                this.UserInfo.role  = this.UserData[index].role.split(",");
            },
            remove (index) {
                this.$Loading.start();
                this.$ajax
                    .delete("api/v1/cedar/reefuser/"+ this.UserData[index].id +"/")
                    .then(response => {
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

                this.UserData.splice(index, 1);
            },
            update (){
                this.showUserDetail = false;
                let AjaxParamObj={};
                if(this.addShow===true){
                    AjaxParamObj = {
                        username:this.UserInfo.username,
                        last_name:this.UserInfo.firstname,
                        groups:this.UserInfo.role,
                        password:this.UserInfo.password
                    }
                }else {
                    AjaxParamObj = {
                        username:this.UserInfo.username,
                        last_name:this.UserInfo.firstname,
                        groups:this.UserInfo.role
                    }
                }
                this.$Loading.start();
                if(this.updatePwd===true){
                    this.$ajax
                        .patch("api/v1/cedar/reefuser/"+ this.UserInfo.id +"/",AjaxParamObj)
                        .then(response => {
                            this.getUserData();
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
                }else {
                    this.$ajax
                        .post("api/v1/cedar/reefuser/",AjaxParamObj)
                        .then(response => {
                            this.getUserData();
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
                }
            },
            adduser(){
                this.updatePwd=false;
                this.addShow=true;
                this.showUserDetail = true;
                this.UserInfo.username  = "";
                this.UserInfo.firstname  = "";
                this.UserInfo.password  = "";
                this.UserInfo.role  = [];
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
                        this.UserData = userList;
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
            }
        },
        created(){
            this.getUserData();
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