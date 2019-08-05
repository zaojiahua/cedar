<template>
    <div>
        <slot name="detail"></slot>
        <Modal v-if="propAddMode" v-model="showAddDevice" :closable="false" :footer-hide="true">
            <comp-add-device ref="addDevice" @afterDeviceAddSuccess="afterDeviceAddSuccess"></comp-add-device>
        </Modal>
        <Row type="flex" justify="space-between" style="margin-bottom: 8px;">
            <Col span="20">
                <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                               @on-change="onTableColumnChange">
                    <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </Col>
            <Col v-if="propAddMode">
                <Button icon="md-add" type="primary" @click="onAddDeviceClick">添加装置</Button>
            </Col>
        </Row>

        <Table ref="table" border :columns="tableDeviceColumn" :data="data" @on-row-click="onRowClick" :loading="loading" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="propPageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompAddDevice from "./CompAddDevice"
    import utils from "../lib/utils"
    import config from "../lib/config"


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
    const getPhoneModelSerializer = [
        {
            id: "number",
            phone_model_name: "String",
        }
     ]

    export default {
        name: "CompDeviceManagement",
        components: {CompDeviceDetail, CompAddDevice},
        props:{
            propAddMode:{ // Show adding button
                type: Boolean,
                default: true
            },
            propAutoLoad:{ // Auto load data from reef
                type: Boolean,
                default: true
            },
            propMultiSelect:{ // Multi selection feature
                type: Boolean,
                default: false
            },
            propPageSize: {
                type: Number,
                default: config.PAGE_SIZE
            },
            propDeviceStatus:{
                type: Boolean,
                default: false
            },
            propFilterStatus:{
                type: Boolean,
                default: false
            }
        },
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
                        sortable: true,
                        filters:[],
                        filterRemote(value){
                           if(this.propFilterStatus){
                                this.$Modal.info({
                                    title: "提示",
                                    content: "当前状态不支持筛选功能！"
                                });
                           }else {
                               this.phoneModelFilterList = value
                               this.onPageChange(1)                            }
                        }
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
                        sortable: true,
                        filters: [
                            {
                                label:"idle",
                                value:"idle"
                            },
                            {
                                label:"busy",
                                value:"busy"
                            },
                            {
                                label:"offline",
                                value:"offline"
                            },
                            {
                                label:"error",
                                value:"error"
                            }],
                        filterRemote(value){
                            if(this.propDeviceStatus){
                                this.$Modal.info({
                                    title: "提示",
                                    content: "只允许查看空闲状态的设备！"
                                });
                            }else if(this.propFilterStatus){
                                this.$Modal.info({
                                    title: "提示",
                                    content: "当前状态不支持筛选功能！"
                                });
                            }
                            else {
                                this.statusFilterList = value
                                this.onPageChange(1)
                            }
                        }
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
                data: [],
                dataTotal: 0,
                offset: 0,
                // Add device
                showAddDevice: false,
                // Multi Selection
                selectedDevice: [],
                currentPage:1,
                selection:[],
                statusFilterList:[],
                phoneModelFilterList:[],
            }
        },
        methods: {
            // Data loading
            refresh(data){
                if(data!==undefined){
                    this.data = data
                    return
                }
                this.loading = true
                let deviceStatusCondition = ""
                if(this.statusFilterList.length>0){
                    deviceStatusCondition = "&status__in="+"ReefList["+this.statusFilterList.join("{%,%}")+"]"
                }
                if(this.propDeviceStatus){
                    deviceStatusCondition = "&status=idle"
                }
                let phoneModelCondition = ""
                if(this.phoneModelFilterList.length>0){
                    phoneModelCondition = "&phone_model__phone_model_name__in="+"ReefList["+this.phoneModelFilterList.join("{%,%}")+"]"
                }
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
                        'monitor_index.port' +
                        '&limit=' + this.propPageSize +
                        "&offset=" + this.offset +
                        deviceStatusCondition +
                        phoneModelCondition +
                        "&ordering=id"
                    )
                    .then(response => {
                        this._responseHandle(response);
                    })
                    .catch(reason => {
                        this._requestErrorHandle(reason);
                    })
            },
            _responseHandle(response){
                this.dataTotal = parseInt(response.headers["total-count"])
                this.data = utils.validate(getDeviceListSerializer, response.data['devices'])
                let deviceList = [];
                this.data.forEach(device=>{
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
                    deviceList.push(device.id);
                })
                if(deviceList.length>0)
                    this.$ajax.get("api/v1/cedar/get_device_power_battery_level/?device_id=" + deviceList.join(",") )
                    .then(response=>{
                        response.data.forEach(item=>{
                            this.data.forEach(device=>{
                                if(device.id === item.device)
                                    this.$set(device,"power",item.battery_level)
                            })
                        })
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("电量数据载入失败！")
                    })
                this.loading = false

                /* 将之前已经选中的选项重新勾选 */
                if(this.selection[this.currentPage] !== undefined){
                    let ids = []
                    this.selection[this.currentPage].forEach(item=>{
                        ids.push(item.id)
                    })
                    for(let i=0; i<this.data.length; ++i){
                        if(ids.includes(this.data[i].id)){
                            this.data[i]._checked = true
                        }
                    }
                }
            },
            _requestErrorHandle(reason){
                if (config.DEBUG) console.log(reason)
                this.$Message.error("载入失败")
            },
            // Table control
            getDeviceColumn() {
                let data = []
                if(this.propMultiSelect) {
                    data.push({
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    })
                }
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
            toggleSelect(index){
                this.$refs.table.toggleSelect(index)
            },
            getSelection(){
                let selection = []
                this.selection.forEach(items=>{
                    selection = selection.concat(items)
                })
                return selection
            },
            getData(){
                return this.data
            },
            // Table event
            onRowClick(row, index){
                this.$emit("on-row-click", row, index)
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
            onPageChange(page){
                this.offset = this.propPageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
            onSelectionChange(selection){
                this.selection[this.currentPage] = selection
            }
        },
        created() {
            if(this.propAutoLoad)
                this.refresh()
            this.$ajax.get("api/v1/cedar/get_device_phone_model/")
                .then(response=>{
                    let phoneModelList = utils.validate(getPhoneModelSerializer,response.data.device)
                    let  phoneModelFilters = []
                    phoneModelList.forEach(item=>{
                        phoneModelFilters.push({label:item.phone_model_name,value:item.phone_model_name})
                    })
                    this.deviceColumn.phone_model.filters = phoneModelFilters;
                })
                .catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("获取设备型号失败")
                })
        },
        mounted() {
            this.deviceColumnChecked = localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN").split(",")
            this.onTableColumnChange()
        }
    }
</script>

<style scoped>

</style>