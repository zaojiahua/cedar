<template>
    <div>
        <div id="particles-js" style="position: fixed;background: #2F3638; width: 100%; height: 100%;">
            <Card :bordered="true" style="padding: 0 12px; width: 260px; margin-left: auto; margin-right: auto; position: absolute; right: 0; left: 0; top: 30%">
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
        </div>
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
                if(this.username.trim().length===0){
                    this.$Message.warning("请输入用户名！")
                    return
                }
                if(this.password.length===0){
                    this.$Message.warning("请输入密码！")
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
                        this.$Message.success('成功登入!');
                        this.$Loading.finish()
                    })
                    .catch(error => {
                        let errorMsg = "";
                        if (error.response.status === 400) {
                            errorMsg = "该用户已被冻结！"
                        }else if (error.response.status === 401) {
                            errorMsg = "密码错误！"
                        }else if (error.response.status === 404)
                            errorMsg = "用户名错误！"
                        else if(error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
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
