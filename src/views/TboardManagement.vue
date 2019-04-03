<template>
    <Card dis-hover>
        <Drawer v-model="showTboardDetail" width="60" :closable="false" transfer>
            <comp-tboard-detail @on-cell-click="showTboardMoreDetail = !showTboardMoreDetail"></comp-tboard-detail>
        </Drawer>

        <comp-tboard-list style="margin-top: 16px;" @on-row-click="onTboardRowClick"></comp-tboard-list>

        <Drawer v-model="showTboardMoreDetail" width="50" :closable="false" transfer>
            <comp-tboard-device-detail></comp-tboard-device-detail>
        </Drawer>
    </Card>
</template>

<script>
    import CompTboardList from "../components/CompTboardList";
    import CompTboardDetail from "../components/CompTboardDetail";
    import CompTboardDeviceDetail from "../components/CompTboardDeviceDetail";
    import CompDeviceDetail from "../components/CompDeviceDetail";
    export default {
        name: "TboardManagement",
        components: {CompDeviceDetail, CompTboardDeviceDetail, CompTboardDetail, CompTboardList},
        data(){
            return {
                showTboardDetail: false,
                showTboardMoreDetail: false
            }
        },
        methods: {
            onTboardRowClick(row, index){
                this.showTboardDetail = true
            }
        }
    }
</script>

<style scoped>

</style>