<template>
    <div>
        <slot name="detail"></slot>
        <Modal v-if="propAddMode" v-model="showAddDevice" :closable="false" :footer-hide="true">
            <comp-add-device ref="addDevice" @afterDeviceAddSuccess="afterDeviceAddSuccess"></comp-add-device>
        </Modal>
        <Modal v-if="propAddMode" v-model="showAddOtherDevice" :closable="false" :footer-hide="true">
            <comp-add-other-device ref="addOtherDevice" @afterDeviceAddSuccess="afterDeviceAddSuccess"></comp-add-other-device>
        </Modal>
        <Row type="flex" justify="space-between" style="margin-bottom: 8px;">
            <Col span="18">
                <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                               @on-change="onTableColumnChange">
                    <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </Col>
            <Col v-if="propAddMode">
                <Button icon="md-add" style="margin-right: 20px;border-color: #1bbc9c;color: #1bbc9c" @click="onAddOtherDeviceClick">其他设备</Button>
                <Button icon="md-add" type="primary" @click="onAddDeviceClick">ADB设备</Button>
            </Col>
        </Row>
        <Row style="margin-bottom: 16px">
            <Col span="16">
                <div v-show="propShowCabinetSelect" style="float: left;margin-right: 50px;">
                    <span>机柜：</span>
                    <!--<Select v-model="cabinetSelected" style="width:200px" clearable  @on-change="onSelectedChange">-->
                        <!--<OptionGroup v-for="types in cabinetList" :label="types.type">-->
                            <!--<Option v-for="cabinets in types.val" :value="cabinets.id" :key="cabinets.id">{{ cabinets.cabinet_name }}</Option>-->
                        <!--</OptionGroup>-->
                    <!--</Select>-->
                    <Cascader style="display: inline-block" :data="cabinetList" change-on-select @on-change="onSelectedChange"></Cascader>
                </div>
                <div v-show="propShowSelectNumber">
                    <span>僚机数量：</span>
                    <Select v-model="subsidiaryDeviceSelected"  style="width:200px;" clearable @on-change="onSubsidiaryDeviceSelect">
                        <Option v-for="item in subsidiaryDeviceNum" :value="item">{{ item }}</Option>
                    </Select>
                </div>
            </Col>
            <Col span="8">
                <div v-show="propShowSearch" style="float: right;width:300px;" v-click-outside="onClickOutSide">
                    <Input v-model="deviceKeyword" clearable search enter-button="Search" placeholder="输入设备自定义名称" class="search-input"
                           @on-focus="isShowHistory=true" @on-search="onDeviceSearch" @on-clear="deviceKeyword='';onPageChange(1)"/>
                    <Card v-show="isShowHistory" style="position:absolute;width: 300px;z-index: 100;margin-top: 5px;">
                        <Row>历史搜索<Icon style="float: right;" type="ios-trash-outline" size="18" @click="emptyHistory" /></Row>
                        <div class="history-box" v-for="(item,index) in historyList" :key="index" @click="onSearchHistory(item)">{{ item }}</div>
                        <Row v-show="historyList.length===0" style="margin-top: 10px;color: #cccccc;cursor: default;">暂无历史搜索记录</Row>
                    </Card>
                </div>
            </Col>
        </Row>

        <Table ref="table" border :highlight-row="propHighLight" :columns="tableDeviceColumn" :data="data" @on-row-click="onRowClick" :loading="loading" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";
    import CompAddDevice from "./CompAddDevice"
    import CompAddOtherDevice from "./CompAddOtherDevice"
    import utils from "../lib/utils"
    import config from "../lib/config"
    import clickOutside from '../../node_modules/view-design/src/directives/clickoutside';


    const getDeviceListSerializer = [
        {
            id: "number",
            device_label: "string",
            device_name: "string",
            phone_model: {
                id:"number",
                phone_model_name: "string",
                cpu_name: "string"
            },
            rom_version: {
                version: "string"
            },
            subsidiary_device_count:"number",
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
            ],
            paneslot: {
                id: "number",
                row: "number",
                col: "number",
                paneview: {
                    name: "string"
                }
            }

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
        components: {CompDeviceDetail, CompAddDevice, CompAddOtherDevice},
        directives: { clickOutside },
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
            propDeviceStatus:{
                type: Boolean,
                default: false
            },
            propFilterStatus:{
                type: Boolean,
                default: false
            },
            propDefaultTboard:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            propHighLight:{
                type: Boolean,
                default: false
            },
            propDeviceSlot:{
                type: Boolean,
                default: false
            },
            propDeviceSlotError:{  //error device in paneView
                type: Boolean,
                default: false
            },
            propCabinet:{  //select device in cabinet
                type: Number,
                default:null
            },
            propShowCabinetSelect:{  //select device in cabinet
                type: Boolean,
                default: true
            },
            propShowSelectNumber:{
                type: Boolean,
                default: true
            },
            propShowSearch:{
                type: Boolean,
                default: true
            },
            propPaneviewType:{
                type: Boolean,
                default: false
            },
            propCabinetType:{
                type:String,
            },
            propPerfCabinet:{
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
                                label: 'occupied',
                                value: 'occupied'
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
                    },
                    "subsidiary_device_count":{
                        title: "僚机数量",
                        key: "subsidiary_device_count",
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
                showAddOtherDevice:false,
                // Multi Selection
                selectedDevice: [],
                currentPage:1,
                selection:[],
                selectionDev:{},
                currentPageSelection:{},
                pageSize:config.DEFAULT_PAGE_SIZE,
                statusFilterList:[],
                phoneModelFilterList:[],
                tboard:[],
                cabinetList:[],
                cabinetSelected:null,
                cabinetTypeSelected:"",
                subsidiaryDeviceSelected:null,
                subsidiaryDeviceNum:[],
                deviceKeyword:"",
                isShowHistory:false,  //历史记录板块
                historyList:[],  //历史记录数据（最多显示15条）
                step:1
            }
        },
        methods: {
            // Data loading
            refresh(data){
                if(data!==undefined){
                    this.data = data
                    return
                }
                this.currentPageSelection = {}
                let deviceKeywordCondition = ""
                if(this.deviceKeyword.trim()!==""){
                    deviceKeywordCondition = '&device_name__icontains=' +  this.deviceKeyword.trim()
                }
                this.loading = true
                let deviceStatusCondition = ""
                let deviceSlotCondition = ""
                let deviceSlotErrorCondition = ""
                if(this.statusFilterList.length>0){
                    deviceStatusCondition = "&status__in="+"ReefList["+this.statusFilterList.join("{%,%}")+"]"
                }
                if(this.propDeviceStatus){
                    deviceStatusCondition = "&status=idle"
                }
                if(this.propDeviceSlot){
                    deviceSlotCondition = "&paneslot__isnull=True"
                }
                if(this.propDeviceSlotError){
                    deviceSlotErrorCondition = "&paneslot__isnull=False&status=error"
                }
                let paneviewTypeCondition = ""
                if(this.propPaneviewType)
                    paneviewTypeCondition = "&paneslot__paneview__type=test_box"
                let cabinetCondition = ""
                if(this.propShowCabinetSelect){
                    if(this.cabinetSelected!==null)
                        cabinetCondition = "&cabinet=" + this.cabinetSelected
                }else {
                    if(this.propCabinet!==null)
                        cabinetCondition = "&cabinet=" + this.propCabinet
                }
                let deviceNumCondition = ""
                if(this.subsidiaryDeviceSelected)
                    deviceNumCondition = "&subsidiary_device_count=" +this.subsidiaryDeviceSelected
                let phoneModelCondition = ""
                if(this.phoneModelFilterList.length>0){
                    phoneModelCondition = "&phone_model__phone_model_name__in="+"ReefList["+this.phoneModelFilterList.join("{%,%}")+"]"
                }
                let cabinetTypeCondition = ""
                if(this.propCabinetType){
                    cabinetTypeCondition = "&cabinet__type=" + this.propCabinetType
                }else if(this.propPerfCabinet){
                    cabinetTypeCondition = "&cabinet__type__in=ReefList[Tcab_5{%,%}Tcab_5L{%,%}Tcab_5D{%,%}Tcab_5se]"
                }else {
                    if(this.cabinetTypeSelected){
                        cabinetTypeCondition = "&cabinet__type=" + this.cabinetTypeSelected
                    }
                }
                let tboardCondition = ""
                if(this.tboard.length>0)
                    tboardCondition = "&tboard=" + this.tboard[0].id;
                this.$ajax
                    .get('api/v1/cedar/device/?fields=' +
                        'id,' +
                        'device_label,' +
                        'phone_model,' +
                        'phone_model.phone_model_name,' +
                        'phone_model.id,' +
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
                        'monitor_index.port,' +
                        'paneslot,' +
                        'paneslot.id,' +
                        'paneslot.row,' +
                        'paneslot.col,' +
                        'paneslot.paneview,' +
                        'paneslot.paneview.name,' +
                        'cabinet,cabinet.ip_address,cabinet.type,' +
                        'subsidiary_device_count' +
                        '&limit=' + this.pageSize +
                        "&offset=" + this.offset +
                        deviceStatusCondition +
                        phoneModelCondition +
                        tboardCondition +
                        deviceSlotCondition +
                        deviceSlotErrorCondition +
                        cabinetCondition +
                        paneviewTypeCondition +
                        deviceNumCondition +
                        cabinetTypeCondition +
                        deviceKeywordCondition +
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
                    device.phone_model_id = device.phone_model.id
                    device.cpu_name = device.phone_model.cpu_name
                    device.phone_model = device.phone_model.phone_model_name
                    device.rom_version = device.rom_version.version
                    device.android_version = device.android_version.version
                    device.powerport = device.powerport.port
                    device.paneslot = device.paneslot.paneview.name + '(' + (device.paneslot.row+1) + ',' + (device.paneslot.col+1) + ')'
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
                    /* 将之前已经选中的选项重新勾选 */
                    if(this.selection.length>0)
                        this.selection.forEach(selected=>{
                            if (device.id === selected.id){
                                device._checked = true
                                this.$set(this.currentPageSelection, device.id, 'exist')
                            }
                        })
                })
                if(deviceList.length>0)
                    this.$ajax.get("api/v1/cedar/get_device_power_battery_level/?device_id=" + deviceList.join(",") )
                    .then(response=>{
                        response.data.forEach(item=>{
                            this.data.forEach(device=>{
                                if(device.id === item.device){
                                    if(item.battery_level){
                                        this.$set(device,"power",item.battery_level + "%");
                                        return;
                                    }
                                    this.$set(device,"power","无电量信息")
                                }
                            })
                        })
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("电量数据载入失败！")
                    })
                this.loading = false

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
            onAddOtherDeviceClick(){
                this.$refs.addOtherDevice.reset()
                this.showAddOtherDevice=true
            },
            afterDeviceAddSuccess(device){
                this.showAddDevice = false
                this.showAddOtherDevice = false
                this.refresh()
            },
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionDev[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的device')
                        this.$set(this.selectionDev, value.id, value)    //所有的已选择device  包括新选择的device
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelected  当前页已选择device
                    }
                })
                //用上个步骤得到的当前页已选择的device-id 和 实际表格返回的 selection做比对，如果对上，则不做任何操作
                // 如果对不上，则表示多了一个，即用户点击了一次取消，就用$delete方法将多出来的这条数据删除this.$delete(obj,key);
                for (let item in this.currentPageSelection) {
                    let i = 0
                    for (i; i < selection.length; i++) {
                        if (parseInt(item) === selection[i].id) {
                            break
                        }
                    }
                    if (i === selection.length) {
                        //console.log('不再勾选id为' + item + '的job')
                        this.$delete(this.selectionDev, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionDev)
                this.$emit("selected-count",this.selection.length)
                this.$emit("get-selection",this.selection)
            },
            getThisSelection(){
                return this.selection;
            },
            setSelection(selection){
                this.selection = selection;
            },
            getCabinetList() {
                this.$ajax.get("api/v1/cedar/get_cabinet_type_info/?data_type=cabinet_type_data")
                    .then(response => {
                        let cabinetList = []
                        if(this.propCabinetType){
                            for (let i = 0; i < response.data.length; i++) {
                                if(response.data[i].type===this.propCabinetType){
                                    cabinetList = [].concat(response.data[i])
                                    break;
                                }
                            }
                        } else
                            cabinetList = response.data
                        // 拼 成 级 联 选 择 需 要 的 格 式
                        let data = []
                        cabinetList.forEach(item=>{
                            let children = []
                            item.val.forEach(cabinet=>{
                                children.push({
                                    value: cabinet.id,
                                    label: cabinet.cabinet_name
                                })
                            })
                            data.push({
                                value: item.type,
                                label: item.type,
                                children: children
                            })
                        })
                        this.cabinetList = data
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            },
            onSelectedChange(val){
                if(val.length===0){
                    this.cabinetTypeSelected = ""
                    this.cabinetSelected = null
                }else if(val.length===1){
                    this.cabinetTypeSelected = val[0]
                    this.cabinetSelected = null
                }else if(val.length===2){
                    this.cabinetTypeSelected = val[0]
                    this.cabinetSelected = val[1]
                }
                this.onPageChange(1)
            },
            getSubsidiaryDeviceNum(){
                this.$ajax.get("api/v1/cedar/filter_subsidiary_device_count/")
                    .then(response=>{
                        this.subsidiaryDeviceNum = response.data
                    }).catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.$Message.error("获取僚机数量失败")
                })
            },
            onSubsidiaryDeviceSelect(val){
                if(val===undefined)
                    this.subsidiaryDeviceSelected = null
                this.onPageChange(1)
            },
            onDeviceSearch(){
                if(this.deviceKeyword.trim()===""){
                    this.onPageChange(1)
                    return
                }
                if(!this.historyList.includes(this.deviceKeyword.trim())){
                    this.historyList.unshift(this.deviceKeyword.trim())
                    if(this.historyList.length>15)
                        this.historyList.pop()
                    localStorage.setItem('historyList',JSON.stringify(this.historyList))
                }else {
                    let i = this.historyList.indexOf(this.deviceKeyword.trim())
                    this.historyList.splice(i,1)
                    this.historyList.unshift(this.deviceKeyword.trim())
                    localStorage.setItem('historyList',JSON.stringify(this.historyList))
                }
                this.onPageChange(1)
            },
            //按自定义名称搜索部分  并且加上历史记录功能
            onClickOutSide(e){
                this.isShowHistory = false
            },
            //点击历史记录，直接搜索
            onSearchHistory(item){
                this.deviceKeyword = item
                this.onPageChange(1)
            },
            //清空历史记录
            emptyHistory(){
                localStorage.removeItem('historyList');
                this.historyList = []
            }
        },
        watch:{
            propDefaultTboard:{
                handler: function(val){
                    this.tboard = _.cloneDeep(val)
                },
                immediate: true
            },
            propCabinetType:{
                handler: function(val){
                    this.refresh()
                    this.getCabinetList()
                },
            }
        },
        created() {
            this.pageSize = utils.getPageSize();
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
            if(!localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN")||localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN")==="")
                localStorage.setItem("device-management:DEFAULT_DEVICE_COLUMN",
                    "device_label,device_name,phone_model,status")
            this.deviceColumnChecked = localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN").split(",")
            if (this.propDeviceSlotError) {
                this.$delete(this.deviceColumn, "status")
                this.$set(this.deviceColumn, "paneslot",{
                    title: "位置",
                    key: "paneslot",
                    sortable: true
                })
                if(this.deviceColumnChecked.indexOf("status") > -1)
                    this.deviceColumnChecked.splice(this.deviceColumnChecked.indexOf("status"),1);
            }else {
                if(this.deviceColumnChecked.indexOf("paneslot") > -1)
                    this.deviceColumnChecked.splice(this.deviceColumnChecked.indexOf("paneslot"),1);
            }
            this.onTableColumnChange()
            this.getCabinetList()
            this.getSubsidiaryDeviceNum()
            if(JSON.parse(localStorage.getItem('historyList'))){
                this.historyList = JSON.parse(localStorage.getItem('historyList'))
            }
        }
    }
</script>

<style scoped>
    /deep/.ivu-page-simple .ivu-page-simple-pager input{
        width: 45px;
    }
    /deep/.search-input .ivu-input-icon-clear{
        margin-right: 76px!important;
    }
    .history-box{
        display: inline-block;
        border-radius: 20px;
        background: #f2f2f2;
        padding:3px 10px;
        margin: 10px 10px 0 0;
        cursor: pointer;
    }
</style>
