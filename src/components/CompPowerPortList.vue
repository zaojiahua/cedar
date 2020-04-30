<template>
    <div>
        <Drawer width="50" v-model="showPowerPortDetail" :closable="false" :draggable="true">
            <comp-power-port-detail ref="detail"></comp-power-port-detail>
        </Drawer>
        <Table :columns="powerPortColumns" :data="powerPorts" @on-row-click="onRowClick" border></Table>
    </div>
</template>

<script>
    import CompPowerPortDetail from "./CompPowerPortDetail";
    import utils from "../lib/utils";
    import config from "../lib/config";
    const getPowerPortSerializer = {
        powerports: [
            {
                id: "number",
                port: "string",
                device: {
                    id: "number",
                    device_name: "string",
                    device_label: "string"
                }
            }
        ]
    }
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
                        key: "display_device_name",
                        sortable: true
                    }
                ],
                powerPorts:[],
                showPowerPortDetail: false,
            }
        },
        methods:{
            // Data
            refresh(){
                this.$ajax.get(
                    "api/v1/cedar/power_port/?fields=" +
                    "id," +
                    "port," +
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label"
                ).then(response=>{
                    let data = utils.validate(getPowerPortSerializer, response.data).powerports
                    data.forEach(port=>{
                        if(port.device.id !== null)
                            port.display_device_name = port.device.device_name + "(" + port.device.device_label + ")"
                        else
                            port.device_display_name = ""
                    })
                    this.powerPorts = data
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                })
            },
            // Table control
            onRowClick(data, index){
                this.showPowerPortDetail = true
                this.$refs.detail.refresh(data.id)
            },
        },
        created() {
            this.refresh()
        }

    }
</script>

<style scoped>

</style>