<template>
    <Card>
        <p slot="title">账号资源信息</p>
        <Form v-model="selectMsg" :label-width="150">
            <FormItem label="App：">
                <Input v-model="selectMsg.app_name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="账号：">
                <Input v-model="selectMsg.account_number" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="密码：">
                <Input v-model="selectMsg.password" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="用户名：">
                <Input v-model="selectMsg.user_name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="绑定手机号：">
                <Input v-model="selectMsg.phone_number" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="头像：">
                <Input v-model="selectMsg.picture" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="好友：">
                <Input v-model="selectMsg.friends" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="最多登录设备数：">
                <Input v-model="selectMsg.login_number" ></Input>
            </FormItem>


        </Form>
        <Row type="flex" justify="center">
            <Button type="primary" @click="commit">提交</Button>
        </Row>

    </Card>
</template>

<script>
    export default {
        name: "CompAddAppCardMsg",
        data(){
            return{
                selectMsg:{
                    app_name:"",
                    account_number:"",
                    user_name:"",
                    password:"",
                    phone_number:null,
                    picture:"",
                    friends:"",
                    login_number:null
                }
            }
        },
        methods:{
            reset(){
                this.selectMsg = {
                    app_name:"",
                    account_number:"",
                    user_name:"",
                    password:"",
                    phone_number:null,
                    picture:"",
                    friends:"",
                    status:"",
                    device:"",
                    history:"",
                    login_number:null
                }
            },
            setData(row){
                this.selectMsg = {
                    app_name:row.app_name,
                    account_number:row.account_number,
                    user_name:row.user_name,
                    password:row.password,
                    phone_number:row.phone_number,
                    picture:row.picture,
                    friends:row.friends,
                    status:row.status,
                    device:row.device,
                    history:row.history,
                    login_number:row.login_number
                }
            },
            commit(){
                this.$Message.success("提交成功")
                this.$emit('after-succrss')
            }
        }
    }
</script>

<style scoped>

</style>