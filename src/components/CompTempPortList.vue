<template>
    <div>
        <Drawer v-model="showTempPortDetail" :draggable="true" :closable="false" width="50">
            <comp-temp-port-detail ref="detail" @afterUpdateTempPortSuccess="afterUpdateTempPortSuccess"></comp-temp-port-detail>
        </Drawer>
        <Table border :columns="tempPortColumn" :data="tempPorts" @on-row-click="onRowClick"></Table>
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
                // Table control
                tempPortColumn:[
                    {
                        title: "温度感应片编号",
                        key: "port",
                        sortable: true,
                        width: 155
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
                // Detail
                showTempPortDetail: false,
                tempPortId: null
            }
        },
        methods:{
            // Data
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
                        if(port.device.id !== null)
                            port.device_display_name = port.device.device_name + "(" + port.device.device_label + ")"
                        else
                            port.device_display_name = ""
                    })
                    this.tempPorts = tempports
                }).catch(reason => {
                    this.$Message.error("载入失败")
                })
            },
            // Table control
            onRowClick(data, index){
                this.showTempPortDetail = true
                this.$refs.detail.refresh(data.id)
            },
            // Detail
            afterUpdateTempPortSuccess(){
                this.showTempPortDetail = false
                this.refresh()
            }
        },
        created() {
            this.refresh()
        }
    }
</script>

<style scoped>

</style>
