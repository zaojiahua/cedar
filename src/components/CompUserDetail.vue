<template>
    <Card>
        <Form  v-model="userInfo" :label-width="80">
            <FormItem label="登录名：">
                <Input v-model="userInfo.username" placeholder="Enter username..." @on-keyup="usernameVerify"></Input>
                <p v-show="showNameTip" style="color: red;">{{ nameTipMsg }}</p>
            </FormItem>
            <FormItem label="真实姓名：">
                <Input v-model="userInfo.firstname" placeholder="Enter your name..."></Input>
            </FormItem>
            <FormItem label="密码：" v-if="showPassword">
                <Input v-model="userInfo.password" type="password" placeholder="Enter password..." @on-keyup="passwordVerify"></Input>
                <p v-show="showPwdTip" style="color: red;">{{ pwdTipMsg }}</p>
            </FormItem>
            <FormItem label="角色：">
                <CheckboxGroup v-model="userInfo.role" @on-change="groupVerify">
                    <Checkbox v-for="item in groupList" :label="item" :key="item"></Checkbox><br/>
                </CheckboxGroup>
                <p v-show="showGroupTip" style="color: red;">{{ groupTipMsg }}</p>
            </FormItem>
        </Form>
        <div  class="drawer-footer">
            <Button v-if="propUpdatePwdBtn" style="float: left" @click="showPassword=true;userInfo.password=null">修改密码</Button>
            <Button type="primary" style="margin-right: 20px" @click="sendRequest">确认</Button>
            <Button  @click="closeDetail">取消</Button>
        </div>
    </Card>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils";

    export default {
        name:"CompUserDetail",
        props:{
            propUpdatePwdBtn:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                userInfo:{
                    id:null,
                    username:"",
                    firstname:"",
                    role:[],
                    password:null
                },
                groupList:[],
                showPassword:true,
                showNameTip:false,
                showPwdTip:false,
                showGroupTip:false,
                nameTipMsg:"",
                pwdTipMsg:"",
                groupTipMsg:"",
            }
        },
        methods:{
            addUserBtn(){
                this.showPassword=true;
                this.userInfo.username  = "";
                this.userInfo.firstname  = "";
                this.userInfo.password  = null;
                this.userInfo.role  = [];
                this.resetVerifyTip();
            },
            showUserInfoBtn(info){
                this.showPassword=false;
                this.userInfo.username  = info.username;
                this.userInfo.firstname  = info.firstname;
                this.userInfo.id  = info.id;
                if(info.role){
                    this.userInfo.role  = info.role.split(",");
                }else {
                    this.userInfo.role  = [];
                }
                this.resetVerifyTip();
            },
            closeDetail(){
                this.$emit("closeDrawer",false);
            },
            getGroup(){
                this.$Loading.start()
                this.$ajax
                    .get("api/v1/cedar/group/?fields=name")
                    .then(response=>{
                        let groupArr = [];
                        for (let i=0;i<response.data.groups.length;i++){
                            groupArr.push(response.data.groups[i].name)
                        }
                        this.groupList = groupArr;
                        this.$Loading.finish();
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error);
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "获取权限列表失败！"
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error();
                    })
            },
            sendRequest(){
                this.usernameVerify();
                if(this.showPassword) this.passwordVerify();
                this.groupVerify();
                if(this.showNameTip===true||this.showPwdTip===true||this.showGroupTip===true)
                    return;
                // get url params
                let AjaxParamObj={};
                if(this.showPassword===true){
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
                //send request
                if(this.propUpdatePwdBtn){    //update  user
                    this.$Loading.start();
                    this.$ajax
                        .patch("api/v1/cedar/reefuser/"+ this.userInfo.id +"/",AjaxParamObj)
                        .then(response => {
                            this.$Message.success('修改成功');
                            this.$Loading.finish()
                            this.$emit("afterSendRequest",false)
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

                }else{        // add new user
                    this.$Loading.start();
                    this.$ajax
                        .post("api/v1/cedar/reefuser/",AjaxParamObj)
                        .then(response => {
                            this.$Message.success('添加成功');
                            this.$Loading.finish()
                            this.$emit("afterSendRequest",false)
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
            },

            //表单验证
            usernameVerify(){
                if(this.userInfo.username.trim()===""){
                    this.showNameTip = true;
                    this.nameTipMsg = "登录名不能为空！"
                }else if (this.userInfo.username.trim().length<5||this.userInfo.username.trim().length>30) {
                    this.showNameTip = true;
                    this.nameTipMsg = "登录名的长度应在5-30个字符之内！"
                } else if (!/^[a-zA-Z0-9_]+$/.test(this.userInfo.username)) {
                    this.showNameTip = true;
                    this.nameTipMsg = '请输入字母数字下划线，不能输入特殊字符！'
                } else {
                    this.showNameTip = false;
                    this.nameTipMsg = "";
                }
            },
            passwordVerify(){
                if(!this.userInfo.password){
                    this.showPwdTip = true;
                    this.pwdTipMsg = "密码不能为空！"
                }else if (this.userInfo.password.length<6||this.userInfo.password.length>30) {
                    this.showPwdTip = true;
                    this.pwdTipMsg = "密码长度应在6-30个字符之内！"
                }else {
                    this.showPwdTip = false;
                    this.pwdTipMsg = "";
                }
            },
            groupVerify(){
                if(this.userInfo.role.length<1){
                    this.showGroupTip = true;
                    this.groupTipMsg = "请选择该用户拥有的权限（至少选择一项）！";
                }else {
                    this.showGroupTip = false;
                    this.groupTipMsg = "";
                }
            },

            //重置表单验证提示信息
            resetVerifyTip(){
                this.showNameTip = false;
                this.showPwdTip = false;
                this.showGroupTip = false;
                this.nameTipMsg = "";
                this.pwdTipMsg = "";
                this.groupTipMsg = "";
            }
        },
        created(){
            this.getGroup();
        }
    }
</script>

<style scoped>

</style>