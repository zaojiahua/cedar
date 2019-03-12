<template>
    <div>
        Login
        <label>
            username
            <input v-model="username" type="text"/>
        </label>
        <label>
            password
            <input v-model="password" type="password"/>
        </label>
        <button @click="login">登入</button>
    </div>
</template>

<script>
    import $ from '../lib/utils'
    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: ''
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
            }
        }
    }
</script>

<style scoped>

</style>