<template>
    <Card :title="device.device_name + ' (' + device.device_label + ')'" style="position: relative;">
        <Spin fix v-show="loading"></Spin>
        <p v-if="loadingError">资料载入失败!</p>
        <div v-if="(!loading) && (!loadingError)">
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
                    <CheckboxGroup slot="content">
                        <Checkbox v-for="item in device.tempport" :key="item.id">{{item.port}}</Checkbox>
                    </CheckboxGroup>
                </Panel>
                <Panel>智能充电口配对
                    <CheckboxGroup slot="content">
                        <Checkbox v-for="item in device.powerport" :key="item.id">{{item.port}}</Checkbox>
                    </CheckboxGroup>
                </Panel>
                <Panel>工业相机配对
                    <CheckboxGroup slot="content">
                        <Checkbox v-for="item in device.monitor_index" :key="item.id">{{item.port}}</Checkbox>
                    </CheckboxGroup>
                </Panel>
            </Collapse>
            <Row align="middle" justify="space-between" type="flex" style="margin-top: 32px;">
                <Col>
                    <Button type="error" @click="deleteDevice">移除设备</Button>
                </Col>
                <Col>
                    <Button type="primary" style="margin-right: 16px;">保存</Button>
                    <Button>取消</Button>
                </Col>
            </Row>
        </div>
    </Card>
</template>

<script>
    import utils from "../lib/utils"

    const deviceSerializer= {
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
            powerport:[
                {
                    id: "number",
                    port: "string"
                }
                ],
            monitor_index: [
                {
                    id: "number",
                    port: "string"
                }
                ]

        }
    export default {
        name: "CompDeviceDetail",
        data(){
            return {
                // Device data
                device: utils.validate(deviceSerializer, {}),
                // Page status
                loading: true,
                loadingError: false
            }
        },
        methods: {
            deleteDevice(){
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要删除该装置吗？",
                    onOk(){

                    },
                    onCancel:()=>{

                    }
                });
            },
            refreshData(device_id){
                this.loading = true
                this.$ajax.get(
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
                ).then(response=>{
                    this.device = utils.validate(deviceSerializer, response.data)
                    // 确保这里有呼叫loadingError = false, 以避免并发的refresh呼叫导致页面状态错误。
                    this.loading = false
                    this.loadingError = false
                }).catch(reason=>{
                    this.$Notice.error({
                        title: "取得数据失败, 请检查网路连线"
                    })
                    this.loading = false
                    this.loadingError = true
                })
            }

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