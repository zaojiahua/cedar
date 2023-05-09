<template>
    <Card :title="device.device_name + ' (' + device.device_label + ')'" style="position: relative;" dis-hover>
        <Form :model="device" :label-width="100">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="device.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.device_label')}}</b>
                <Input v-model="device.device_label" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.customName')}}</b>
                <Input v-model="device.custom_number" :maxlength="100" :disabled="!editable" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.android_version')}}</b>
                <Input v-model="device.android_version.version" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.cabinet')}}</b>
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
                <b slot="label">{{$t('deviceList.rom_version')}}</b>
                <Input v-model="device.rom_version.version" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceDetail.start_time_key')}}</b>
                <Input v-model="device.start_time_key" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceDetail.status')}}</b>
                <Input v-model="device.status" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceDetail.status_update_time')}}</b>
                <Input v-model="device.status_update_time" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <Divider></Divider>
            <FormItem>
                <b slot="label">{{$t('deviceList.device_name')}}</b>
                <Input v-model="device.device_name" :disabled="!editable"></Input>
            </FormItem>
        </Form>
        <Collapse :value="[0,1,2,3,4,5,6,7,8]">
            <Panel>{{$t('deviceDetail.model')}}
                <div  slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">{{$t('deviceDetail.phone_model_name')}}</b>
                            <Input v-model="device.phone_model.phone_model_name" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">Xdpi</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.x_dpi" :disabled="true" class="disabled-input"></InputNumber>
                        </FormItem>
                        <FormItem>
                            <b slot="label">Ydpi</b>
                            <InputNumber style="width: 100%" v-model="device.phone_model.y_dpi" :disabled="true" class="disabled-input"></InputNumber>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel v-show="device.status!=='offline'">{{$t('deviceDetail.subsidiary_device_info')}}
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div v-for="(deviceItem,index) in device.subsidiary_device_info">
                            <Divider>{{$t('deviceDetail.subsidiary_device')}}{{ deviceItem.subsidiary_device_order }}</Divider>
                            <FormItem>
                                <b slot="label">{{$t('deviceList.device_name')}}</b>
                                <Input v-model="deviceItem.subsidiary_device_custom_name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" style="cursor:pointer;margin-left: 5px" size="20" color="red"
                                      @click="deleteSubsidiary(deviceItem.subsidiary_device_id,deviceItem.subsidiary_device_order)"/>
                            </FormItem>
                            <FormItem v-for="sim in deviceItem.SIMCard_info">
                                <b slot="label">SIM{{$t('deviceDetail.card')}}{{ sim.order }}</b>
                                <Input v-model="sim.operator + '_' + sim.phone_number" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                            </FormItem>
                            <FormItem v-for="app in deviceItem.account_info">
                                <b slot="label">{{$t('deviceDetail.account_info')}}</b>
                                <Input v-model="app.app_name + ' / ' + app.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                            </FormItem>
                        </div>
                        <div v-if="device.subsidiary_device_info.length<3 && (device.status!=='error')">
                            <Divider></Divider>
                            <Button :disabled="!propSubsidiaryDevice" type="primary" style="width: 80%;margin-left: 10%;" @click="openOrderModal=true;subsidiaryNumber=null">
                                <Icon type="ios-add-circle-outline" size="20" />
                            </Button>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel>SIM{{$t('deviceDetail.simInfo')}}
                <Button type="text" @click.stop="unboundAllSources(1)" style="float: right;margin-right: 10%;margin-top: 4px">{{$t('deviceDetail.unbound')}}</Button>
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div class="remove-icon">
                            <FormItem>
                                <b slot="label">SIM{{$t('deviceDetail.card')}}1</b>
                                <Row>
                                    <Input v-model="device.sim1.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice&& !device.sim1.id &&device.status!=='offline'&&device.status!=='error'" type="ios-add-circle"
                                          @click="showAddSimModal=true;simOrder=1" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c"/>
                                    <Icon v-show="propSubsidiaryDevice&&device.sim1.id" type="md-remove-circle"
                                          @click="removeSimCard(device.sim1.id)" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"/>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <b slot="label">SIM{{$t('deviceDetail.card')}}2</b>
                                <Row>
                                    <Input v-model="device.sim2.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice&& !device.sim2.id&&device.status!=='offline'&&device.status!=='error'" type="ios-add-circle"
                                          @click="showAddSimModal=true;simOrder=2" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c"/>
                                    <Icon v-show="propSubsidiaryDevice&&device.sim2.id" type="md-remove-circle"
                                          @click="removeSimCard(device.sim2.id)" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"/>
                                </Row>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel>{{$t('deviceDetail.account_info_2')}}
                <Button type="text" @click.stop="unboundAllSources(2)" style="float: right;margin-right: 10%;margin-top: 4px">{{$t('deviceDetail.unbound')}}</Button>
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <div class="remove-icon">
                            <FormItem v-for="item in device.account">
                                <b slot="label">{{$t('deviceDetail.account_info')}}</b>
                                <Row>
                                    <Input v-model="item.app_name+ ' / '+item.name+ ' / '+item.username" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" style="margin-left: 5px;cursor: pointer;" size="20" color="#666"
                                          @click="removeAppSource(item.id)"/>
                                </Row>
                            </FormItem>
                            <FormItem v-show="propSubsidiaryDevice&&device.status!=='offline'&&device.status!=='error'">
                                <b slot="label">{{$t('deviceDetail.account_info')}}</b>
                                <Row>
                                    <Input style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                    <Icon type="ios-add-circle" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c" @click="showAddAppModal=true"/>
                                </Row>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Panel>
            <Panel>{{$t('deviceDetail.temp')}}
                <CheckboxGroup slot="content" v-model="selectedTempPorts">
                    <Checkbox v-for="item in tempPorts" :label="item.port" :key="item.id" :disabled="isDisabled(item.port,disableTempPorts)">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>{{$t('deviceDetail.power')}}
                <Button type="text" v-show="device.powerport.port!==null" @click.stop="checkPowerPort" style="float: right;margin-right: 10%;margin-top: 4px">{{$t('deviceDetail.checkPowerPort')}}</Button>
                <CheckboxGroup  slot="content" v-model="selectedPowerPorts" @on-change="powerPortCheckbox">
                    <Checkbox  v-for="item in powerPorts" :label="item.id" :key="item.id" :disabled="isDisabled(item.id,disablePowerPorts)">{{item.port}}</Checkbox >
                </CheckboxGroup >
            </Panel>
            <Panel>{{$t('deviceDetail.camera')}}
                <CheckboxGroup slot="content" v-model="selectedMonitorPorts" @on-change="monitorPortCheckbox">
                    <Checkbox v-for="item in monitorPorts" :label="item.id" :key="item.id" :disabled="!editable">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>{{$t('deviceDetail.other')}}
                <p  slot="content">
                    <span>{{$t('deviceDetail.switch')}} AITester </span>
                    <i-switch v-model="openSwitch" style="float: right" :disabled="!editable"/>
                </p>
            </Panel>
        </Collapse>
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;" v-if="editable" v-show="device.status!=='offline'">
            <Col>
                <Button type="error" @click="deleteDevice">{{$t('deviceDetail.remove')}}</Button>
                <Button type="primary" style="margin:0 16px;" @click="reconnectDevice">{{$t('deviceDetail.reconnect')}}</Button>
                <Button type="info" v-show="device.status==='busy'" @click="releaseTboardDevice">{{$t('deviceDetail.release')}}</Button>
            </Col>
            <Col v-show="device.status!=='error'">
                <Button type="primary" style="margin-right: 16px;" @click="updateDevice">{{$t('public.btn_save')}}</Button>
                <Button @click="cancelConfig">{{$t('public.btn_cancel')}}</Button>
            </Col>
        </Row>
        <Row align="middle" type="flex" style="margin-top: 32px;" v-if="propDeviceSlot">
            <Button type="error" @click="releaseDeviceSlot">{{$t('deviceDetail.release_2')}}</Button>
            <Button type="primary" v-show="((device.status!=='busy')&&(device.status!=='offline'))&&propShowConfig" style="margin-left: 20px;" @click="onConfigClick">{{$t('deviceDetail.config')}}</Button>
        </Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal v-model="openOrderModal" :closable="false" :mask-closable="false" footer-hide width="450">
            <Card>
                <p slot="title">{{$t('deviceDetail.selTip')}}</p>
                <div style="margin-bottom: 40px">
                    <span>{{$t('deviceDetail.slot')}}：</span>
                    <RadioGroup v-model="subsidiaryNumber" >
                        <Radio v-for="index in 3" style="margin-bottom: 10px" :disabled="subsidiaryOrderList.includes(index)" border :label="index">{{$t('deviceDetail.subsidiary_device')}}{{ index }}</Radio>
                    </RadioGroup>
                </div>
                <Row style="text-align: right">
                    <Button @click="openOrderModal=false" style="margin-right: 20px;">{{$t('public.btn_cancel')}}</Button>
                    <Button type="primary" @click="onOpenSubsidiaryList">{{$t('public.btn_ok')}}</Button>
                </Row>
            </Card>

        </Modal>
        <Modal v-model="showAddModal" :fullscreen="true" :transfer="false" :closable="false">
            <comp-subsidiary-device-list ref="addDevice" :prop-show-cabinet-select="false"
                                         :prop-cabinet-id="device.cabinet.id"
                                         :prop-status="true"
                                         @on-row-click="onSubsidiaryRowClick"
            ></comp-subsidiary-device-list>
            <div slot="footer">
                <Button type="text" @click="showAddModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" :loading="isLoading" @click="addSubsidiary">
                    <span v-if="!isLoading">{{$t('public.btn_ok')}}</span>
                    <span v-else>{{$t('deviceDetail.isAdd')}}</span>
                </Button>
            </div>
        </Modal>
        <!-- 资源信息 -->
        <Modal v-model="showAddSimModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-sim-list v-if="showAddSimModal" :prop-status="true" :prop-action="false" @on-row-click="onSimRowClick"></comp-sim-list>
            <div slot="footer">
                <Button type="text" @click="showAddSimModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="addSimCard">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showAddAppModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-app-table ref="appTable" v-if="showAddAppModal" :prop-status="true" :prop-action="false" :prop-multi-select="true"></comp-app-table>
            <div slot="footer">
                <Button type="text" @click="showAddAppModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="addAppSource">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showRemoveModal" :closable="false" :footer-hide="true" width="420">
            <div style="padding: 10px">
                <Row>
                    <Icon type="ios-help-circle" size="28" style="position: relative;top: 4px;color:#ff9900"/>
                    <span style="font-size: 16px;margin-left: 10px;">{{$t('public.modal_warn')}}！</span>
                </Row>
                <p style="margin: 15px 0 30px 38px">{{ removeMsg }}</p>
                <Row style="margin-left: 38px;">
                    <Button type="primary" style="margin-right: 20px" @click="deleteAjax(device.device_label,true,false)">{{$t('deviceDetail.removw_2')}}</Button>
                    <Button type="info" style="margin-right: 20px" @click="deleteAjax(device.device_label,false,false)">{{$t('deviceDetail.removw_3')}}</Button>
                    <Button type="default" @click="showRemoveModal=false">{{$t('public.btn_cancel')}}</Button>
                </Row>
            </div>
        </Modal>
        <Modal v-model="showRemoveAgainModal" :closable="false" :footer-hide="true" width="420">
            <div style="padding: 10px">
                <Row>
                    <Icon type="ios-help-circle" size="28" style="position: relative;top: 4px;color:#ff9900"/>
                    <span style="font-size: 16px;margin-left: 10px;">{{$t('public.modal_info')}}！</span>
                </Row>
                <p style="margin: 15px 0 30px 38px">{{ removeAgainMsg }}</p>
                <Row style="text-align: right">
                    <Button type="text" @click="showRemoveAgainModal=false">{{$t('public.btn_cancel')}}</Button>
                    <Button type="primary" @click="deleteAjax(device.device_label,false,true)">{{$t('deviceDetail.remove_4')}}</Button>
                </Row>
            </div>
        </Modal>

        <Modal v-model="showRegisterModal" :closable="false" :footer-hide="true" width="420">
            <div style="padding: 10px">
                <Form :model="device" :label-width="110">
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceList.device_name')}}</b>
                        <Input v-model="device.device_name" :disabled="true" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceList.device_label')}}</b>
                        <Input style="width: 100%" v-model="device.device_label" :disabled="true" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceDetail.manufacturer')}}</b>
                        <Input style="width: 100%" v-model="device.phone_model.manufacturer.manufacturer_name" :disabled="true" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceList.android_version')}}</b>
                        <Input style="width: 100%" v-model="registerDeviceInfo.android_version" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceList.rom_version')}}</b>
                        <Input style="width: 100%" v-model="registerDeviceInfo.rom_version" :disabled="!editable" class="disabled-input"></Input>
                    </FormItem>
                    <FormItem>
                        <b slot="label"><span class="need">*</span>{{$t('deviceDetail.ip')}}</b>
                        <Input style="width: 100%" v-model="registerDeviceInfo.ip_address" :disabled="true" class="disabled-input"></Input>
                    </FormItem>
                </Form>
                <Row style="text-align: center">
                    <Button type="primary" style="margin-right: 20px" @click="registerDevice">{{$t('public.btn_ok')}}</Button>
                    <Button type="default" @click="showRegisterModal=false">{{$t('public.btn_cancel')}}</Button>
                </Row>
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
                custom_number: "string",
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
                    manufacturer:{
                        id:"number",
                        manufacturer_name:"string"
                    }
                },
                rom_version: {
                    id: "number",
                    version: "string"
                },
                start_time_key: "date",
                status: "string",
                status_update_time:"date",
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
                    username:"string"
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
                isLoading:false,
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
                showRemoveModal:false,
                removeMsg:"",
                showRemoveAgainModal:false,
                removeAgainMsg:"",
                showRegisterModal:false,
                registerDeviceInfo:{
                    android_version: "",
                    rom_version: "",
                    ip_address: "",
                    width_resolution:null,
                    height_resolution:null
                }
            }
        },
        methods: {
            // Delete Device
            deleteDevice(){
                let device_id = this.device.device_label
                let device_status = this.device.status
                let detailComp = this
                if(device_status==="busy"){
                    if(this.device.simcard.length === 0&&this.device.account.length === 0){
                        //未绑定附加资源
                        this.$Modal.confirm({
                            title: this.$t('public.modal_warn'),
                            content: this.$t('deviceDetail.tips_1'),
                            onOk() {
                                detailComp.deleteAjax(device_id,false)
                            }
                        })
                    }else {
                        //绑定了附加资源
                        this.removeMsg = this.$t('deviceDetail.tips_2')
                        this.showRemoveModal = true
                    }
                }else {
                    if(this.device.simcard.length === 0&&this.device.account.length === 0){
                        //未绑定附加资源
                        this.$Modal.confirm({
                            title: this.$t('public.modal_warn'),
                            content: this.$t('deviceDetail.tips_3')+"（"+ device_status +this.$t('deviceDetail.status')+"）",
                            onOk() {
                                detailComp.deleteAjax(device_id,false)
                            }
                        })
                    }else {
                        //绑定了附加资源
                        this.removeMsg = this.$t('deviceDetail.tips_4')+"（"+ device_status +this.$t('deviceDetail.status')+"）"
                        this.showRemoveModal = true
                    }
                }
            },
            // 从 任 务 中 释 放 设 备
            releaseTboardDevice(){
                let _this = this
                this.$Modal.confirm({
                    title: this.$t('public.modal_info'),
                    content: this.$t('deviceDetail.tips_5'),
                    onOk() {
                        _this.spinShow = true
                        _this.$ajax.delete("http://" + _this.device.cabinet.ip_address + ":5000"+ "/tboard/stop_specific_device/"+  _this.device.device_label +"/")
                        .then(response=>{
                            _this.spinShow = false
                            if(response.data.error_code===0){
                                _this.refresh(_this.device.id)
                                _this.$Message.success({content:_this.$t('deviceDetail.tips_6'),duration:3})
                                _this.$emit('after-device-delete')
                            }else{
                                _this.$Message.error({content:response.data.description,duration: 10})
                            }
                        }).catch(error=>{
                            _this.spinShow = false
                            if(error.response.status>=500)
                                _this.$Message.error({content:_this.$t('public.error_500'),duration: 5})
                            else
                                _this.$Message.error({content:_this.$t('public.requestFail'),duration: 5})
                        })
                    }
                })
            },
            reconnectDevice(){
                if (this.device.status==="offline"){
                    this.$Message.error(this.$t('deviceDetail.tips_7'))
                }
                else{
                    this.registerDeviceInfo ={
                        android_version: "",
                        rom_version: "",
                        ip_address: "",
                        width_resolution:null,
                        height_resolution:null
                    }
                    this.spinShow = true
                    this.$ajax.post("http://" + this.device.cabinet.ip_address + ":5000"+"/door/wifi_port/",
                        {cpu_id:this.device.device_label}
                    ).then(response=>{
                        this.spinShow = false
                        if(response.data.error_code===0){
                            this.registerDeviceInfo = response.data.data
                            this.showRegisterModal = true
                        }else{
                            this.$Message.error({content:response.data.description,duration: 10})
                        }
                    }).catch(error=>{
                        this.spinShow = false
                        if(error.response.status>=500)
                            this.$Message.error({content:this.$t('public.error_500'),duration: 5})
                        else
                            this.$Message.error({content:this.$t('public.requestFail'),duration: 5})
                    })
                }
            },
            //重新链接后注册进系统
            registerDevice(){
                if(this.device.device_name===""||this.device.device_label===""||
                    this.device.phone_model.manufacturer.manufacturer_name===""||
                    this.registerDeviceInfo.android_version===""||this.registerDeviceInfo.rom_version===""||
                    this.registerDeviceInfo.ip_address===""){
                    this.$Message.warning(this.$t('deviceDetail.tips_8'))
                    return
                }
                if(!this.device.device_name||!this.device.device_label||
                    !this.device.phone_model.manufacturer.manufacturer_name||
                    !this.registerDeviceInfo.android_version||!this.registerDeviceInfo.rom_version||
                    !this.registerDeviceInfo.ip_address){
                    this.$Message.warning(this.$t('deviceDetail.tips_8'))
                    return
                }
                if (!this.device.device_name.match(/^[\u4E00-\u9FA5a-zA-Z0-9()_\-]+$/)) {
                    this.$Message.warning({content:this.$t('deviceDetail.tips_9'),duration:5})
                    return
                }
                this.$ajax.post("http://" + this.device.cabinet.ip_address + ":5000"+"/door/device_info/", {
                        device_label: this.device.device_label,
                        android_version: this.registerDeviceInfo.android_version,
                        rom_version: this.registerDeviceInfo.rom_version,
                        ip_address: this.registerDeviceInfo.ip_address,
                        width_resolution: this.registerDeviceInfo.width_resolution,
                        height_resolution: this.registerDeviceInfo.height_resolution,
                        manufacturer: this.device.phone_model.manufacturer.manufacturer_name
                }).then(response=>{
                    if(response.data.error_code===0){
                        this.registerDeviceInfo = response.data.data
                        this.showRegisterModal = false
                        this.$Message.success(this.$t('deviceDetail.tips_10'))
                        this.$emit('after-device-delete')
                    }else{
                        this.$Message.error({content:response.data.description,duration: 10})
                    }
                }).catch(error=>{
                    this.spinShow = false
                    if(error.response.status>=500)
                        this.$Message.error({content:this.$t('public.error_500'),duration: 5})
                    else
                        this.$Message.error({content:this.$t('public.requestFail'),duration: 5})
                })
            },
            deleteAjax(device_id,unbind_flag=false,force=false){
                this.spinShow = true;
                this.showRemoveAgainModal = false
                this.$ajax.post("api/v1/coral/release_device/",{
                    ip_address:this.device.ip_address,
                    device_label:device_id,
                    unbind_resource:unbind_flag,
                    force:force,
                    tempport:this.device.tempport
                }).then(response=>{
                    this.spinShow = false;
                    if(response.data.status==="success"){
                        this.$Message.success({content:this.$t('deviceDetail.tips_11'),duration:3});
                        this.$emit('after-device-delete')
                    }
                    this.showRemoveModal = false
                }).catch(error=>{
                    console.log(error.response)
                    this.spinShow = false;
                    this.showRemoveModal = false
                    if(config.DEBUG) console.log(error)
                    if( error.response.status === 400 ){
                        if(error.response.data.custom_code==="102001"){
                            this.showRemoveAgainModal = true
                            this.removeAgainMsg = this.$t('deviceDetail.error_1')+ error.response.data.description +this.$t('deviceDetail.error_2')
                            return
                        }
                        this.$Message.error({content:this.$t('deviceDetail.error_3'),duration:3});
                    }else {
                        this.$Message.error({content:this.$t('deviceDetail.error_3'),duration:3});
                    }
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
                            "phone_model.manufacturer,phone_model.manufacturer.id,phone_model.manufacturer.manufacturer_name," +
                            "phone_model.x_border,phone_model.y_border,phone_model.x_dpi,phone_model.y_dpi," +
                            "rom_version,rom_version.id,rom_version.version," +
                            "start_time_key," +
                            "status," +
                            "status_update_time," +
                            "device_name," +
                            "custom_number," +
                            "tempport,tempport.id,tempport.port,tempport.description," +
                            "powerport,powerport.id,powerport.port," +
                            "monitor_index,monitor_index.id,monitor_index.port," +
                            "auto_test," +
                            'simcard,simcard.operator,simcard.phone_number,simcard.order,simcard.id,' +
                            'account,account.app_name,account.name,account.id,account.username,' +
                            "subsidiary_device_info," +
                            "subsidiarydevice,subsidiarydevice.id,subsidiarydevice.serial_number,subsidiarydevice.ip_address,subsidiarydevice.order,subsidiarydevice.custom_name"+
                            "&ordering=subsidiarydevice.order"
                        ),
                    ]
                ).then(ajax.spread((deviceResponse)=>{
                    this.device = utils.validate(serializer.deviceSerializer, deviceResponse.data)

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
                    //对取回的僚机数据按照order进行排序
                    this.device.subsidiarydevice.sort(this.orderSort)

                    //aiTester
                    this.openSwitch = this.device.auto_test
                    this.spinShow = false;

                    if(!this.device.cabinet.id) return
                    this.$ajax.all(
                        [
                            ajax.get("api/v1/cedar/temp_port/?fields=" +
                                "id," +
                                "port," +
                                "description," +
                                "device," +
                                "device.id," +
                                "status" +
                                "&woodenbox__cabinet=" + this.device.cabinet.id +
                                "&ordering=port"),
                            ajax.get("api/v1/cedar/power_port/?fields=" +
                                "id," +
                                "port," +
                                "device," +
                                "device.id," +
                                "status"+
                                "&woodenbox__cabinet=" + this.device.cabinet.id +
                                "&ordering=port"),
                            ajax.get("api/v1/cedar/monitor_port/?fields=" +
                                "id," +
                                "port," +
                                "device," +
                                "device.id" +
                                "&ordering=port")
                        ]
                    ).then(ajax.spread(( tempPortResponse, powerPortResponse, monitorPortResponse)=>{
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

                    })).catch(reason => {
                        if(config.DEBUG) console.log(reason)
                        let status = reason.response?reason.response.status : "Network error!"
                        this.$Message.error(this.$t('deviceDetail.error_4')+status)
                    })
                })).catch(reason => {
                    this.spinShow = false;
                    if(config.DEBUG) console.log(reason)
                    let status = reason.response?reason.response.status : "Network error!"
                    this.$Message.error(this.$t('deviceDetail.error_5')+status)
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
                if (!this.device.device_name.match(/^[\u4E00-\u9FA5a-zA-Z0-9()_\-]+$/)) {
                    this.$Message.warning({content:this.$t('deviceDetail.tips_9'),duration:5})
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
                                custom_number:this.device.custom_number.trim(),
                                tempport:temperDict,
                                monitor_index:this.selectedMonitorPorts.length===0 ? null : parseInt(this.selectedMonitorPorts.join(",")),
                                powerport:configPowerPorts.length===0 ? null : parseInt(configPowerPorts.join(",")),
                                auto_test :this.openSwitch
                            }
                        ),
                    ]
                ).then(this.$ajax.spread((configResponse)=>{
                    this.spinShow = false;
                    if(config.DEBUG) console.log(configResponse.data)
                    if(configResponse.status===200){
                        this.$Message.success(this.$t('deviceDetail.configSuccess'))
                        this.$emit('after-device-update', configResponse)
                    }else{
                        this.$Message.error(this.$t('deviceDetail.configFailed'))
                    }
                })).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.spinShow = false;
                    this.$Message.error(this.$t('deviceDetail.configFailed'))
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
                    this.$Message.success(this.$t('deviceDetail.releaseTips_1'))
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error(this.$t('deviceDetail.releaseTips_2'))
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
                    title: this.$t('public.modal_warn'),
                    content: this.$t('deviceDetail.removeTips_1')+ (index) +this.$t('deviceDetail.removeTips_2'),
                    onOk(){
                        remove.spinShow = true
                        remove.$ajax.post("api/v1/cedar/unbind_subsidiary_device/",{ subsidiary_device_id: id })
                            .then(response=>{
                                remove.onDeviceAddSuccess()
                                remove.$Message.success(remove.$t('deviceDetail.removeTips_3'))
                                remove.spinShow = false
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                remove.$Message.error({content:remove.$t('deviceDetail.removeTips_4')+ error.response.data.message,duration:6})
                                remove.spinShow = false
                        })
                    }
                })
            },
            //进入僚机选取
            onOpenSubsidiaryList(){
                if(this.subsidiaryNumber===null){
                    this.$Message.warning(this.$t('deviceDetail.slotTips_1'))
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
                    this.$Message.warning(this.$t('deviceDetail.slotTips_2'))
                    return
                }
                if(this.subsidiaryNumber===null ){
                    this.$Message.warning(this.$t('deviceDetail.slotTips_1'))
                    return
                }
                this.isLoading = true
                this.$ajax.post('api/v1/cedar/bind_subsidiary_device/',{
                    device_id: this.device.id,
                    subsidiary_device_id: this.subsidiaryDeviceSelected.id,
                    order: this.subsidiaryNumber
                }).then(response=>{
                    this.isLoading = false
                    this.onDeviceAddSuccess()
                    this.showAddModal = false
                    this.$Message.success(this.$t('deviceDetail.slotTips_3'))
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:this.$t('deviceDetail.slotTips_4') + error.response.message,duration:6})
                    this.isLoading = false
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
                        this.$Message.error(this.$t('deviceDetail.slotTips_5'))
                })
            },
            //资源添加成功以后的刷新操作
            onSourceAddSuccess(){
                this.$ajax.get("api/v1/cedar/device/"+this.device.id+"/?fields=simcard,simcard.operator," +
                        "simcard.phone_number,simcard.order,simcard.id," +
                        "account,account.app_name,account.name,account.id,account.username")
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
                    this.$Message.error(this.$t('deviceDetail.sourceTips_1'))
                })
            },
            //资源部分  sim、app添加移除
            //选择要添加的SIM卡
            onSimRowClick(row){
                this.sim_id = row.id
            },
            //选择要添加的APP账号  //单选
            // onAppRowClick(row){
            //     this.app_id = row.id
            // },
            //add SIM card/---/app
            addSimCard(){
                if(!this.sim_id){
                    this.$Message.info(this.$t('deviceDetail.sourceTips_2'))
                    return
                }
                this.$ajax.patch("api/v1/cedar/simcard/" + this.sim_id + "/",{
                    order: this.simOrder,
                    status:"busy",
                    device:this.device.id
                }).then(response=>{
                    this.$Message.success(this.$t('deviceDetail.sourceTips_3'))
                    this.showAddSimModal = false
                    this.onSourceAddSuccess()
                }).catch(error=>{
                    this.$Message.error({content:this.$t('deviceDetail.sourceTips_4')+ error.response.data.message,duration:6})
                })
            },
            addAppSource(){
                let apps = this.$refs.appTable.getThisSelection()
                if(apps.length===0){
                    this.$Message.info(this.$t('deviceDetail.sourceTips_5'))
                    return
                }
                let ids = [];
                apps.forEach(info=> {
                    ids.push(info.id)
                })
                this.$ajax.post("api/v1/cedar/bind_account_source/",{
                    ids:ids,
                    device:this.device.id
                }).then(response=>{
                    if(response.data.length>0){
                        this.$Modal.error({
                            title:this.$t('deviceDetail.sourceTips_6'),
                            content:this.$t('deviceDetail.sourceTips_7')+'【'+ response.data.join("】,【") +'】'+this.$t('deviceDetail.sourceTips_8')
                        })
                    }else
                        this.$Message.success(this.$t('deviceDetail.sourceTips_9'))
                    this.showAddAppModal = false
                    this.onSourceAddSuccess()
                })
                .catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.$Message.error({content:this.$t('deviceDetail.sourceTips_10')+error.response.data.message,duration:7})
                })
            },
            //remove sim  card/---/ app
            removeSimCard(id){
                let root = this;
                this.$Modal.confirm({
                    title: this.$t('public.modal_warn'),
                    content: this.$t('deviceDetail.unbindTips_1'),
                    onOk(){
                        root.$ajax.patch("api/v1/cedar/simcard/" + id + "/",{
                            order: null,
                            status: "idle",
                            history_relevance:root.device.device_name,
                            device:null,
                        }).then(response=>{
                            root.$Message.success(root.$t('deviceDetail.unbindTips_2'))
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:root.$t('deviceDetail.unbindTips_3')+ error.response.data.message,duration:6})
                        })
                    }
                })
            },
            removeAppSource(id){
                let root = this;
                this.$Modal.confirm({
                    title: this.$t('public.modal_warn'),
                    content: this.$t('deviceDetail.unbindTips_4'),
                    onOk(){
                        root.$ajax.post("api/v1/cedar/unbind_account_source/",{
                            account_id: id,
                            device:root.device.id
                        }).then(response=>{
                            root.$Message.success(root.$t('deviceDetail.unbindTips_5'))
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:root.$t('deviceDetail.unbindTips_6')+ error.response.data.message,duration:6})
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
                        this.$Message.success(this.$t('deviceDetail.unbindTips_7'))
                        return
                    }
                    type = "SIMCard"
                    content = this.$t('deviceDetail.unbindTips_8')
                }else if(val===2){
                    if(this.device.account.length === 0){
                        this.$Message.success(this.$t('deviceDetail.unbindTips_9'))
                        return
                    }
                    type = "Account"
                    content = this.$t('deviceDetail.unbindTips_10')
                }
                this.$Modal.confirm({
                    title: this.$t('public.modal_warn'),
                    content:content,
                    onOk(){
                        _this.$ajax.post("api/v1/cedar/block_unbind_resource",{
                            device:_this.device.id,
                            "resource_type":type
                        }).then(response=>{
                            this.$Message.success(_this.$t('deviceDetail.unbindTips_11'))
                            _this.onSourceAddSuccess()
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error({content:_this.$t('deviceDetail.unbindTips_12') + error.response.data.message,duration:5})
                        })
                    }
                })
            },
            //查询充电口状态
            checkPowerPort(){
                this.$ajax.post('http://'+this.device.cabinet.ip_address+':5000/resource/power_check',{
                    port:this.device.powerport.port
                })
                .then(response=>{
                    let _this = this
                    if(response.data.status==="on")
                        this.$Modal.confirm({
                            title:this.$t('public.modal_info'),
                            content:_this.device.powerport.port+_this.$t('deviceDetail.powerTips_1'),
                            okText:_this.$t('deviceDetail.powerTips_2'),
                            onOk(){
                                _this.$ajax.post('http://'+_this.device.cabinet.ip_address+':5000/resource/power_action',{
                                    port:_this.device.powerport.port,
                                    action:"off"
                                }).then(response=>{
                                    _this.$Message.success(_this.$t('deviceDetail.powerTips_3'))
                                }).catch(error=>{
                                    if(error.response.status>=500)
                                        _this.$Message.error({content:_this.$t('public.error_500'),duration:8})
                                    else
                                        _this.$Message.error({content:_this.$t('deviceDetail.powerTips_4'),duration:8})
                                })
                            }
                        })
                    else
                        this.$Modal.confirm({
                            title:this.$t('public.modal_info'),
                            content:_this.device.powerport.port+_this.$t('deviceDetail.powerTips_5'),
                            okText:_this.$t('deviceDetail.powerTips_6'),
                            onOk(){
                                _this.$ajax.post('http://'+_this.device.cabinet.ip_address+':5000/resource/power_action',{
                                    port:_this.device.powerport.port,
                                    action:"on"
                                }).then(response=>{
                                    _this.$Message.success(_this.$t('deviceDetail.powerTips_7'))
                                }).catch(error=>{
                                    if(error.response.status>=500)
                                        _this.$Message.error({content:_this.$t('public.error_500'),duration:8})
                                    else
                                        _this.$Message.error({content:_this.$t('deviceDetail.powerTips_8'),duration:8})
                                })
                            }
                        })
                })
                .catch(error=>{
                    if(error.response.status>=500)
                        this.$Message.error({content:this.$t('public.error_500'),duration:8})
                    else
                        this.$Message.error({content:_this.$t('deviceDetail.powerTips_9'),duration:8})
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
