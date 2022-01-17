<template>
    <div>
        <slot name="detail"></slot>
        <Row type="flex" justify="space-between" style="margin-bottom: 8px;">
            <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                           @on-change="onTableColumnChange">
                <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
            </CheckboxGroup>
        </Row>
        <Row style="margin-bottom: 16px">
            <div v-show="propShowCabinetSelect" style="float: left;margin-right: 50px;">
                <span>机柜：</span>
                <Select v-model="cabinetSelected"  style="width:200px;" clearable @on-change="onSelectedChange">
                    <Option v-for="item in cabinetList" :value="item.id">{{ item.cabinet_name }}</Option>
                </Select>
            </div>
        </Row>
        <Table ref="table" border :highlight-row="propHighLight" :columns="tableDeviceColumn" :data="data"
               @on-row-click="onRowClick" :loading="loading" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple @on-change="onPageChange" style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";


    import utils from "../lib/utils"
    import config from "../lib/config"

    const getDeviceListSerializer = [
        {
            id: "number",
            serial_number: "string",
            custom_name: "string",
            phone_model: {
                id:"number",
                phone_model_name: "string",
            },
            device:{
                id:null,
                device_name:""
            },
            status: "string",
        }
    ]

    const getPhoneModelSerializer = [
        {
            id: "number",
            phone_model_name: "String",
        }
    ]

    export default {
        name: "CompSubsidiaryDeviceList",
        components: { },
        props:{
            propMultiSelect:{
                type:Boolean,
                default:false
            },
            propShowCabinetSelect:{
                type:Boolean,
                default:true
            },
            propCabinetId:{
                type:Number,
            },
            propHighLight:{
                type:Boolean,
                default:true
            },
            propPhoneModel:{
                type:String,
            },
            propStatus:{
                type:Boolean,
                default:false
            },
            propAutoLoad:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                // Data loading
                loading: false,
                // Device table
                deviceColumn: {
                    "serial_number": {
                        title: "设备编号",
                        key: "serial_number",
                        sortable: true
                    },
                    "custom_name": {
                        title: "自定义名称",
                        key: "custom_name",
                        sortable: true
                    },
                    "phone_model": {
                        title: "设备型号",
                        key: "phone_model",
                        sortable: true,
                        filters:[],
                        filterRemote(value){
                            this.phoneModelFilterList = value
                            this.onPageChange(1)
                        }
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
                                label:"unbound",
                                value:"unbound"
                            }],
                        filterRemote(value){
                            if(this.propStatus){
                                this.$Modal.info({
                                    title: "提示",
                                    content: "当前状态不支持筛选功能！"
                                });
                            }else {
                                this.statusFilterList = value
                                this.onPageChange(1)
                            }
                        }
                    },
                    "device": {
                        title: "关联主机",
                        key: "device",
                        sortable: true
                    },
                },
                deviceColumnChecked: [],
                tableDeviceColumn: [],
                // Devices data
                data: [],
                dataTotal: 0,
                offset: 0,
                pageSize:config.DEFAULT_PAGE_SIZE,
                // Multi Selection
                currentPage:1,
                selection:[],
                statusFilterList:[],
                phoneModelFilterList:[],
                cabinetList:[],
                cabinetSelected:null,
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
                if(this.propStatus){
                    deviceStatusCondition = "&status=unbound"
                }

                let phoneModelCondition = ""
                if(this.phoneModelFilterList.length>0){
                    phoneModelCondition = "&phone_model__phone_model_name__in="+"ReefList["+this.phoneModelFilterList.join("{%,%}")+"]"
                }

                let cabinetCondition = ""
                if(this.propShowCabinetSelect){
                    if(this.cabinetSelected!==null)
                        cabinetCondition = "&cabinet=" + this.cabinetSelected
                }else {
                    if(this.propCabinetId!==null)
                        cabinetCondition = "&cabinet=" + this.propCabinetId
                }

                this.$ajax.get('api/v1/cedar/subsidiary_device/?fields=id,' +
                        'serial_number,' +
                        'phone_model,' +
                        'phone_model.phone_model_name,' +
                        'phone_model.id,' +
                        'custom_name,' +
                        'ip_address,' +
                        'status,' +
                        'device,device.id,device.device_name' +
                        "&is_active=True" +
                        '&limit=' + this.pageSize +
                        "&offset=" + this.offset +
                        deviceStatusCondition +
                        phoneModelCondition +
                        cabinetCondition +
                        "&ordering=id" )
                    .then(response=>{
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = utils.validate(getDeviceListSerializer, response.data['subsidiarydevice'])
                        this.data.forEach(device=>{
                            device.phone_model_id = device.phone_model.id
                            device.phone_model = device.phone_model.phone_model_name
                            device.device = device.device.device_name
                        })
                        this.loading = false

                        /* 将之前已经选中的选项重新勾选 */
                        let arr = []
                        this.selection.forEach(selected=>{
                            arr = arr.concat(selected)
                        })
                        if(arr.length>0){
                            let ids = []
                            arr.forEach(item=>{
                                ids.push(item.id)
                            })
                            for(let i=0; i<this.data.length; ++i){
                                if(ids.includes(this.data[i].id)){
                                    this.data[i]._checked = true
                                }
                            }
                        }
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.loading = false
                        this.$Message.error("获取僚机列表失败 " + error.response.data.description)
                })
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
                localStorage.setItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN",
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
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.refresh()
            },
            onSelectionChange(selection){
                this.selection[this.currentPage] = selection
            },
            getThisSelection(){
                return this.selection;
            },
            setSelection(selection){
                this.selection = selection;
            },
            getCabinetList() {
                this.$ajax.get("api/v1/cedar/cabinet/?fields=cabinet_name,id")
                    .then(response => {
                        this.cabinetList = response.data.cabinets
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            },
            //机柜筛选
            onSelectedChange(val){
                if(val===undefined)
                    this.cabinetSelected = null
                this.onPageChange(1)
            },

        },
        watch:{

        },
        created() {
            this.pageSize = utils.getPageSize();
            if(this.propAutoLoad)
                this.refresh()
            //准备机型筛选需要的数据
            this.$ajax.get("api/v1/cedar/get_device_phone_model/?device_type=subsidiary_device")
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
            if(!localStorage.getItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN")||localStorage.getItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN")==="")
                localStorage.setItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN",
                    "serial_number,custom_name,phone_model,status")
            this.deviceColumnChecked = localStorage.getItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN").split(",")
            this.onTableColumnChange()
            this.getCabinetList()
        }
    }
</script>

<style scoped>

</style>
