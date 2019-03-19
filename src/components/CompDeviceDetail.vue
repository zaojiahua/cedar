<template>
    <Card title="设备信息">
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
                <b slot="label">自定义名称</b>
                <Input v-model="device.device_name"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">安卓版本</b>
                <Input v-model="device.android_version" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">机柜ID</b>
                <Input v-model="device.cabinet" :disabled="true" class="disabled-input"></Input>
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
                <Input v-model="device.phone_model" :disabled="true" class="disabled-input"></Input>
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
        </Form>
        <Divider orientation="left">配置</Divider>
        <Collapse :value="[0,1,2]">
            <Panel>温度感应片配对
                <CheckboxGroup slot="content">
                    <Checkbox v-for="item in tempPorts" :key="item.id">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>智能充电口配对
                <CheckboxGroup slot="content">
                    <Checkbox v-for="item in powerPorts" :key="item.id">{{item.port}}</Checkbox>
                </CheckboxGroup>
            </Panel>
            <Panel>工业相机配对
                <CheckboxGroup slot="content">
                    <Checkbox v-for="item in monitorPorts" :key="item.id">{{item.port}}</Checkbox>
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
    </Card>
</template>

<script>
    export default {
        name: "CompDeviceDetail",
        data(){
            return {
                deviceDetailTitle: "",
                device:{
                    id: 7,
                    device_label: "device_label",
                    device_name: "Device",
                    android_version: "4.1.0",
                    cabinet: "1",
                    cpu_id: "cpu_id",
                    ip_address: "172.0.6.23",
                    monitor_index: [
                        {
                            "id": 1,
                            "port": "MA-03"
                        }
                    ],
                    phone_model: "PhoneModelName",
                    powerport: {
                        id: 1,
                        port: 'MA-01',
                        description: 'wow'
                    },
                    rom_version: {
                        "id": 1,
                        "version": "1",
                        "manufacturer": 1
                    },
                    start_time_key: "2018-01-02",
                    status: "offline",
                    tboard: [],
                    tempport: [
                        {
                            id: 1,
                            port: 'TA-01',
                            description: 'wow'
                        },
                        {
                            id: 2,
                            port: 'TA-02',
                            description: 'wow'
                        },
                        {
                            id: 3,
                            port: 'TA-03',
                            description: 'wow'
                        }
                    ]
                },
                tempPorts: [
                    {
                        id: 1,
                        port: 'TA-01',
                        description: 'wow'
                    },
                    {
                        id: 2,
                        port: 'TA-02',
                        description: 'wow'
                    },
                    {
                        id: 3,
                        port: 'TA-03',
                        description: 'wow'
                    }
                ],
                powerPorts: [
                    {
                        id: 1,
                        port: 'TA-01',
                        description: 'wow'
                    },
                    {
                        id: 2,
                        port: 'TA-02',
                        description: 'wow'
                    },
                    {
                        id: 3,
                        port: 'TA-03',
                        description: 'wow'
                    }
                ],
                monitorPorts: [
                    {
                        id: 1,
                        port: 'TA-01',
                        description: 'wow'
                    },
                    {
                        id: 2,
                        port: 'TA-02',
                        description: 'wow'
                    },
                    {
                        id: 3,
                        port: 'TA-03',
                        description: 'wow'
                    }
                ]
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
            }
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        /*border: none;*/
        background-color: #0000;
        color: #515a6e;
        /*color: #69748e;*/
        border: #eee dotted 1px;

    }

</style>