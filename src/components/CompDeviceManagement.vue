<template>
    <div>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail></comp-device-detail>
        </Drawer>
        <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                       @on-change="onTableColumnChange">
            <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
        </CheckboxGroup>
        <Table border :columns="tableDeviceColumn" :data="devices" @on-row-click="onDeviceRowClick"></Table>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";

    export default {
        name: "CompDeviceManagement",
        components: {CompDeviceDetail},
        data(){
            return {
                deviceColumn: {
                    "device_label":
                        {
                            title: "设备编号",
                            key: "device_label",
                            sortable: true
                        },
                    "device_name":{
                        title: "自定义名称",
                        key: "device_name",
                        sortable: true
                    },
                    "phone_model":{
                        title: "设备型号",
                        key: "phone_model",
                        sortable: true
                    },
                    "rom_version":{
                        title: "ROM版本",
                        key: "rom_version",
                        sortable: true
                    },
                    "android_version":{
                        title: "安卓版本",
                        key: "android_version",
                        sortable: true
                    },
                    "cpu_name":{
                        title: "CPU型号",
                        key: "cpu_name",
                        sortable: true
                    },
                    "ip_address":{
                        title: "IP",
                        key: "ip_address",
                        sortable: true
                    },
                    "status":{
                        title: "使用状态",
                        key: "status",
                        sortable: true
                    },
                    "power":{
                        title: "电量",
                        key: "power",
                        sortable: true
                    },
                    "power_port":{
                        title: "充电口",
                        key: "power_port",
                        sortable: true
                    },
                    "temp_port":{
                        title: "温感片",
                        key: "temp_port",
                        sortable: true
                    },
                    "monitor_port":{
                        title: "相机",
                        key: "monitor_port",
                        sortable: true
                    }
                },
                deviceColumnChecked: [],
                tableDeviceColumn: [],
                devices: [
                    {
                        device_label: "device_label",
                        device_name: "device_name",
                        phone_model: "phone_model"
                    },
                    {
                        device_label: "device_label2",
                        device_name: "device_name",
                        phone_model: "phone_model"
                    }
                ],
                showDeviceDetail: false,

            }
        },
        methods:{
            getDeviceColumn(){
                let data = []
                this.deviceColumnChecked.forEach(
                    col=>data.push(this.deviceColumn[col])
                )
                return data
            },
            onTableColumnChange(){
                this.tableDeviceColumn = this.getDeviceColumn()
                localStorage.setItem("device-management:DEFAULT_DEVICE_COLUMN",
                    this.deviceColumnChecked.join(",")
                )
            },
            onDeviceRowClick(data, index){
                this.deviceDetailTitle = data.device_name
                this.showDeviceDetail = true
            },

        },
        mounted() {
            this.deviceColumnChecked = localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN").split(",")
            this.onTableColumnChange()
        }
    }
</script>

<style scoped>

</style>