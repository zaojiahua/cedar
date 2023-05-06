<template>
    <Card>
        <p slot="title">{{$t('appInfo.title_1')}}</p>
        <Form :model="selectMsg" :label-width="130" :rules="ruleValidate" ref="formValidate">
            <FormItem label="App：" prop="app_name_id">
                <!--<Input v-model="selectMsg.app_name" type="text" ></Input>-->
                <Select v-model="selectMsg.app_name_id" :filterable="true" style="width:100%" class="disabled" :disabled="isDisabled">
                    <Option v-for="item in appNameList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('deviceDetail.account_info')+'：'" prop="name">
                <Input v-model="selectMsg.name" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem :label="$t('userDetail.password')+'：'"  prop="password">
                <Input v-model="selectMsg.password" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem :label="$t('appInfo.tips_2')+'：'"  prop="username">
                <Input v-model="selectMsg.username" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem :label="$t('appInfo.tips_3')+'：'">
                <Input v-model="selectMsg.phone_number"  @on-keyup="selectMsg.phone_number=phoneInput(selectMsg.phone_number)" :maxlength="11" :placeholder="$t('resourcesList.title_2')"></Input>
            </FormItem>
        </Form>
        <Row type="flex" justify="center">
            <Button type="primary" @click="commit()">{{$t('resourcesList.commit')}}</Button>
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
                },
                appNameList:[],
                ruleValidate: {
                    app_name_id: [
                        { required: true, type:"number", message: this.$t('appInfo.title_2'), trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: this.$t('appInfo.title_3'), trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: this.$t('appInfo.title_4'), trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: this.$t('appInfo.title_5'), trigger: 'blur' }
                    ],
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
                }
            },
            commit(){
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if(this.selectMsg.phone_number.trim().length<11&&this.selectMsg.phone_number.trim().length>0){
                            this.$Message.warning(this.$t('resourcesList.title_2'))
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
                            }).then(response=>{
                                this.$Message.success(this.$t('appInfo.title_6'))
                                this.$emit('after-succrss')
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                if(error.response.data.non_field_errors){
                                    this.$Message.error({content:this.$t('appInfo.title_7'),duration: 6})
                                    return
                                }
                                this.$Message.error({content:this.$t('appInfo.title_8'),duration: 6})
                            })
                        }else {
                            //修改资源
                            this.$ajax.patch("api/v1/cedar/account/" + this.selectMsg.id + "/",{
                                app:this.selectMsg.app_name_id,
                                name:this.selectMsg.name,
                                username:this.selectMsg.username,
                                password:this.selectMsg.password,
                                phone_number:this.selectMsg.phone_number,
                            }).then(response=>{
                                this.$Message.success(this.$t('appInfo.title_9'))
                                this.$emit('after-update')
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                if(error.response.data.non_field_errors){
                                    this.$Message.error({content:this.$t('appInfo.title_7'),duration: 6})
                                    return
                                }
                                this.$Message.error({content:this.$t('appInfo.title_11'),duration: 6})
                            })
                        }
                    } else {
                        this.$Message.warning(this.$t('appInfo.title_10'));
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
                        this.$Message.error(this.$t('appInfo.tips_9'))
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
