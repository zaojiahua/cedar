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
                <Input v-model="device.cabinet.cabinet_name+' ( '+device.cabinet.type +' )'" :disabled="true" class="disabled-input"></Input>
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
        <Collapse :value="[0,1,2,3,4,5,6,7,8]">
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
            <Panel v-show="device.status!=='offline'&&device.status!=='error'">僚机设备信息
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div v-for="(deviceItem,index) in device.subsidiary_device_info">
                            <Divider>僚机{{ deviceItem.subsidiary_device_order }}</Divider>
                            <FormItem>
                                <b slot="label">自定义名称</b>
                                <Input v-model="deviceItem.subsidiary_device_custom_name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" style="cursor:pointer;margin-left: 5px" size="20" color="red"
                                      @click="deleteSubsidiary(deviceItem.subsidiary_device_id,deviceItem.subsidiary_device_order)"/>
                            </FormItem>
                            <FormItem v-for="sim in deviceItem.SIMCard_info">
                                <b slot="label">SIM卡{{ sim.order }}</b>
                                <Input v-model="sim.operator + '_' + sim.phone_number" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                            </FormItem>
                            <FormItem v-for="app in deviceItem.account_info">
                                <b slot="label">账号</b>
                                <Input v-model="app.app_name + ' / ' + app.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                            </FormItem>
                        </div>
                        <div v-if="device.subsidiary_device_info.length<3">
                            <Divider></Divider>
                            <Button :disabled="!propSubsidiaryDevice" type="primary" style="width: 80%;margin-left: 10%;" @click="openOrderModal=true;subsidiaryNumber=null">
                                <Icon type="ios-add-circle-outline" size="20" />
                            </Button>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel v-show="device.status!=='offline'&&device.status!=='error'">SIM卡信息
                <Button type="text" @click.stop="unboundAllSources(1)" style="float: right;margin-right: 10%;margin-top: 4px">批量解绑</Button>
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div class="remove-icon">
                            <FormItem>
                                <b slot="label">SIM卡1</b>
                                <Row>
                                    <Input v-model="device.sim1.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice&& !device.sim1.id" type="ios-add-circle"
                                          @click="showAddSimModal=true;simOrder=1" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c"/>
                                    <Icon v-show="propSubsidiaryDevice&&device.sim1.id" type="md-remove-circle"
                                          @click="removeSimCard(device.sim1.id)" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"/>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <b slot="label">SIM卡2</b>
                                <Row>
                                    <Input v-model="device.sim2.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice&& !device.sim2.id" type="ios-add-circle"
                                          @click="showAddSimModal=true;simOrder=2" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c"/>
                                    <Icon v-show="propSubsidiaryDevice&&device.sim2.id" type="md-remove-circle"
                                          @click="removeSimCard(device.sim2.id)" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"/>
                                </Row>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel v-show="device.status!=='offline'&&device.status!=='error'">账号信息
                <Button type="text" @click.stop="unboundAllSources(2)" style="float: right;margin-right: 10%;margin-top: 4px">批量解绑</Button>
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div class="remove-icon">
                            <FormItem v-for="item in device.account">
                                <b slot="label">账号</b>
                                <Row>
                                    <Input v-model="item.app_name+ ' / '+item.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"
                                          @click="removeAppSource(item.id)"/>
                                </Row>
                            </FormItem>
                            <FormItem v-show="propSubsidiaryDevice">
                                <b slot="label">账号</b>
                                <Row>
                                    <Input style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon type="ios-add-circle" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c" @click="showAddAppModal=true"/>
                                </Row>
                            </FormItem>
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
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;" v-if="editable" v-show="device.status!=='offline'&&device.status!=='error'">
            <Col>
                <Button type="error" style="margin-right: 16px;" @click="deleteDevice">移除设备</Button>
                <Button type="primary" @click="reconnectDevice">重新连接</Button>
            </Col>
            <Col>
                <Button type="primary" style="margin-right: 16px;" @click="updateDevice">保存</Button>
                <Button @click="cancelConfig">取消</Button>
            </Col>
        </Row>
        <Row align="middle" type="flex" style="margin-top: 32px;" v-if="propDeviceSlot">
            <Button type="error" @click="releaseDeviceSlot">解除设备关联</Button>
            <Button type="primary" v-show="propShowConfig" style="margin-left: 20px;" @click="onConfigClick">配置机型信息</Button>
        </Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal v-model="openOrderModal" :closable="false" :mask-closable="false" footer-hide width="450">
            <Card>
                <p slot="title">请选择僚机位置</p>
                <div style="margin-bottom: 50px">
                    <span>僚机位置：</span>
                    <RadioGroup v-model="subsidiaryNumber" >
                        <Radio v-for="index in 3" :disabled="subsidiaryOrderList.includes(index)" border :label="index">僚机{{ index }}</Radio>
                    </RadioGroup>
                </div>
                <Row style="text-align: right">
                    <Button @click="openOrderModal=false" style="margin-right: 20px;">取消</Button>
                    <Button type="primary" @click="onOpenSubsidiaryList">确定</Button>
                </Row>
            </Card>

        </Modal>
        <Modal v-model="showAddModal" :fullscreen="true" :transfer="false" :closable="false">
            <comp-subsidiary-device-list ref="addDevice" :prop-show-cabinet-select="false"
                                         :prop-phone-model="device.phone_model.phone_model_name"
                                         :prop-cabinet-id="device.cabinet.id"
                                         :prop-status="true"
                                         @on-row-click="onSubsidiaryRowClick"
            ></comp-subsidiary-device-list>
            <div slot="footer">
                <Button type="text" @click="showAddModal=false">取消</Button>
                <Button type="primary" @click="addSubsidiary">确定</Button>
            </div>
        </Modal>
        <!-- 资源信息 -->
        <Modal v-model="showAddSimModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-sim-list v-if="showAddSimModal" :prop-status="true" :prop-action="false" @on-row-click="onSimRowClick"></comp-sim-list>
            <div slot="footer">
                <Button type="text" @click="showAddSimModal=false">取消</Button>
                <Button type="primary" @click="addSimCard">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showAddAppModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-app-table v-if="showAddAppModal" :prop-status="true" :prop-action="false" @on-row-click="onAppRowClick"></comp-app-table>
            <div slot="footer">
                <Button type="text" @click="showAddAppModal=false">取消</Button>
                <Button type="primary" @click="addAppSource">确定</Button>
            </div>
        </Modal>

    </Card>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"
    import CompSubsidiaryDeviceList from "./CompSubsidiaryDeviceList";
    import CompSimList from "./CompSimList"
    import CompAppTable from "./CompAppTable"

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
                    ip_address: "string",
                    type: "string"
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
                ],
                sim1:{
                    id:"number",
                    name:"string"
                },
                sim2:{
                    id:"number",
                    name:"string"
                },
                account:[{
                    id:"number",
                    app_name: "string",
                    name: "string",
                }],
                simcard:[{
                    id:"number",
                    operator: "string",
                    order: "number",
                    phone_number: "string",
                }],
                subsidiary_device_info:[{
                    SIMCard_info:[{
                        operator: "string",
                        order: "number",
                        phone_number: "string",
                    }],
                    account_info:[{
                        app_name: "string",
                        name: "q"
                    }],
                    subsidiary_device_custom_name: "string",
                    subsidiary_device_id: "number",
                    subsidiary_device_name: "string",
                    subsidiary_device_order: "number",
                }]
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
        components:{  CompSubsidiaryDeviceList,CompSimList,CompAppTable },
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
            },
            propShowConfig:{    //是否显示配置机型信息
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
                subsidiaryDeviceSelected:{},
                subsidiaryNumber:null,
                subsidiaryOrderList:[],
                openOrderModal:false,
                //source
                showAddSimModal:false,
                showAddAppModal:false,
                app_id:null,
                sim_id:null,
                simOrder:null,
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
                    this.spinShow = true
                    this.$ajax.post("http://" + this.device.cabinet.ip_address + ":5000"+"/door/wifi_port/",
                        {cpu_id:this.device.device_label}
                    ).then(response=>{
                        this.spinShow = false
                        if(response.data.state==="DONE"){
                            this.$Message.success("重连成功")
                            this.$emit('after-device-delete')
                        }else{
                            this.$Message.error({content:response.data.description,duration: 6})
                        }
                    }).catch(error=>{
                        this.spinShow = false
                        this.$Message.error({content:error.response.data.description,duration: 6})
                    })
                }
            },
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
                    this.$Message.error({content:"设备移除失败！"+ error.response.data.message,duration:6});
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
                            "cabinet,cabinet.id,cabinet.cabinet_name,cabinet.ip_address,cabinet.type," +
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
                            'simcard,simcard.operator,simcard.phone_number,simcard.order,simcard.id,' +
                            'account,account.app_name,account.name,account.id,' +
                            "subsidiary_device_info," +
                            "subsidiarydevice,subsidiarydevice.id,subsidiarydevice.serial_number,subsidiarydevice.ip_address,subsidiarydevice.order,subsidiarydevice.custom_name"+
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

                    this.subsidiaryOrderList=[]
                    //获取已有僚机的位置列表
                    this.device.subsidiarydevice.forEach(item=>{
                        this.subsidiaryOrderList.push(item.order)
                    })
                    //拼凑sim卡信息
                    this.device.simcard.forEach(item=>{
                        if(item.order===1){
                            this.device.sim1.id = item.id
                            this.device.sim1.name = item.operator + "_" + item.phone_number
                        }else if(item.order===2){
                            this.device.sim2.id = item.id
                            this.device.sim2.name = item.operator + "_" + item.phone_number
                        }
                    })
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
                    if(config.DEBUG) console.log(reason)
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
                    content: "您确定要解绑僚机"+ (index) +"吗？",
                    onOk(){
                        remove.spinShow = true
                        remove.$ajax.post("api/v1/cedar/unbind_subsidiary_device/",{ subsidiary_device_id: id })
                            .then(response=>{
                                remove.onDeviceAddSuccess()
                                remove.$Message.success("僚机解绑成功")
                                remove.spinShow = false
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                remove.$Message.error({content:"僚机解绑失败"+ error.response.data.message,duration:6})
                                remove.spinShow = false
                        })
                    }
                })
            },
            //进入僚机选取
            onOpenSubsidiaryList(){
                if(this.subsidiaryNumber===null){
                    this.$Message.warning("请先选择僚机位置")
                    return
                }
                this.openOrderModal= false
                this.showAddModal=true
                this.$refs.addDevice.refresh()
                this.subsidiaryDeviceSelected = null
            },
            //选择要添加的僚机
            onSubsidiaryRowClick(row,index){
                this.subsidiaryDeviceSelected = row
            },
            //添加僚机到主机上
            addSubsidiary(){
                if(!this.subsidiaryDeviceSelected){
                    this.$Message.warning("请选择要添加的僚机")
                    return
                }
                if(this.subsidiaryNumber===null ){
                    this.$Message.warning("请选择僚机位置")
                    return
                }
                this.$ajax.post('api/v1/cedar/bind_subsidiary_device/',{
                    device_id: this.device.id,
                    subsidiary_device_id: this.subsidiaryDeviceSelected.id,
                    order: this.subsidiaryNumber
                }).then(response=>{
                    this.onDeviceAddSuccess()
                    this.showAddModal = false
                    this.$Message.success("添加僚机成功")
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"僚机添加失败！" + error.response.message,duration:6})
                })
            },
            //僚机添加成功以后的操作(在device详情页展示出来)
            onDeviceAddSuccess(){
                this.$ajax.get("api/v1/cedar/device/"+this.device.id+"/?fields=subsidiary_device_info,device_label,device_name")
                    .then(response=>{
                        this.subsidiaryOrderList=[]
                        this.device.subsidiary_device_info = response.data.subsidiary_device_info
                        this.device.subsidiary_device_info.forEach(item=>{
                            this.subsidiaryOrderList.push(item.subsidiary_device_order)
                        })
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("僚机信息获取失败")
                })
            },
            //资源添加成功以后的刷新操作
            onSourceAddSuccess(){
                this.$ajax.get("api/v1/cedar/device/"+this.device.id+"/?fields=simcard,simcard.operator," +
                        "simcard.phone_number,simcard.order,simcard.id," +
                        "account,account.app_name,account.name,account.id")
                    .then(response=>{
                        response.data.simcard.forEach(item=>{
                            if(item.order===1){
                                this.device.sim1.id = item.id
                                this.device.sim1.name = item.operator + "_" + item.phone_number
                            }else if(item.order===2){
                                this.device.sim2.id = item.id
                                this.device.sim2.name = item.operator + "_" + item.phone_number
                            }
                        })
                        if(response.data.simcard.length===0){
                            this.device.sim1.id = null
                            this.device.sim1.name = ""
                            this.device.sim2.id = null
                            this.device.sim2.name = ""
                        }
                        this.device.account = response.data.account
                        this.device.simcard = response.data.simcard
                    }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("资源信息获取失败")
                })
            },
            //资源部分  sim、app添加移除
            //选择要添加的SIM卡
            onSimRowClick(row){
                this.sim_id = row.id
            },
            //选择要添加的APP账号
            onAppRowClick(row){
                this.app_id = row.id
            },
            //add SIM card/---/app
            addSimCard(){
                this.$ajax.patch("api/v1/cedar/simcard/" + this.sim_id + "/",{
                    order: this.simOrder,
                    status:"busy",
                    device:this.device.id
                }).then(response=>{
                    this.$Message.success("SIM卡绑定成功")
                    this.showAddSimModal = false
                    this.onSourceAddSuccess()
                }).catch(error=>{
                    this.$Message.error({content:"SIM卡绑定失败"+ error.response.data.message,duration:6})
                })
            },
            addAppSource(){
                this.$ajax.post("api/v1/cedar/bind_account_source/",{
                    id:this.app_id,
                    device:this.device.id
                }).then(response=>{
                    this.$Message.success("app账号资源绑定成功")
                    this.showAddAppModal = false
                    this.onSourceAddSuccess()
                }).catch(error=>{
                    this.$Message.error({content:"app账号资源绑定失败;"+error.response.data.message,duration:7})
                })
            },
            //remove sim  card/---/ app
            removeSimCard(id){
                let root = this;
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要解绑该SIM卡吗？",
                    onOk(){
                        root.$ajax.patch("api/v1/cedar/simcard/" + id + "/",{
                            order: null,
                            status: "idle",
                            history_relevance:root.device.device_name,
                            device:null,
                        }).then(response=>{
                            root.$Message.success("SIM卡解绑成功")
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:"SIM卡解绑失败"+ error.response.data.message,duration:6})
                        })
                    }
                })
            },
            removeAppSource(id){
                let root = this;
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要解绑该账号资源吗？",
                    onOk(){
                        root.$ajax.post("api/v1/cedar/unbind_account_source/",{
                            account_id: id,
                            device:root.device.id
                        }).then(response=>{
                            root.$Message.success("账号资源解绑成功")
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:"账号资源解绑失败"+ error.response.data.message,duration:6})
                        })
                    }
                })
            },
            //机械臂配置机型信息（选点选区）
            onConfigClick(){
                this.$emit('on-config-click',this.device)
            },
            //批量解绑SIM卡、账号
            unboundAllSources(val){
                let _this = this
                //val=>1:批量解绑SIM卡  2：批量解绑账号
                let type = ""
                let content = ""
                if(val===1){
                    if(this.device.simcard.length === 0){
                        this.$Message.success("没有可批量解绑的SIM卡资源")
                        return
                    }
                    type = "SIMCard"
                    content = "您确定要解绑所有SIM卡资源吗?"
                }else if(val===2){
                    if(this.device.account.length === 0){
                        this.$Message.success("没有可批量解绑的账号资源")
                        return
                    }
                    type = "Account"
                    content = "您确定要解绑所有账号资源吗?"
                }
                this.$Modal.confirm({
                    title: "警告！",
                    content:content,
                    onOk(){
                        _this.$ajax.post("api/v1/cedar/block_unbind_resource",{
                            device:_this.device.id,
                            "resource_type":type
                        }).then(response=>{
                            this.$Message.success("资源解绑成功")
                            _this.onSourceAddSuccess()
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error({content:"资源解绑失败:" + error.response.data.message,duration:5})
                        })
                    }
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
    .ivu-radio-border{
        padding: 0 15px;
    }
    .remove-icon .ivu-icon-md-remove-circle:hover{
         color: red!important;
     }
    .ivu-collapse-item .ivu-btn-text:hover{
        background: transparent;
    }
    .ivu-collapse-item .ivu-btn-text:focus {
        box-shadow:none;
    }

</style>
