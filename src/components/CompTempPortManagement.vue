<template>
    <div>
        <Drawer v-model="showTempPortDetail" :draggable="true" :closable="false" width="50">
            <comp-temp-port-detail></comp-temp-port-detail>
        </Drawer>
        <Table border :columns="tempPortColumn" :data="tempPorts" @on-row-click="showTempPortDetail = true"></Table>
    </div>
</template>

<script>
    import CompTempPortDetail from "./CompTempPortDetail";

    export default {
        name: "CompTempPortManagement",
        components: {CompTempPortDetail},
        data(){
            return {
                tempPortColumn:[
                    {
                        title: "温度感应片编号",
                        key: "port",
                        sortable: true,
                        width: 150
                    },
                    {
                        title: "备注",
                        key: "description"
                    },
                    {
                        title: "配对的测试设备",
                        key: "device",
                        width: 400
                    }
                ],
                tempPorts:[
                    {
                        id: 1,
                        port: "TP-01",
                        description: "wow",
                        device: "Device1"
                    },
                    {
                        id: 2,
                        port: "TP-02",
                        description: "wow",
                        device: "Device2"
                    },
                    {
                        id: 3,
                        port: "TP-03",
                        description: "wow",
                    },
                ],
                showTempPortDetail: false
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>