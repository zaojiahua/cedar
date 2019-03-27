<template>
    <Card :title="device.device_name + ' (' + device.device_label + ')'" style="position: relative;">
        <Form :model="device" :label-width="80">
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
                <b slot="label">手机模组</b>
                <Input v-model="device.phone_model.phone_model_name" :disabled="true" class="disabled-input"></Input>
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
                <Input v-model="device.device_name"></Input>
            </FormItem>
        </Form>
        <Collapse :value="[0,1,2]">
            <Panel>温度感应片配对
                <CheckboxGroup slot="content" v-model="selectedTempPorts">
                    <Checkbox v-for="item in tempPorts" :label="item.id" :key="item.id">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>智能充电口配对
                <CheckboxGroup slot="content" v-model="selectedPowerPorts">
                    <Checkbox v-for="item in powerPorts" :label="item.id" :key="item.id">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>工业相机配对
                <CheckboxGroup slot="content" v-model="selectedMonitorPorts">
                    <Checkbox v-for="item in monitorPorts" :label="item.id" :key="item.id">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
        </Collapse>
        <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;">
            <Col>
                <Button type="error" @click="deleteDevice">移除设备</Button>
            </Col>
            <Col>
                <Button type="primary" style="margin-right: 16px;" @click="updateDevice">保存</Button>
                <Button>取消</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const serializer = {
            deviceSerializer: {
                id: "number",
                device_label: "string",
                android_version: {
                    id: "number",
                    version: "string"
                },
                cabinet: {
                    id: "number",
                    cabinet_name: "string"
                },
                cpu_id: "string",
                ip_address: "string",
                phone_model: {
                    id: "number",
                    phone_model_name: "string"
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
        data(){
            return {
                // Device data
                device: utils.validate(serializer.deviceSerializer, {}),
                tempPorts: utils.validate(serializer.tempPortSerializer, {}).tempports,
                powerPorts: utils.validate(serializer.powerPortSerializer, {}).powerports,
                monitorPorts: utils.validate(serializer.monitorPortSerializer, {}).monitorports,
                selectedTempPorts:[],
                selectedPowerPorts: [],
                selectedMonitorPorts: [],
            }
        },
        methods: {
            // Delete Device
            deleteDevice(){
                let device_id = this.device.id
                let detailComp = this
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要删除该装置吗？",
                    onOk(){
                        this.$ajax.delete(
                            'api/v1/cedar/device/'+device_id+'/'
                        ).then(response=>{
                            this.$Message.success('删除成功')
                            detailComp.$emit('after-device-delete', response)
                        }).catch(reason => {
                            this.$Message.success('删除失败')
                        })
                    }
                });
            },
            // Load data
            refresh(device_id){
                let ajax = this.$ajax
                this.selectedTempPorts = []
                this.selectedPowerPorts = []
                this.selectedMonitorPorts = []
                ajax.all(
                    [
                        ajax.get(
                            "api/v1/cedar/device/"+device_id+"/?fields=" +
                            "id," +
                            "device_label," +
                            "android_version,android_version.id,android_version.version," +
                            "cabinet,cabinet.id,cabinet.cabinet_name," +
                            "cpu_id," +
                            "ip_address," +
                            "phone_model,phone_model.id,phone_model.phone_model_name," +
                            "rom_version,rom_version.id,rom_version.version," +
                            "start_time_key," +
                            "status," +
                            "device_name," +
                            "tempport,tempport.id,tempport.port,tempport.description," +
                            "powerport,powerport.id,powerport.port," +
                            "monitor_index,monitor_index.id,monitor_index.port"
                        ),
                        ajax.get("api/v1/cedar/temp_port/?fields=" +
                            "id," +
                            "port," +
                            "description," +
                            "device," +
                            "device.id"),
                        ajax.get("api/v1/cedar/power_port/?fields=" +
                            "id," +
                            "port," +
                            "device," +
                            "device.id"),
                        ajax.get("api/v1/cedar/monitor_port/?fields=" +
                            "id," +
                            "port," +
                            "device," +
                            "device.id")
                    ]
                ).then(ajax.spread((deviceResponse, tempPortResponse, powerPortResponse, monitorPortResponse)=>{
                    this.device = utils.validate(serializer.deviceSerializer, deviceResponse.data)
                    this.tempPorts = utils.validate(serializer.tempPortSerializer, tempPortResponse.data).tempports
                    this.powerPorts = utils.validate(serializer.powerPortSerializer, powerPortResponse.data).powerports
                    this.monitorPorts = utils.validate(serializer.monitorPortSerializer, monitorPortResponse.data).monitorports

                    let ports = []
                    this.device.tempport.forEach(port=>{
                        ports.push(port.id)
                    })
                    this.selectedTempPorts = ports

                    this.selectedPowerPorts = this.device.powerport.id!==null?[this.device.powerport.id]:[]

                    ports = []
                    this.device.monitor_index.forEach(port=>{
                        ports.push(port.id)
                    })
                    this.selectedMonitorPorts = ports

                })).catch(reason => {
                    if(config.DEBUG)
                        console.log(reason)
                    let status = reason.response?reason.response.status : "Network error!"
                    this.$Message.error("读取数据时出错! "+status)
                })

            },
            // Update device
            updateDevice(){
                this.$ajax.patch(
                    "api/v1/cedar/device/"+this.device.id+"/",
                    {
                        device_name: this.device.device_name,
                        monitor_index: this.selectedMonitorPorts,
                        powerport: this.selectedPowerPorts.length > 0 ? this.selectedPowerPorts[0] : null,
                        tempport: this.selectedTempPorts
                    }
                ).then(response => {
                    this.$Message.success("更新成功")
                    this.$emit('after-device-update', response)
                }).catch(reason => {
                    if(config.debug) console.log(reason)
                    this.$Message.error("更新失败")
                })

            },

        },
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }

</style>