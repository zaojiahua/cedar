<template>
    <div>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail :device_id="deviceDetailId" ref="detail" @afterDeviceDelete="afterDeviceDelete" @afterDeviceUpdate="afterDeviceUpdate"></comp-device-detail>
        </Drawer>
        <Modal v-model="showAddDevice" :closable="false" :footer-hide="true">
            <comp-add-device ref="addDevice" @afterDeviceAddSuccess="afterDeviceAddSuccess" @afterDeviceAddFailed="afterDeviceAddFailed"></comp-add-device>
        </Modal>
        <Row type="flex" justify="space-between" style="margin-bottom: 8px;">
            <Col span="20">
                <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                               @on-change="onTableColumnChange">
                    <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </Col>
            <Col>
                <Button icon="md-add" type="primary" @click="onAddDeviceClick">添加装置</Button>
            </Col>
        </Row>

        <Table border :columns="tableDeviceColumn" :data="devices" @on-row-click="onDeviceRowClick" :loading="loading"></Table>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompAddDevice from "./CompAddDevice"
    import utils from "../lib/utils"


    const getDeviceListSerializer = [
        {
            id: "number",
            device_label: "string",
            device_name: "string",
            phone_model: {
                phone_model_name: "string",
                cpu_name: "string"
            },
            rom_version: {
                version: "string"
            },

            android_version: {
                version: "string"
            },
            ip_address: "string",
            status: "string",
            powerport: {
                port: "string"
            },
            tempport: [
                {
                    port: "string",
                    description: "string"
                }
            ],
            monitor_index: [
                {
                    port: "string"
                }
            ]

        }
    ]

    export default {
        name: "CompDeviceManagement",
        components: {CompDeviceDetail, CompAddDevice},
        data() {
            return {
                // Data loading
                loading: false,
                // Device table
                deviceColumn: {
                    "device_label": {
                        title: "设备编号",
                        key: "device_label",
                        sortable: true
                    },
                    "device_name": {
                        title: "自定义名称",
                        key: "device_name",
                        sortable: true
                    },
                    "phone_model": {
                        title: "设备型号",
                        key: "phone_model",
                        sortable: true
                    },
                    "rom_version": {
                        title: "ROM版本",
                        key: "rom_version",
                        sortable: true
                    },
                    "android_version": {
                        title: "安卓版本",
                        key: "android_version",
                        sortable: true
                    },
                    "cpu_name": {
                        title: "CPU型号",
                        key: "cpu_name",
                        sortable: true
                    },
                    "ip_address": {
                        title: "IP",
                        key: "ip_address",
                        sortable: true
                    },
                    "status": {
                        title: "使用状态",
                        key: "status",
                        sortable: true
                    },
                    "power": {
                        title: "电量",
                        key: "power",
                        sortable: true
                    },
                    "powerport": {
                        title: "充电口",
                        key: "powerport",
                        sortable: true
                    },
                    "tempport": {
                        title: "温感片",
                        key: "tempport",
                        sortable: true
                    },
                    "monitorport": {
                        title: "相机",
                        key: "monitorport",
                        sortable: true
                    }
                },
                deviceColumnChecked: [],
                tableDeviceColumn: [],
                // Devices data
                devices: [],
                // Device detail
                showDeviceDetail: false,
                deviceDetailId: null,
                // Add device
                showAddDevice: false,
            }
        },
        methods: {
            // Data loading
            refresh(){
                this.loading = true
                this.$ajax
                    .get('api/v1/cedar/device/?fields=' +
                        'id,' +
                        'device_label,' +
                        'phone_model,' +
                        'phone_model.phone_model_name,' +
                        'rom_version,' +
                        'rom_version.version,' +
                        'device_name,' +
                        'android_version,' +
                        'android_version.version,' +
                        'phone_model.cpu_name,' +
                        'ip_address,' +
                        'status,' +
                        'powerport,' +
                        'powerport.port,' +
                        'tempport,' +
                        'tempport.port,' +
                        'tempport.description,' +
                        'monitor_index,' +
                        'monitor_index.port')
                    .then(response => {
                        this.devices = utils.validate(getDeviceListSerializer, response.data['devices'])
                        this.devices.forEach(device=>{
                            device.cpu_name = device.phone_model.cpu_name
                            device.phone_model = device.phone_model.phone_model_name
                            device.rom_version = device.rom_version.version
                            device.android_version = device.android_version.version
                            device.powerport = device.powerport.port
                            let tempPortStr = ""
                            device.tempport.forEach(temp=>{
                                if(temp.description)
                                    tempPortStr = tempPortStr+temp.port+"("+temp.description+"), "
                                else
                                    tempPortStr = tempPortStr+temp.port+ ", "
                            })
                            device.tempport = tempPortStr.substring(0,tempPortStr.length-2)
                            let monitorPortStr = ""
                            device.monitor_index.forEach(monitor=>{
                                monitorPortStr = monitorPortStr+monitor.port+", "
                            })
                            device.monitorport = monitorPortStr.substring(0, monitorPortStr.length-2)
                        })
                        this.loading = false
                    })
                    .catch(reason => {
                        this.$Message.error('载入失败')
                    })
            },
            // Table control
            getDeviceColumn() {
                let data = []
                this.deviceColumnChecked.forEach(
                    col => data.push(this.deviceColumn[col])
                )
                return data
            },
            onTableColumnChange() {
                this.tableDeviceColumn = this.getDeviceColumn()
                localStorage.setItem("device-management:DEFAULT_DEVICE_COLUMN",
                    this.deviceColumnChecked.join(",")
                )
            },
            onDeviceRowClick(data, index) {
                if(this.$refs.detail && this.$refs.detail.refreshData){
                    this.showDeviceDetail = true
                    this.deviceDetailId = data.id
                    this.$refs.detail.refreshData(data.id)
                } else {
                    this.$Notice.error({
                        title: "有些什么出错了!"
                    })
                }
            },
            // Add Device
            onAddDeviceClick(){
                this.$refs.addDevice.reset()
                this.showAddDevice=true
            },
            afterDeviceAddSuccess(device){
                this.showAddDevice = false
                this.refresh()
            },
            afterDeviceAddFailed(reason){

            },
            // Delete Device
            afterDeviceDelete(response){
                this.refresh()
                this.showDeviceDetail = false
            },
            // Update Device
            afterDeviceUpdate(){
                this.showDeviceDetail = false
                this.refresh()
            }
        },
        created() {
            this.refresh()
        },
        mounted() {
            this.deviceColumnChecked = localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN").split(",")
            this.onTableColumnChange()
        }
    }
</script>

<style scoped>

</style>