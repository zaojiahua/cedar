<template>
    <div>
        <Row type="flex" justify="center" align="middle" class="row" style="background: #2F3638;">
            <Card :bordered="true" style="padding: 0 12px;">
                <p id="title" slot="title">TMACH</p>
                <Form ref="formInline" :model="formInline" inline>
                    <Row>
                        <FormItem prop="user">
                            <Input type="text" v-model="formInline.user" placeholder="请输入账户">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="password">
                            <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Row>
                    <Row type="flex" justify="space-between">
                            <FormItem>
                                <Checkbox v-model="keepLogin">保持登入</Checkbox>
                            </FormItem>
                            <FormItem>
                                <Dropdown>
                                    <Button type="primary">
                                        {{language}}
                                        <Icon type="ios-arrow-down"></Icon>
                                    </Button>
                                    <DropdownMenu slot="list">
                                        <DropdownItem @click.native="selectLanguage('简体中文')">简体中文</DropdownItem>
                                        <DropdownItem @click.native="selectLanguage('English')">English</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </FormItem>
                    </Row>
                    <Row type="flex" justify="end">
                        <FormItem>
                            <Button id="loginButton" type="primary" @click="handleSubmit('formInline')" style="width: 200px;">登入</Button>
                        </FormItem>
                    </Row>
                </Form>
            </Card>
        </Row>

    </div>
</template>

<script>
    import $ from '../lib/utils'
    export default {
        name: "Login",
        data() {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                keepLogin: false,
                language: "简体中文"
            }
        },
        methods: {
            login(){
                $.ajax
                    .post('http://127.0.0.1:8000/api/v1/login/', {username: this.username, password: this.password})
                    .then(response=>{
                        if(response.status===200){
                            sessionStorage.loginStatus = "login"
                            this.$router.push({name: "home"})
                        }

                    })
            },
            selectLanguage(lang){
                this.language = lang
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Loading.start()
                        this.$Message.success('Success!');
                        this.$router.push({name: "home"})
                        this.$Loading.finish()
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style scoped>
.row{
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}
#title{
    color: #1bbc9c;
    font-size: 24px;
    font-weight: 900;
}
#loginButton{
    /*margin-top: 20px;*/
}
</style>