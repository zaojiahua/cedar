<template>
    <Card dis-hover>
        <comp-tboard-list style="margin-top: 16px;"></comp-tboard-list>
    </Card>
</template>

<script>
    import CompTboardList from "../components/CompTboardList";
    export default {
        name: "TboardManagement",
        components: {CompTboardList}
    }
</script>

<style scoped>

</style>