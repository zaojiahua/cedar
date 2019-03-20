<template>
    <div>
        <Drawer width="50" v-model="showPowerPortDetail" :closable="false" :draggable="true">
            <comp-power-port-detail></comp-power-port-detail>
        </Drawer>
        <Table :columns="powerPortColumns" :data="powerPorts" @on-row-click="showPowerPortDetail = true"></Table>
    </div>
</template>

<script>
    import CompPowerPortDetail from "./CompPowerPortDetail";

    export default {
        name: "CompPowerPortList",
        components: {CompPowerPortDetail},
        data(){
            return {
                powerPortColumns:[
                    {
                        title: "编号",
                        key: "port",
                        sortable: true
                    },
                    {
                        title: "关联设备",
                        key: "device.device_name",
                        sortable: true
                    }
                ],
                powerPorts:[
                    {
                        id: 1,
                        port: "PA-01",
                        "device.device_name": "Device1"
                    },
                    {
                        id: 2,
                        port: "PA-02",
                        "device.device_name": "Device2"
                    },
                    {
                        id: 1,
                        port: "PA-03"
                    },
                ],
                showPowerPortDetail: false
            }
        }

    }
</script>

<style scoped>

</style>