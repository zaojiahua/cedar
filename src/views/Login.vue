<template>
    <div>
        <div id="particles-js" style="position: fixed;background: #2F3638; width: 100%; height: 100%;">
            <Card :bordered="true" style="padding: 0 12px; width: 260px; margin-left: auto; margin-right: auto; position: absolute; right: 0; left: 0; top: 30%">
                <p id="title" slot="title">TMACH</p>
                <Form ref="formInline" inline>
                    <Row>
                        <FormItem>
                            <Input type="text" v-model="username" :autofocus="true" @keyup.enter.native="login" :placeholder="lang==='zh'?'请输入账户':'username'">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem>
                            <Input type="password" v-model="password" @keyup.enter.native="login" :placeholder="lang==='zh'?'请输入密码':'password'">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row type="flex" justify="start">
                        <FormItem>
                            <Checkbox v-model="keepLogin" @keyup.enter.native="login" style="width: 84px">{{$t('login.remember')}}</Checkbox>
                            <Select v-model="lang" size="small" style="width:100px;display: inline-block" @on-change="onLangChange">
                                <Option value="zh">简体中文</Option>
                                <Option value="en">English</Option>
                            </Select>
                        </FormItem>
                    </Row>
                    <Row type="flex">
                        <!--<FormItem>-->
                            <Button id="loginButton" type="primary" @click="login" @keyup.enter="login" style="width: 192px;">{{$t('login.login_btn')}}
                            </Button>
                        <!--</FormItem>-->
                    </Row>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                lang: localStorage.getItem("lang") ||  'zh',
                username: "",
                password: "",
                keepLogin: false
            }
        },
        methods: {
            onLangChange(select){
                this.lang = select
                this.$i18n.locale = select
                localStorage.setItem('lang', select)
            },
            login() {
                if(this.username.trim().length===0){
                    this.$Message.warning(this.$t('login.check_username'))
                    return
                }
                if(this.password.length===0){
                    this.$Message.warning(this.$t('login.check_password'))
                    return
                }
                this.$Loading.start()
                this.$ajax
                    .post('api/v1/login/', {
                        username: this.username,
                        password: this.password
                    })
                    .then(response => {
                        sessionStorage.setItem("token", response.data["token"])
                        sessionStorage.setItem("id", response.data["id"])
                        sessionStorage.setItem("username", response.data["username"])
                        if(this.keepLogin){
                            localStorage.setItem("token", response.data["token"])
                            localStorage.setItem("id", response.data["id"])
                            localStorage.setItem("username", response.data["username"])
                        }
                        this.$router.push({name: "tboard-management"})
                        this.$Message.success(this.$t('login.successMsg'));
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status === 400) {
                            errorMsg = this.$t('login.errorMsg_400')
                        }else if (error.response.status === 401) {
                            errorMsg = this.$t('login.errorMsg_401')
                        }else if (error.response.status === 404)
                            errorMsg = this.$t('login.errorMsg_404')
                        else if(error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = error.toString()
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error()
                    })


            }
        },
        mounted() {
            console.log(this.lang);
            localStorage.removeItem("token")
            localStorage.removeItem("id")
            localStorage.removeItem("username")
            sessionStorage.removeItem("id")
            sessionStorage.removeItem("username")
            sessionStorage.removeItem("permissions")
            sessionStorage.removeItem("token")
            particlesJS.load("particles-js", "particles.json")

        }
    }
</script>

<style scoped>
    .row {
        position: absolute;
        top: 0px;
        bottom: 0px;
        right: 0px;
        left: 0px;
    }

    #title {
        color: #1bbc9c;
        font-size: 24px;
        font-weight: 900;
    }

    #loginButton {
        /*margin-top: 20px;*/
    }
</style>
