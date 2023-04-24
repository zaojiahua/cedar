<template>
    <Card>
        <Form  v-model="userInfo" :label-width="90">
            <FormItem :label="$t('userDetail.username')">
                <Input v-model="userInfo.username" :disabled="propEdit" placeholder="Enter username..." @on-keyup="usernameVerifyFeedback" :class="{'disabled-input':propEdit}"></Input>
                <p v-show="showNameTip" style="color: red;">{{ nameTipMsg }}</p>
            </FormItem>
            <FormItem :label="$t('userDetail.firstname')">
                <Input v-model="userInfo.firstname" placeholder="Enter your name..."></Input>
            </FormItem>
            <FormItem :label="$t('userDetail.password')" v-if="showPassword">
                <Input v-model="userInfo.password" type="password" placeholder="Enter password..." @on-keyup="passwordVerifyFeedback"></Input>
                <p v-show="showPwdTip" style="color: red;">{{ pwdTipMsg }}</p>
            </FormItem>
            <FormItem :label="$t('userDetail.role')">
                <CheckboxGroup v-model="userInfo.role" @on-change="groupVerifyFeedback">
                    <Checkbox v-for="item in groupList" :label="item" :key="item"></Checkbox><br/>
                </CheckboxGroup>
                <p v-show="showGroupTip" style="color: red;">{{ groupTipMsg }}</p>
            </FormItem>
        </Form>
        <div  class="drawer-footer">
            <Button v-if="propStatus" style="float: left" @click="showPassword=true;userInfo.password=null">{{$t('userDetail.btn_1')}}</Button>
            <Button type="primary" style="margin-right: 20px" @click="onSave">{{$t('public.btn_ok')}}</Button>
            <Button  @click="cancelClick">{{$t('public.btn_cancel')}}</Button>
        </div>
    </Card>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils";

    export default {
        name:"CompUserDetail",
        props:{
            propStatus:{
                type: Boolean,
                default: false
            },
            propEdit:{
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
            cancelClick(){
                this.$emit("onCancelClick",false);
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
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('userDetail.errorMsg_1')
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error();
                    })
            },
            onSave(){
                this.usernameVerifyFeedback();
                if(this.showPassword){
                    this.passwordVerifyFeedback();
                }
                this.groupVerifyFeedback();
                if(this.showNameTip===true||this.showPwdTip===true||this.showGroupTip===true)
                    return;
                // get url params
                let ajaxParamObj={};
                if(this.showPassword===true){   //need  password
                    if(this.propStatus){   //update user
                        ajaxParamObj = {
                            last_name:this.userInfo.firstname,
                            groups:this.userInfo.role,
                            password:this.userInfo.password
                        }
                    }else {     //  add user
                        ajaxParamObj = {
                            username:this.userInfo.username.trim(),
                            last_name:this.userInfo.firstname,
                            groups:this.userInfo.role,
                            password:this.userInfo.password
                        }
                    }
                }else {
                    ajaxParamObj = {
                        last_name:this.userInfo.firstname,
                        groups:this.userInfo.role
                    }
                }
                //send request
                if(this.propStatus){    //update  user
                    this.$Loading.start();
                    this.$ajax
                        .patch("api/v1/cedar/reefuser/"+ this.userInfo.id +"/",ajaxParamObj)
                        .then(response => {
                            this.$Message.success(this.$t('userDetail.success_1'));
                            this.$Loading.finish()
                            this.$emit("afterSendRequest",false)
                        })
                        .catch(error => {
                            let errorMsg = "";
                            if (error.response.status >= 500) {
                                errorMsg = this.$t('public.error_500')
                            }else if(error.response.status=== 400){
                                errorMsg = this.$t('userDetail.error_2')
                            } else {
                                errorMsg = error.toString()
                            }
                            this.$Message.error(errorMsg)
                            this.$Loading.error()
                        })

                }else{        // add new user
                    this.$Loading.start();
                    this.$ajax
                        .post("api/v1/cedar/reefuser/",ajaxParamObj)
                        .then(response => {
                            this.$Message.success(this.$t('public.addSuccess'));
                            this.$Loading.finish()
                            this.$emit("afterSendRequest",false)
                        })
                        .catch(error => {
                            let errorMsg = "";
                            if (error.response.status >= 500) {
                                errorMsg = this.$t('public.error_500')
                            }else if(error.response.status=== 400){
                                errorMsg = this.$t('userDetail.error_2')
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
                   return this.$t('userDetail.verify_1')
                }else if (this.userInfo.username.trim().length<5||this.userInfo.username.trim().length>50) {
                    return this.$t('userDetail.verify_2')
                } else if (!/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/.test(this.userInfo.username.trim())) {
                    return this.$t('userDetail.verify_3')
                } else {
                    return  "";
                }
            },
            passwordVerify(){
                if(!this.userInfo.password || this.userInfo.password.trim().length===0){
                    return this.$t('userDetail.verify_4')
                }else if (this.userInfo.password.trim().length<6||this.userInfo.password.trim().length>30) {
                    return this.$t('userDetail.verify_5')
                }else {
                    return  "";
                }
            },
            groupVerify(){
                if(this.userInfo.role.length<1){
                    return  this.$t('userDetail.verify_6')
                }else {
                    return "";
                }
            },
            //表单验证信息反馈
            usernameVerifyFeedback(){
                let result = this.usernameVerify()
                this.showNameTip = result !== ""
                this.nameTipMsg = result
            },
            passwordVerifyFeedback(){
                let result = this.passwordVerify()
                this.showPwdTip = result !== ""
                this.pwdTipMsg = result
            },
            groupVerifyFeedback(){
                let result = this.groupVerify();
                this.showGroupTip= result !== ""
                this.groupTipMsg = result
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
    .drawer-footer{
        text-align: right;
    }
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>
