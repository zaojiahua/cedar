<template>
    <Card >
        <p slot="title" style="color:#1bbc9c;text-align: center;height: 23px"><Icon type="ios-contact" size="24"/>{{$t('personal.title')}}</p>
        <Form v-model="userInfo" :label-width="120" style="width: 400px;margin: 0 auto">
            <FormItem>
                <b slot="label">{{$t('personal.name')}}:</b>
                <Input v-model="userInfo.name" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('personal.real')}}:</b>
                <Input v-model="userInfo.lastname" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('personal.role')}}:</b>
                <Input v-model="userInfo.role" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem v-if="showPwd">
                <b slot="label">{{$t('personal.psd')}}:</b>
                <Input v-model="userInfo.password" type="password" placeholder="Enter your new password..."></Input>
            </FormItem>
            <p style="text-align: center;margin: 60px 0 20px;">
                <Button v-if="updateBtn" @click="passwordBtn">{{$t('personal.btn_update')}}</Button>
                <Button v-if="saveBtn" type="primary" @click="savePwdBtn">{{$t('personal.btn_save')}}</Button>
            </p>
        </Form>
    </Card>
</template>

<script>
    export default{
        data(){
            return{
                userInfo:{
                    name:"",
                    password:null,
                    role:"",
                    lastname:"",
                    id:null,

                },
                showPwd:false,
                updateBtn:true,
                saveBtn:false,
            }
        },
        methods:{
            passwordBtn(){
                this.showPwd=true;
                this.updateBtn=false;
                this.saveBtn=true;

            },
            savePwdBtn(){
                if(this.userInfo.password===null){
                    this.$Message.warning(this.$t('personal.enterPassword'));
                }else {
                    this.$Loading.start();
                    this.$ajax
                        .patch("api/v1/cedar/reefuser/"+ this.userInfo.id +"/",{
                            password:this.userInfo.password
                        })
                        .then(response => {
                            this.$Message.success(this.$t('personal.successPsd'))
                            this.showPwd=false;
                            this.updateBtn=true;
                            this.saveBtn=false;
                            this.userInfo.password="";
                            this.$Loading.finish()
                        })
                        .catch(error => {
                            let errorMsg = "";
                            if (error.response.status >= 500) {
                                errorMsg = this.$t('public.error_500')
                            } else {
                                errorMsg = this.$t('personal.errorPsd')
                            }
                            this.$Message.error(errorMsg)
                            this.$Loading.error()
                        })
                }

            }
        },
        created(){
            let userId = sessionStorage.getItem('id');
            this.userInfo.id = userId;
            this.$ajax
                .get("api/v1/cedar/reefuser/?fields=id,username,last_name," +
                    "groups,groups.id,groups.name" +
                    "&id="+userId)
                .then(response=>{
                    let groups = [];
                    for(let i=0;i<response.data.reefusers[0].groups.length;i++){
                        groups.push(response.data.reefusers[0].groups[i].name)
                    }
                    this.userInfo.name = response.data.reefusers[0].username;
                    this.userInfo.lastname = response.data.reefusers[0].last_name;
                    this.userInfo.role = groups.join(",");
                })
        }
    }

</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #dcdcdc dotted 1px;
    }
</style>
