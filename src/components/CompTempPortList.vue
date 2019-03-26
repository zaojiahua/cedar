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
    import utils from "../lib/utils";


    const getTempPortListSerializer = {
        tempports: [
            {
                id: "string",
                port: "string",
                description: "string",
                device: {
                    id: "number",
                    device_label: "string",
                    device_name: "string"
                }
            }
        ]
    }

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
                        key: "device_display_name",
                        width: 400
                    }
                ],
                tempPorts: [],
                showTempPortDetail: false
            }
        },
        methods:{
            refresh(){
                this.$ajax.get(
                    "api/v1/cedar/temp_port/?fields=" +
                    "id," +
                    "port," +
                    "description," +
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label"
                ).then(response=>{
                    let tempports = utils.validate(getTempPortListSerializer, response.data).tempports
                    tempports.forEach(port=>{
                        port.device_display_name = port.device.device_name + "(" + port.device.device_label + ")"
                    })
                    this.tempPorts = tempports
                })
            }
        },
        created() {
            this.refresh()
        }
    }
</script>

<style scoped>

</style>