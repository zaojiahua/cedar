<template>
    <Card :title="device.device_name + ' (' + device.device_label + ')'" style="position: relative;" dis-hover>
        <Form :model="device" :label-width="90">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="device.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">编号</b>
                <Input v-model="device.device_label" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">安卓版本</b>
                <Input v-model="device.android_version.version" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">机柜</b>
                <Input v-model="device.cabinet.cabinet_name" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">CPU ID</b>
                <Input v-model="device.cpu_id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">IP</b>
                <Input v-model="device.ip_address" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">ROM版本</b>
                <Input v-model="device.rom_version.version" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">加入时间</b>
                <Input v-model="device.start_time_key" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">状态</b>
                <Input v-model="device.status" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <Divider></Divider>
            <FormItem>
                <b slot="label">自定义名称</b>
                <Input v-model="device.device_name" :disabled="!editable"></Input>
            </FormItem>
        </Form>
        <Collapse :value="[0,1,2,3,4]">
            <Panel>机型信息
                <div  slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">手机型号</b>
                            <Input v-model="device.phone_model.phone_model_name" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label"><span class="need">*</span>Xdpi</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.x_dpi"></InputNumber>
                        </FormItem>
                        <FormItem>
                            <b slot="label"><span class="need">*</span>Ydpi</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.y_dpi"></InputNumber>
                        </FormItem>
                        <FormItem>
                            <b slot="label"><span class="need">*</span>X边框厚度</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.x_border"></InputNumber>
                        </FormItem>
                        <FormItem>
                            <b slot="label"><span class="need">*</span>Y边框厚度</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.y_border"></InputNumber>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>僚机设备信息
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div v-for="(item,index) in device.subsidiarydevice">
                            <Divider>僚机{{ index+1 }}</Divider>
                            <FormItem>
                                <b slot="label">串号</b>
                                <Input v-model="item.serial_number" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice&&(index+1===device.subsidiarydevice.length)" type="md-remove-circle"
                                      @click="deleteSubsidiary(item.id,index)" style="margin-left: 5px" size="20" color="red"/>
                            </FormItem>
                            <FormItem>
                                <b slot="label">IP</b>
                                <Input v-model="item.ip_address" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                            </FormItem>
                        </div>
                        <div v-if="device.subsidiarydevice.length<3">
                            <Divider>僚机{{ device.subsidiarydevice.length+1 }}</Divider>
                            <Button :disabled="!propSubsidiaryDevice" type="primary" style="width: 80%;margin-left: 10%;" @click="addSubsidiary(device.subsidiarydevice.length+1)">
                                <Icon type="ios-add-circle-outline" size="20" />
                            </Button>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel>温度感应片配对
                <CheckboxGroup slot="content" v-model="selectedTempPorts">
                    <Checkbox v-for="item in tempPorts" :label="item.port" :key="item.id" :disabled="isDisabled(item.port,disableTempPorts)">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>智能充电口配对
                <CheckboxGroup  slot="content" v-model="selectedPowerPorts" @on-change="powerPortCheckbox">
                    <Checkbox  v-for="item in powerPorts" :label="item.id" :key="item.id" :disabled="isDisabled(item.id,disablePowerPorts)">{{item.port}}</Checkbox >
                </CheckboxGroup >
            </Panel>
            <Panel>工业相机配对
                <CheckboxGroup slot="content" v-model="selectedMonitorPorts" @on-change="monitorPortCheckbox">
                    <Checkbox v-for="item in monitorPorts" :label="item.id" :key="item.id" :disabled="!editable">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>其他
                <p  slot="content">
                    <span>是否开启 AITester </span>
                    <i-switch v-model="openSwitch" style="float: right" :disabled="!editable"/>
                </p>
            </Panel>
        </Collapse>
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;" v-if="editable" v-show="device.status!=='offline'">
            <Col>
                <Button type="error" style="margin-right: 16px;" @click="deleteDevice">移除设备</Button>
                <Button type="primary" @click="reconnectDevice">重新连接</Button>
            </Col>
            <Col>
                <Button type="primary" style="margin-right: 16px;" @click="updateDevice">保存</Button>
                <Button @click="cancelConfig">取消</Button>
            </Col>
        </Row>
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;" v-if="propDeviceSlot">
            <Button type="error" @click="releaseDeviceSlot">解除设备关联</Button>
        </Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal class="closeBtn" v-model="showAddModal"  :mask-closable="false" footer-hide>
            <Comp-add-subsidiary-device ref="addDevice" :prop-device-id="device.id" :prop-index="addDeviceIndex" :prop-ip="device.cabinet.ip_address"
                                        @onClose="showAddModal=false" @afterDeviceAddSuccess="onDeviceAddSuccess"></Comp-add-subsidiary-device>
        </Modal>

    </Card>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"
    import CompAddSubsidiaryDevice from "./CompAddSubsidiaryDevice";

    const serializer = {
            deviceSerializer: {
                id: "number",
                auto_test: "boolean",
                device_label: "string",
                android_version: {
                    id: "number",
                    version: "string"
                },
                cabinet: {
                    id: "number",
                    cabinet_name: "string",
                    ip_address: "string"
                },
                cpu_id: "string",
                ip_address: "string",
                phone_model: {
                    id: "number",
                    phone_model_name: "string",
                    x_border: "number",
                    y_border: "number",
                    x_dpi: "number",
                    y_dpi: "number",
                },
                rom_version: {
                    id: "number",
                    version: "string"
                },
                start_time_key: "date",
                status: "string",
                device_name: "string",
                tempport: [
                    {
                        id: "number",
                        port: "string",
                        description: "string"
                    }
                ],
                powerport:
                {
                    id: "number",
                    port: "string"
                },
                monitor_index: [
                    {
                        id: "number",
                        port: "string"
                    }
                ],
                subsidiarydevice:[
                    {
                        id: "number",
                        serial_number: "string",
                        ip_address: "string",
                        order: "number"
                    }
                ]
            },
            tempPortSerializer: {
                tempports: [
                    {
                        id: "string",
                        port: "string",
                        description: "string",
                        device: {
                            id: "string"
                        }
                    }
                    ]
            },
            powerPortSerializer: {
                powerports: [
                    {
                        id: "string",
                        port: "string",
                        device: {
                            id: "string"
                        }
                    }
                    ]
            },
            monitorPortSerializer: {
                monitorports: [
                    {
                        id: "string",
                        port: "string",
                        device: {
                            id: "string"
                        }
                    }
                ]
            },
        }
    export default {
        name: "CompDeviceDetail",
        components:{ CompAddSubsidiaryDevice },
        props:{
            editable:{
                type: Boolean,
                default: false
            },
            propDeviceSlot:{
                type: Boolean,
                default: false
            },
            propSubsidiaryDevice:{   //是否可对僚机进行操作
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                // Device data
                device: utils.validate(serializer.deviceSerializer, {}),
                tempPorts: utils.validate(serializer.tempPortSerializer, {}).tempports,
                powerPorts: utils.validate(serializer.powerPortSerializer, {}).powerports,
                monitorPorts: utils.validate(serializer.monitorPortSerializer, {}).monitorports,
                disableTempPorts:[],
                disablePowerPorts:[],
                selectedTempPorts:[],
                selectedPowerPorts: [],
                selectedMonitorPorts: [],
                selectedPowerPorts_copy:[],
                selectedMonitorPorts_copy:[],
                devicePowerPorts:"",
                deviceMonitorPorts:"",
                spinShow:false,
                openSwitch:true,
                showAddModal:false,
                addDeviceIndex:null,
            }
        },
        methods: {
            // Delete Device
            deleteDevice(){
                let device_id = this.device.device_label
                let device_status = this.device.status
                let detailComp = this
                if(device_status==="busy"){
                    this.$Modal.confirm({
                        title: "警告！",
                        content: "当前设备正在执行任务，确定要停止任务并将该设备从系统中移除？",
                        onOk() {
                            detailComp.deleteAjax(device_id,device_status)
                        }
                    })
                }else {
                    this.$Modal.confirm({
                        title: "警告！",
                        content: "您确定要从系统中移除该装置吗？",
                        onOk(){
                            detailComp.deleteAjax(device_id,device_status)
                        }
                    });
                }
            },
            reconnectDevice(){
                if (this.device.status==="offline"){
                    this.$Message.error("离线设备请直接走注册流程")
                }
                else{
                this.$ajax.post("http://" + this.device.cabinet.ip_address + ":5000"+"/door/wifi_port/",
                    {cpu_id:this.device.device_label}
                    ).then(response=>{
                    if(response.data.state==="DONE"){
                        this.$Message.success("重连成功")}
                    else{
                        this.$Message.error({content:error.response.data.description,duration: 6})
                    }
                }).catch(error=>{
                    this.$Message.error("重连失败")
            })}},
            deleteAjax(device_id,device_status){
                this.spinShow = true;
                this.$ajax.post("api/v1/coral/release_device/",{
                    ip_address:this.device.ip_address,
                    device_label:device_id,
                    tempport:this.device.tempport
                }).then(response=>{
                    this.spinShow = false;
                    if(response.data==="success"){
                        this.$Message.success("该设备已从系统中移除");
                        this.$emit('after-device-delete')
                    } else{
                        this.$Message.error("设备移除失败！");
                    }
                }).catch(error=>{
                    this.spinShow = false;
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("设备移除失败！");
                })
            },
            // Load data
            refresh(device_id){
                this.spinShow = true;
                let ajax = this.$ajax
                this.selectedTempPorts = []
                this.selectedPowerPorts = []
                this.selectedMonitorPorts = []
                this.disablePowerPorts = [];
                this.disableTempPorts = [];
                ajax.all(
                    [
                        ajax.get(
                            "api/v1/cedar/device/"+device_id+"/?fields=" +
                            "id," +
                            "device_label," +
                            "android_version,android_version.id,android_version.version," +
                            "cabinet,cabinet.id,cabinet.cabinet_name,cabinet.ip_address," +
                            "cpu_id," +
                            "ip_address," +
                            "phone_model,phone_model.id,phone_model.phone_model_name," +
                            "phone_model.x_border,phone_model.y_border,phone_model.x_dpi,phone_model.y_dpi," +
                            "rom_version,rom_version.id,rom_version.version," +
                            "start_time_key," +
                            "status," +
                            "device_name," +
                            "tempport,tempport.id,tempport.port,tempport.description," +
                            "powerport,powerport.id,powerport.port," +
                            "monitor_index,monitor_index.id,monitor_index.port," +
                            "auto_test," +
                            "subsidiarydevice,subsidiarydevice.id,subsidiarydevice.serial_number,subsidiarydevice.ip_address,subsidiarydevice.order"+
                            "&ordering=subsidiarydevice.order"
                        ),
                        ajax.get("api/v1/cedar/temp_port/?fields=" +
                            "id," +
                            "port," +
                            "description," +
                            "device," +
                            "device.id," +
                            "status" +
                            "&ordering=port"),
                        ajax.get("api/v1/cedar/power_port/?fields=" +
                            "id," +
                            "port," +
                            "device," +
                            "device.id," +
                            "status"+
                            "&ordering=port"),
                        ajax.get("api/v1/cedar/monitor_port/?fields=" +
                            "id," +
                            "port," +
                            "device," +
                            "device.id" +
                            "&ordering=port")
                    ]
                ).then(ajax.spread((deviceResponse, tempPortResponse, powerPortResponse, monitorPortResponse)=>{
                    this.device = utils.validate(serializer.deviceSerializer, deviceResponse.data)
                    this.tempPorts = utils.validate(serializer.tempPortSerializer, tempPortResponse.data).tempports
                    this.powerPorts = utils.validate(serializer.powerPortSerializer, powerPortResponse.data).powerports
                    this.monitorPorts = utils.validate(serializer.monitorPortSerializer, monitorPortResponse.data).monitorports

                    //tempPort Detail
                    let deviceTempPorts = []     //当前device下选中的port， 可选中,可取消状态
                    this.device.tempport.forEach(port=>{
                        deviceTempPorts.push(port.port)
                    })

                    this.tempPorts.forEach(port=>{
                        if(deviceTempPorts.includes(port.port)){
                            this.selectedTempPorts.push(port.port);
                        }
                        else if (port.status==="busy"){
                            this.disableTempPorts.push(port.port);
                            this.selectedTempPorts.push(port.port);
                        }
                    })

                    //powerPort Detail
                    this.devicePowerPorts = this.device.powerport.id
                    let devicePowerPorts = []     //当前device下选中的port， 可选中,可取消状态
                    devicePowerPorts.push(this.device.powerport.id)
                    this.powerPorts.forEach(port=>{
                        if(devicePowerPorts.includes(port.id)){
                            this.selectedPowerPorts.push(port.id);
                        }else if(port.status==="busy"){
                            this.disablePowerPorts.push(port.id);
                            this.selectedPowerPorts.push(port.id);
                        }
                    })
                    this.selectedPowerPorts_copy = this.selectedPowerPorts

                    //monitorPort Detail
                     this.device.monitor_index.forEach(port=>{
                         this.selectedMonitorPorts.push(port.id)
                         this.deviceMonitorPorts = port.id;
                    })
                    this.selectedMonitorPorts_copy = this.selectedMonitorPorts

                    //对取回的僚机数据按照order进行排序
                    this.device.subsidiarydevice.sort(this.orderSort)

                    //aiTester
                    this.openSwitch = this.device.auto_test
                    this.spinShow = false;
                })).catch(reason => {
                    this.spinShow = false;
                    if(config.DEBUG)
                        console.log(reason)
                    let status = reason.response?reason.response.status : "Network error!"
                    this.$Message.error("读取数据时出错! "+status)
                })

            },
            //ports disable
            isDisabled(port,disablePorts){
                if(disablePorts.indexOf(port)!==-1)
                    return true;
                return false;
            },
            // Update device
            updateDevice(){
                if(this.device.phone_model.x_border===null||this.device.phone_model.y_border===null||this.device.phone_model.x_dpi===null||this.device.phone_model.y_dpi===null){
                    this.$Message.warning("机型信息不能为空！*为必填项");
                    return
                }
                let temperDict = [];
                //将当前设备要配置的温感片提取出来
                let configPorts = this.selectedTempPorts.filter(selectedPort=> {
                    return this.disableTempPorts.indexOf(selectedPort)===-1
                })
                if(configPorts.length>0){
                    configPorts.forEach(port=>{
                        temperDict.push({
                            port:port,
                            description:"desc",     //给温感片加默认备注
                        })
                    })
                }
                //将当前设备要配置的充电口提取出来
                let configPowerPorts = this.selectedPowerPorts.filter(selectedPort=> {
                    return this.disablePowerPorts.indexOf(selectedPort)===-1
                })

                this.spinShow = true;
                this.$ajax.all(
                    [
                        this.$ajax.post("api/v1/coral/set_device_config/",
                            {
                                device_label:this.device.device_label,
                                device_name:this.device.device_name,
                                tempport:temperDict,
                                monitor_index:this.selectedMonitorPorts.length===0 ? null : parseInt(this.selectedMonitorPorts.join(",")),
                                powerport:configPowerPorts.length===0 ? null : parseInt(configPowerPorts.join(",")),
                                auto_test :this.openSwitch
                            }
                        ),
                        this.$ajax.patch("/api/v1/cedar/phone_model/"+ this.device.phone_model.id +"/",
                            {
                                x_border: this.device.phone_model.x_border,
                                y_border: this.device.phone_model.y_border,
                                x_dpi: this.device.phone_model.x_dpi,
                                y_dpi: this.device.phone_model.y_dpi
                            }
                        )
                    ]
                ).then(this.$ajax.spread((configResponse, phoneModelResponse,)=>{
                    this.spinShow = false;
                    if(config.DEBUG) console.log(configResponse.data)
                    if(phoneModelResponse.status===200){
                        this.$Message.success("机型信息保存成功!")
                    }else {
                        this.$Message.error("机型信息保存失败!")
                    }
                    if(configResponse.status===200){
                        this.$Message.success("配置成功")
                        this.$emit('after-device-update', configResponse)
                    }else{
                        this.$Message.error("配置失败")
                    }
                })).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.spinShow = false;
                    this.$Message.error("配置失败")
                })
            },
            cancelConfig(){
                this.$emit('afterDeviceCancel')
            },
            powerPortCheckbox(value){
                if(this.selectedPowerPorts_copy.length!==this.disablePowerPorts.length){
                    if(this.selectedPowerPorts.indexOf(this.devicePowerPorts)!==-1){
                        this.selectedPowerPorts.splice(this.selectedPowerPorts.indexOf(this.devicePowerPorts),1);
                    }
                }
                value.forEach(item=>{
                    if(this.selectedPowerPorts_copy.indexOf(item)===-1){
                        this.devicePowerPorts = item;
                    }
                })
                this.selectedPowerPorts_copy = this.selectedPowerPorts;
            },
            monitorPortCheckbox(value){
                if(this.selectedMonitorPorts_copy.length!==0){
                    if(this.selectedMonitorPorts.indexOf(this.deviceMonitorPorts)!==-1){
                        this.selectedMonitorPorts.splice(this.selectedMonitorPorts.indexOf(this.deviceMonitorPorts),1);
                    }
                }
                value.forEach(item=>{
                    if(this.selectedMonitorPorts_copy.indexOf(item)===-1)
                        this.deviceMonitorPorts = item;
                })
                this.selectedMonitorPorts_copy = this.selectedMonitorPorts;
            },
            // Device remove with paneView
            releaseDeviceSlot(){
                this.$ajax.post("api/v1/cedar/unlink_paneview_device/",{
                    device: this.device.id
                }).then(response=>{
                    this.$emit("after-remove-pane-slot")
                    this.$Message.success("设备解除关联成功")
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("设备解除关联失败，请确认后重试！")
                })
            },
            //对数组中的对象的某个属性排序  根据order排序
            orderSort(obj1,obj2){
                let a=obj1.order;
                let b=obj2.order;
                if(a>b){
                    return 1
                }else if(a<b){
                    return -1
                }else{
                    return 0
                }
            },
            //移除僚机
            deleteSubsidiary(id,index){
                let remove = this
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要移除僚机"+ (index+1) +"吗？",
                    onOk(){
                        remove.spinShow = true
                        remove.$ajax.delete("api/v1/cedar/subsidiary_device/"+ id +"/")
                            .then(response=>{
                                remove.device.subsidiarydevice.splice(index,1)
                                remove.$Message.success("僚机移除成功")
                                remove.spinShow = false
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                remove.$Message.error("僚机移除失败")
                                remove.spinShow = false
                        })
                    }
                })
            },
            //添加僚机
            addSubsidiary(index){
                this.showAddModal = true
                this.addDeviceIndex = index
                this.$refs.addDevice.reset()
            },
            //僚机添加成功以后的操作(在device详情页展示出来)
            onDeviceAddSuccess(){
                this.showAddModal = false
                this.$ajax.get("/api/v1/cedar/subsidiary_device/?fields=id,order,serial_number,ip_address&devices="+this.device.id)
                    .then(response=>{
                        this.device.subsidiarydevice = response.data.subsidiarydevice
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("僚机信息获取失败")
                })
            }

        },
    }
</script>

<style scoped>
     .closeBtn>>>.ivu-modal-close{
        right: 24px;
        top: 24px;
    }
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    .need{
          color: #ff0000;
          margin-right: 5px;
          vertical-align: middle;
      }

</style>
