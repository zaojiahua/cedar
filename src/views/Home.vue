<template>
    <div>
        <Navigation/>
        <!--<error_404/>-->
        <!--<error_401/>-->
    </div>
</template>

<script>
    import Navigation from "../components/Navigation";
    import error_404 from "../errorpage/404.vue";
    import error_401 from "../errorpage/401.vue";

    export default {
        name: "Home",
        components: {Navigation,error_404,error_401},
        methods:{

        }
    }
</script>

<style scoped>

</style>