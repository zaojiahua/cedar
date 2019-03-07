<template>
    <div>
        Navigation
        <router-link to="/page1">page1</router-link>
        <router-link to="/page2">page2</router-link>
        <router-link to="/page3">page3</router-link>
        <router-link to="/login">login</router-link>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "Navigation"
    }
</script>

<style scoped>

</style>