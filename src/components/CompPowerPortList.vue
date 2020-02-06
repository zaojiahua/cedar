<template>
    <div>
        <Drawer width="50" v-model="showPowerPortDetail" :closable="false" :draggable="true">
            <comp-power-port-detail ref="detail"></comp-power-port-detail>
        </Drawer>
        <Modal v-if="propAddMode" v-model="showAddHardWare" :closable="false" :mask-closable="false" :footer-hide="true">
            <comp-add-hard-ware ref="addHardware" @on-close-modal="onCloseHardWareModal" @after-add-hardware-click="onCloseHardWareModal"></comp-add-hard-ware>
        </Modal>
        <Row v-if="propAddMode" style="margin-bottom: 15px;text-align: right">
            <Button icon="md-add" type="primary" @click="onOpenHardWareModal">添加硬件模块</Button>
        </Row>
        <Table :columns="powerPortColumns" :data="powerPorts" @on-row-click="onRowClick"></Table>
    </div>
</template>

<script>
    import CompPowerPortDetail from "./CompPowerPortDetail";
    import CompAddHardWare from "./CompAddHardWare";
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
        components: {CompPowerPortDetail,CompAddHardWare},
        props:{
            propAddMode:{
                type:Boolean,
                default:true
            }
        },
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
                showAddHardWare:false,
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
            onCloseHardWareModal(){
                this.showAddHardWare = false;
            },
            onOpenHardWareModal(){
                this.showAddHardWare = true;
                this.$refs.addHardware.reset()
            },
        },
        created() {
            this.refresh()
        }

    }
</script>

<style scoped>

</style>