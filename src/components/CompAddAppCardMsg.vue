<template>
    <Card>
        <p slot="title">账号资源信息</p>
        <Form :model="selectMsg" :label-width="130" :rules="ruleValidate" ref="formValidate">
            <FormItem label="App：" prop="app_name_id">
                <!--<Input v-model="selectMsg.app_name" type="text" ></Input>-->
                <Select v-model="selectMsg.app_name_id" :filterable="true" style="width:100%" class="disabled" :disabled="isDisabled">
                    <Option v-for="item in appNameList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="账号：" prop="name">
                <Input v-model="selectMsg.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="密码："  prop="password">
                <Input v-model="selectMsg.password" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="用户名/昵称："  prop="username">
                <Input v-model="selectMsg.username" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="绑定手机号：">
                <Input v-model="selectMsg.phone_number"  @on-keyup="selectMsg.phone_number=phoneInput(selectMsg.phone_number)" :maxlength="11" placeholder="请输入正确的手机号"></Input>
            </FormItem>
            <FormItem label="头像：">
                <Input v-model="selectMsg.head_portrait_name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="好友：">
                <Input v-model="selectMsg.crony" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="最多登录数：" prop="max_login_num">
                <Input v-model="selectMsg.max_login_num" @on-keyup="selectMsg.max_login_num=phoneInput(selectMsg.max_login_num)"></Input>
            </FormItem>
        </Form>
        <Row type="flex" justify="center">
            <Button type="primary" @click="commit()">提交</Button>
        </Row>
    </Card>
</template>

<script>
    import config from "../lib/config";

    export default {
        name: "CompAddAppCardMsg",
        props:{
            isDisabled:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                selectMsg:{
                    app_name_id:"",
                    app_name:"",
                    name:"",
                    username:"",
                    password:"",
                    phone_number:"",
                    head_portrait_name:"",
                    crony:"",
                    max_login_num:""
                },
                appNameList:[],
                ruleValidate: {
                    app_name_id: [
                        { required: true, type:"number", message: 'APP名称不能为空', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    max_login_num:[
                        { required: true, message: '该项不能为空', trigger: 'blur' }
                    ]
                },
                flag:true,   //true:新建   false:修改
            }
        },
        methods:{
            reset(){
                this.flag = true
                this.selectMsg = {
                    app_name:"",
                    app_name_id:"",
                    name:"",
                    username:"",
                    password:"",
                    phone_number:"",
                    head_portrait_name:"",
                    crony:"",
                    max_login_num:""
                }
            },
            setData(row){
                this.flag = false
                this.selectMsg = {
                    id:row.id,
                    app_name:row.app_name,
                    app_name_id:row.app.id,
                    name:row.name,
                    username:row.username,
                    password:row.password,
                    phone_number:row.phone_number,
                    head_portrait_name:row.head_portrait_name,
                    crony:row.crony,
                    max_login_num:row.max_login_num.toString()
                }
            },
            commit(){
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if(this.selectMsg.phone_number.trim().length<11&&this.selectMsg.phone_number.trim().length>0){
                            this.$Message.warning("请输入正确的11位手机号！")
                            return
                        }
                        //新增资源
                        if(this.flag){
                            this.$ajax.post("api/v1/cedar/account/",{
                                app:this.selectMsg.app_name_id,
                                name:this.selectMsg.name,
                                username:this.selectMsg.username,
                                password:this.selectMsg.password,
                                phone_number:this.selectMsg.phone_number,
                                head_portrait_name:this.selectMsg.head_portrait_name,
                                crony:this.selectMsg.crony,
                                max_login_num:this.selectMsg.max_login_num
                            }).then(response=>{
                                this.$Message.success("账号资源添加成功")
                                this.$emit('after-succrss')
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                this.$Message.error({content:"账号资源添加失败! " + error.response.data,duration: 6})
                            })
                        }else {
                            //修改资源
                            this.$ajax.patch("api/v1/cedar/account/" + this.selectMsg.id + "/",{
                                app:this.selectMsg.app_name_id,
                                name:this.selectMsg.name,
                                username:this.selectMsg.username,
                                password:this.selectMsg.password,
                                phone_number:this.selectMsg.phone_number,
                                head_portrait_name:this.selectMsg.head_portrait_name,
                                crony:this.selectMsg.crony,
                                max_login_num:this.selectMsg.max_login_num
                            }).then(response=>{
                                this.$Message.success("账号信息修改成功")
                                this.$emit('after-update')
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                this.$Message.error({content:"账号信息修改失败! " + error.response.data,duration: 6})
                            })
                        }
                    } else {
                        this.$Message.warning('请先将账号信息填写完整');
                    }
                })
            },
            //获取app名称列表
            getAppNameList(){
                this.$ajax.get("api/v1/cedar/get_order_app_name")
                    .then(response=>{
                        this.appNameList = response.data.result
                    })
                    .catch(error=>{
                        this.$Message.error("app列表获取失败")
                    })
            },
            //校验、限制手机号
            phoneInput(value) {
                return value.replace(/[^\d]+/g,'')
            },
        },
        mounted(){
            this.getAppNameList()
        }
    }
</script>

<style scoped>
    /deep/.disabled .ivu-select-input[disabled]{
        color: #666;
        -webkit-text-fill-color: #666;
    }
</style>
