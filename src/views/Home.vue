<template>
    <div>
        <Navigation/>
    </div>
</template>

<script>
    import Navigation from "../components/Navigation";
    export default {
        name: "Home",
        components: {Navigation},
        methods:{
            logout(){
                sessionStorage.removeItem('isLogin')
                sessionStorage.removeItem('permissions')
                this.$router.push({name: "login"})
            }
        }
    }
</script>

<style scoped>

</style>