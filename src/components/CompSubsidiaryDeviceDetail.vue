<template>
    <Card :title="device.custom_name + ' (' + device.serial_number + ')'" style="position: relative;" dis-hover>
        <Form :model="device" :label-width="100">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="device.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">编号</b>
                <Input v-model="device.serial_number" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">机柜</b>
                <Input v-model="device.cabinet.cabinet_name" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">IP</b>
                <Input v-model="device.ip_address" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">状态</b>
                <Input v-model="device.status" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <Divider></Divider>
            <FormItem>
                <b slot="label"><span class="need">*</span>自定义名称</b>
                <Input style="width: 80%" v-model="device.custom_name"></Input>
                <Button type="primary" @click="updateDevice">修改</Button>
            </FormItem>
        </Form>
        <Collapse :value="[0,1,2,3,4,5]">
            <Panel>机型信息
                <div  slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">手机型号</b>
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
                            <b slot="label">X边框厚度</b>
                            <Input v-model="device.phone_model.x_border" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                        <FormItem>
                            <b slot="label">Y边框厚度</b>
                            <Input v-model="device.phone_model.y_border" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>关联主机
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">关联主机</b>
                            <Input v-model="device.device.device_name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>SIM卡信息
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem>
                            <b slot="label">SIM卡1</b>
                            <Row>
                                <Input v-model="device.sim1.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice&& !device.sim1.id" type="ios-add-circle" size="20" color="#1bbc9c"
                                      @click="showAddSimModal=true;simOrder=1" style="margin-left: 5px;cursor: pointer;"/>
                                <Icon v-show="propSubsidiaryDevice&& device.sim1.id" type="md-remove-circle" size="20" color="red"
                                      @click="removeSimCard(device.sim1.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <b slot="label">SIM卡2</b>
                            <Row>
                                <Input v-model="device.sim2.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice&& !device.sim2.id" type="ios-add-circle" size="20" color="#1bbc9c"
                                      @click="showAddSimModal=true;simOrder=2" style="margin-left: 5px;cursor: pointer;"/>
                                <Icon v-show="propSubsidiaryDevice&& device.sim2.id" type="md-remove-circle" size="20" color="red"
                                      @click="removeSimCard(device.sim2.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </Panel>
            <Panel>账号信息
                <div slot="content">
                    <Form :model="device" :label-width="90">
                        <FormItem v-for="item in device.account">
                            <b slot="label">账号</b>
                            <Row>
                                <Input v-model="item.app_name + ' / ' + item.name" style="width: 80%" :disabled="true" class="disabled-input"></Input>
                                <Icon v-show="propSubsidiaryDevice" type="md-remove-circle" size="20" color="red"
                                      @click="removeAppSource(item.id)" style="margin-left: 5px;cursor: pointer;"/>
                            </Row>
                        </FormItem>
                        <FormItem v-show="propSubsidiaryDevice">
                            <b slot="label">账号</b>
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
                <Button type="error" style="margin-right: 16px;" @click="deleteDevice">移除设备</Button>
                <!--<Button type="primary" @click="reconnectDevice">重新连接</Button>-->
            </Col>
            <Col>
                <Button @click="cancelConfig">取消</Button>
            </Col>
        </Row>

        <Spin size="large" fix v-if="spinShow"></Spin>
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
    import CompSimList from "./CompSimList"
    import CompAppTable from "./CompAppTable"

    const serializer = {
        deviceSerializer: {
            id: "number",
            custom_name: "string",
            cabinet: {
                id: "number",
                cabinet_name: "string",
                ip_address: "string"
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
                        title: "警告！",
                        content: "当前设备正在执行任务，不允许移除",
                    })
                }else {
                    this.$Modal.confirm({
                        title: "警告！",
                        content: "您确定要从系统中移除该设备吗？",
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
                        this.$Message.success("该设备已从系统中移除");
                        this.$emit('after-device-action')
                    } else{
                        this.$Message.error("设备移除失败！" +response.data.message);
                    }
                }).catch(error=>{
                    this.spinShow = false;
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"设备移除失败！" + error.response.data.message,duration:3});
                })
            },
            // Load data
            refresh(device_id){
                this.spinShow = true;
                this.$ajax.get('api/v1/cedar/subsidiary_device/'+ device_id +'/?fields=id,' +
                    'serial_number,' +
                    'phone_model,' +
                    'phone_model.phone_model_name,' +
                    'phone_model.id,' +
                    'phone_model.x_dpi,' +
                    'phone_model.y_dpi,' +
                    'phone_model.x_border,' +
                    'phone_model.y_border,' +
                    'custom_name,' +
                    'ip_address,' +
                    'cabinet,cabinet.id,cabinet.cabinet_name,' +
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
                    this.$Message.error("获取僚机详情出错! "+status)
                })
            },
            // Update device
            updateDevice(){
                if(this.device.custom_name.trim().length===0){
                    this.$Message.warning("自定义名称不能为空！");
                    return
                }
                this.$ajax.patch("/api/v1/cedar/subsidiary_device/"+ this.device.id + "/",
                    {
                        custom_name: this.device.custom_name.trim()
                    }
                ).then(response=>{
                    this.$Message.success("自定义名称修改成功")
                    this.$emit('after-device-action',)
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error("自定义名称修改失败")
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
            onAppRowClick(row){
                this.app_id = row.id
            },
            //add SIM card/---/app
            addSimCard(){
                this.$ajax.patch("api/v1/cedar/simcard/" + this.sim_id + "/",{
                    order: this.simOrder,
                    status:"busy",
                    subsidiary_device:this.device.id
                }).then(response=>{
                    this.$Message.success("SIM卡绑定成功")
                    this.showAddSimModal = false
                    this.refresh(this.device.id)
                }).catch(error=>{
                    this.$Message.error({content:"SIM卡绑定失败"+ error.response.data.message,duration:6})
                })
            },
            addAppSource(){
                this.$ajax.post("api/v1/cedar/bind_account_source/",{
                    id:this.app_id,
                    subsidiary_device:this.device.id
                }).then(response=>{
                    this.$Message.success("app账号资源绑定成功")
                    this.showAddAppModal = false
                    this.refresh(this.device.id)
                }).catch(error=>{
                    this.$Message.error({content:"app账号资源绑定失败"+ error.response.data.message,duration:6})
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
                            history_relevance:root.device.custom_name,
                            subsidiary_device:null,
                        }).then(response=>{
                            root.$Message.success("SIM卡解绑成功")
                            root.showAddSimModal = false
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
                            subsidiary_device:root.device.id
                        }).then(response=>{
                            root.$Message.success("账号资源解绑成功")
                            root.showAddAppModal = false
                            root.refresh(root.device.id)
                        }).catch(error=>{
                            if(config.DEBUG) console.log(error)
                            root.$Message.error({content:"账号资源解绑失败"+ error.response.data.message,duration:7})
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

</style>
