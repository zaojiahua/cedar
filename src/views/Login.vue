<template>
    <div>
        <Row type="flex" justify="center" align="middle" class="row" style="background: #2F3638;">
            <Card :bordered="true" style="padding: 0 12px;">
                <p id="title" slot="title">TMACH</p>
                <Form ref="formInline" inline>
                    <Row>
                        <FormItem>
                            <Input type="text" v-model="username" :autofocus="true" @keyup.enter.native="login" placeholder="请输入账户">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem>
                            <Input type="password" v-model="password" @keyup.enter.native="login" placeholder="请输入密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row type="flex" justify="start">
                        <FormItem>
                            <Checkbox v-model="keepLogin" @keyup.enter.native="login">保持登入</Checkbox>
                        </FormItem>
                    </Row>
                    <Row type="flex" justify="end">
                        <FormItem>
                            <Button id="loginButton" type="primary" @click="login" @keyup.enter="login" style="width: 200px;">登入
                            </Button>
                        </FormItem>
                    </Row>
                </Form>
            </Card>
        </Row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: "",
                keepLogin: false
            }
        },
        methods: {
            login() {
                this.$Loading.start()
                this.$ajax
                    .post('api/v1/login/', {
                        username: this.username,
                        password: this.password
                    })
                    .then(response => {
                        sessionStorage.setItem("token", response.data["token"])
                        localStorage.setItem("id", response.data["id"])
                        localStorage.setItem("username", response.data["username"])
                        if(this.keepLogin){
                            localStorage.setItem("token", response.data["token"])
                        }
                        this.$router.push({name: "home"})
                        this.$Message.success('成功登入!');
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status === 400) {
                            errorMsg = "错误的 使用者名称 或 密码 ！"
                        }
                        else if(error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        }
                        else {
                            errorMsg = error.toString()
                        }
                        this.$Message.error(errorMsg)
                        this.$Loading.error()
                    })


            }
        },
        mounted() {
            localStorage.removeItem("token")
            localStorage.removeItem("id")
            sessionStorage.removeItem("permissions")
            sessionStorage.removeItem("token")
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