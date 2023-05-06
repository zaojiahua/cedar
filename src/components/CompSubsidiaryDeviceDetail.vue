<template>
    <Card :title="device.custom_name + ' (' + device.serial_number + ')'" style="position: relative;" dis-hover>
        <Form :model="device" :label-width="100">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="device.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.device_label')}}</b>
                <Input v-model="device.serial_number" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.customName')}}</b>
                <Input v-model="device.custom_number" :maxlength="100" style="width: 80%"></Input>
                <Button type="primary" @click="updateCustomNumber">{{$t('userManagement.userColumns.btn_1')}}</Button>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.cabinet')}}</b>
                <Input v-model="device.cabinet.cabinet_name+' ( '+device.cabinet.type +' )'" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">IP</b>
                <Input v-model="device.ip_address" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceDetail.status')}}</b>
                <Input v-model="device.status" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <Divider></Divider>
            <FormItem>
                <b slot="label"><span class="need">*</span>{{$t('deviceList.device_name')}}</b>
                <Input style="width: 80%" v-model="device.custom_name"></Input>
                <Button type="primary" @click="updateDevice">{{$t('userManagement.userColumns.btn_1')}}</Button>
            </FormItem>
        </Form>
        <Collapse :value="[0,1,2,3,4,5]">
            <Panel>{{$t('deviceDetail.model')}}
                <div  slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">{{$t('deviceDetail.phone_model_name')}}</b>
                            <Input v-model="device.phone_model.phone_model_name" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">Xdpi</b>
                            <Input v-model="device.phone_model.x_dpi" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">Ydpi</b>
                            <Input v-model="device.phone_model.y_dpi" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">{{$t('subsidiaryDevice.tips_4')}}</b>
                            <Input v-model="device.phone_model.x_border" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">{{$t('subsidiaryDevice.tips_5')}}</b>
                            <Input v-model="device.phone_model.y_border" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>{{$t('subsidiaryDevice.tips_2')}}
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">{{$t('subsidiaryDevice.tips_2')}}</b>
                            <Input v-model="device.device.device_name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>SIM{{$t('deviceDetail.simInfo')}}
                <Button type="text" @click.stop="unboundAllSources(1)" style="float: right;margin-right: 10%;margin-top: 4px">{{$t('deviceDetail.unbound')}}</Button>
                <div slot="content">
                    <Form :model="device" :label-width="90" class="remove-icon">
                        <FormItem>
                            <b slot="label">SIM{{$t('deviceDetail.card')}}1</b>
                            <Row>
                                <Input v-model="device.sim1.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice&& !device.sim1.id" type="ios-add-circle" size="20" color="#1bbc9c"
                                      @click="showAddSimModal=true;simOrder=1" style="margin-left: 5px;cursor: pointer;"/>
                                <Icon v-show="propSubsidiaryDevice&& device.sim1.id" type="md-remove-circle" size="20" color="#666"
                                      @click="removeSimCard(device.sim1.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <b slot="label">SIM{{$t('deviceDetail.card')}}2</b>
                            <Row>
                                <Input v-model="device.sim2.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice&& !device.sim2.id" type="ios-add-circle" size="20" color="#1bbc9c"
                                      @click="showAddSimModal=true;simOrder=2" style="margin-left: 5px;cursor: pointer;"/>
                                <Icon v-show="propSubsidiaryDevice&& device.sim2.id" type="md-remove-circle" size="20" color="#666"
                                      @click="removeSimCard(device.sim2.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>{{$t('deviceDetail.account_info_2')}}
                <Button type="text" @click.stop="unboundAllSources(2)" style="float: right;margin-right: 10%;margin-top: 4px">{{$t('deviceDetail.unbound')}}</Button>
                <div slot="content" class="remove-icon">
                    <Form :model="device" :label-width="90">
                        <FormItem v-for="item in device.account">
                            <b slot="label">{{$t('deviceDetail.account_info')}}</b>
                            <Row>
                                <Input v-model="item.app_name + ' / ' + item.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" size="20" color="#666"
                                      @click="removeAppSource(item.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                        <FormItem v-show="propSubsidiaryDevice">
                            <b slot="label">{{$t('deviceDetail.account_info')}}</b>
                            <Row>
                                <Input style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon type="ios-add-circle" style="margin-left: 5px;cursor: pointer;" size="20" color="#1bbc9c" @click="showAddAppModal=true"/>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
        </Collapse>
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;">
            <Col>
                <Button type="error" style="margin-right: 16px;" @click="deleteDevice">{{$t('deviceDetail.remove')}}</Button>
                <!--<Button type="primary" @click="reconnectDevice">重新连接</Button>-->
            </Col>
            <Col>
                <Button @click="cancelConfig">{{$t('public.btn_cancel')}}</Button>
            </Col>
        </Row>

        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal v-model="showAddSimModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-sim-list v-if="showAddSimModal" :prop-status="true" :prop-action="false" @on-row-click="onSimRowClick"></comp-sim-list>
            <div slot="footer">
                <Button type="text" @click="showAddSimModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="addSimCard">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showAddAppModal"  :fullscreen="true" :transfer="false" :closable="false">
            <comp-app-table v-if="showAddAppModal" ref="appTable" :prop-status="true" :prop-action="false" :prop-multi-select="true"></comp-app-table>
            <div slot="footer">
                <Button type="text" @click="showAddAppModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="addAppSource">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>

    </Card>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"
    import CompSimList from "./CompSimList"
    import CompAppTable from "./CompAppTable"

    const serializer = {
        deviceSerializer: {
            id: "number",
            custom_name: "string",
            custom_number: "string",
            cabinet: {
                id: "number",
                cabinet_name: "string",
                ip_address: "string",
                type: "string"
            },
            ip_address: "string",
            phone_model: {
                id: "number",
                phone_model_name: "string",
                x_border: "number",
                y_border: "number",
                x_dpi: "number",
                y_dpi: "number",
            },
            sim1:{
                id:"number",
                name:"string"
            },
            sim2:{
                id:"number",
                name:"string"
            },
            simcard:[{
                id:"number",
                operator: "string",
                order: "number",
                phone_number: "string",
            }],
            status: "string",
            serial_number: "string",
            device: {
                id: "number",
                device_name: "string",
            },
            account:[{
                id:"number",
                app_name: "string",
                name: "string",
            }]
        },
    }
    export default {
        name: "CompSubsidiaryDeviceDetail",
        components:{ CompSimList, CompAppTable },
        props:{
            propSubsidiaryDevice:{   //是否可对僚机进行操作
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                // Device data
                device: utils.validate(serializer.deviceSerializer, {}),
                spinShow:false,
                showAddSimModal:false,
                showAddAppModal:false,
                sim_id:null,
                app_id:null,
                simOrder:null,
            }
        },
        methods: {
            // Delete Device  移除僚机
            deleteDevice(){
                let device_id = this.device.id
                let device_status = this.device.status
                let detailComp = this
                if(device_status==="busy"){
                    this.$Modal.confirm({
                        title: this.$t('public.modal_warn'),
                        content:this.$t('subsidiaryDevice.tips_6'),
                    })
                }else {
                    this.$Modal.confirm({
                        title: this.$t('public.modal_warn'),
                        content: this.$t('subsidiaryDevice.tips_7'),
                        onOk(){
                            detailComp.deleteAjax(device_id)
                        }
                    });
                }
            },
            deleteAjax(device_id){
                this.spinShow = true;
                this.$ajax.post("api/v1/coral/cancel_subsidiary_device/",{
                   id:device_id
                }).then(response=>{
                    this.spinShow = false;
                    if(response.data.status==="success"){
                        this.$Message.success(this.$t('deviceDetail.tips_11'));
                        this.$emit('after-device-action')
                    } else{
                        this.$Message.error(this.$t('deviceDetail.error_3') +response.data.message);
                    }
                }).catch(error=>{
                    this.spinShow = false;
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:this.$t('deviceDetail.error_3') + error.response.data.message,duration:3});
                })
            },
            // Load data
            refresh(device_id){
                this.spinShow = true;
                this.$ajax.get('api/v1/cedar/subsidiary_device/'+ device_id +'/?fields=id,' +
                    'serial_number,' +
                    'custom_number,' +
                    'phone_model,' +
                    'phone_model.phone_model_name,' +
                    'phone_model.id,' +
                    'phone_model.x_dpi,' +
                    'phone_model.y_dpi,' +
                    'phone_model.x_border,' +
                    'phone_model.y_border,' +
                    'custom_name,' +
                    'ip_address,' +
                    'cabinet,cabinet.id,cabinet.cabinet_name,cabinet.type,' +
                    'device,device.id,device.device_name,' +
                    'simcard,simcard.operator,simcard.phone_number,simcard.order,simcard.id,' +
                    'account,account.app_name,account.name,account.id,' +
                    'status'
                ).then(deviceResponse=>{
                    this.device = utils.validate(serializer.deviceSerializer, deviceResponse.data)
                    this.device.simcard.forEach(item=>{
                        if(item.order===1){
                            this.device.sim1.id = item.id
                            this.device.sim1.name = item.operator + "_" + item.phone_number
                        }else if(item.order===2){
                            this.device.sim2.id = item.id
                            this.device.sim2.name = item.operator + "_" + item.phone_number
                        }
                    })
                    this.spinShow = false;
                }).catch(reason => {
                    this.spinShow = false;
                    if(config.DEBUG) console.log(reason)
                    let status = reason.response?reason.response.status : "Network error!"
                    this.$Message.error(this.$t('subsidiaryDevice.tips_8')+status)
                })
            },
            // Update device
            updateDevice(){
                if(this.device.custom_name.trim().length===0){
                    this.$Message.warning(this.$t('subsidiaryDevice.tips_9'));
                    return
                }
                if (!this.device.custom_name.match(/^[\u4E00-\u9FA5a-zA-Z0-9()_\-]+$/)) {
                    this.$Message.warning({content:this.$t('deviceDetail.tips_9'),duration:5})
                    return
                }
                this.$ajax.patch("/api/v1/cedar/subsidiary_device/"+ this.device.id + "/",
                    {
                        custom_name: this.device.custom_name.trim()
                    }
                ).then(response=>{
                    this.$Message.success(this.$t('subsidiaryDevice.tips_10'))
                    this.$emit('after-device-action',)
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error(this.$t('subsidiaryDevice.tips_11'))
                })
            },
            // Update device custom_cumber
            updateCustomNumber(){
                this.$ajax.patch("/api/v1/cedar/subsidiary_device/"+ this.device.id + "/",
                    {
                        custom_number: this.device.custom_number.trim()
                    }
                ).then(response=>{
                    this.$Message.success(this.$t('subsidiaryDevice.tips_12'))
                    this.$emit('after-device-action',)
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error(this.$t('subsidiaryDevice.tips_13'))
                })
            },
            cancelConfig(){
                this.$emit('afterDeviceCancel')
            },
            //选择要添加的SIM卡
            onSimRowClick(row){
                this.sim_id = row.id
            },
            //选择要添加的APP账号
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
                    subsidiary_device:this.device.id
                }).then(response=>{
                    this.$Message.success(this.$t('deviceDetail.sourceTips_3'))
                    this.showAddSimModal = false
                    this.refresh(this.device.id)
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
                    subsidiary_device:this.device.id
                }).then(response=>{
                    if(response.data.length>0){
                        this.$Modal.error({
                            title:this.$t('deviceDetail.sourceTips_6'),
                            content:this.$t('deviceDetail.sourceTips_7')+'【'+ response.data.join("】,【") +'】'+this.$t('deviceDetail.sourceTips_8')
                        })
                    }else
                        this.$Message.success(this.$t('deviceDetail.sourceTips_9'))
                    this.showAddAppModal = false
                    this.refresh(this.device.id)
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
                            history_relevance:root.device.custom_name,
                            subsidiary_device:null,
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
                            subsidiary_device:root.device.id
                        }).then(response=>{
                            root.$Message.success(root.$t('deviceDetail.unbindTips_5'))
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:root.$t('deviceDetail.unbindTips_6')+ error.response.data.message,duration:7})
                        })
                    }
                })
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
                            subsidiary_device:_this.device.id,
                            "resource_type":type
                        }).then(response=>{
                            this.$Message.success(_this.$t('deviceDetail.unbindTips_11'))
                            _this.refresh(_this.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            this.$Message.error({content:_this.$t('deviceDetail.unbindTips_12') + error.response.data.message,duration:5})
                        })
                    }
                })
            },
        },
        mounted(){

        }
    }
</script>

<style scoped>
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
