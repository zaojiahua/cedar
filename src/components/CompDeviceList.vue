<template>
    <div>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail></comp-device-detail>
        </Drawer>
        <Modal v-model="showAddDevice" :closable="false" :footer-hide="true">
            <transition>
                <Card dis-hover title="第一步: 请对待添加设备执行" v-if="addDeviceStep === 1">
                    <Steps direction="vertical" :current="-1">
                        <Step title="将设备添加到专用USB接口"></Step>
                        <Step title="将添加设备连接到TMach系统WLAN"></Step>
                        <Step title='开启"USB调试功能"与"通过USB安装APP"'></Step>
                        <Step title='关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮'></Step>
                    </Steps>
                    <Row type="flex" justify="center" style="margin-top: 16px">
                        <Button type="primary" @click="addDeviceStep=2 ">下一步</Button>
                    </Row>
                </Card>
                <Card dis-hover title="第二步: 设置权限" v-if="addDeviceStep === 2" style="text-align:center;">
                    <p>请在待添加设备弹出窗口中勾选</p>
                    <p><b>始终允许这台计算机进行调试</b></p>
                    <p>并点击确定</p>
                    <br><br><br><br><br><br>
                    <small>(如果已设置，可直接点击"下一步")</small>
                    <Row type="flex" justify="center" style="margin-top: 16px">
                        <Button type="primary" @click="addDeviceStep=3 ">下一步</Button>
                        <Button type="error" @click="addDeviceError('ip侦测失败', '侦测不到xxx装置的IP位置')">错误DEMO</Button>
                    </Row>
                </Card>
                <Card dis-hover title="第三步: 添加设备" v-if="addDeviceStep === 3">
                    <Form :label-width="80">
                        <FormItem>
                            <b slot="label">设备编号</b>
                            <p>Device</p>
                        </FormItem>
                        <FormItem>
                            <b slot="label">ROM版本</b>
                            <p>6.3.24</p>
                        </FormItem>
                        <FormItem>
                            <b slot="label">安卓版本</b>
                            <p>5.0.2</p>
                        </FormItem>
                        <FormItem>
                            <b slot="label">IP位置</b>
                            <p>10.80.3.101</p>
                        </FormItem>
                        <FormItem>
                            <b slot="label">自定义名称</b>
                            <Input v-model="addedDeviceName"></Input>
                        </FormItem>
                    </Form>
                    <Row type="flex" justify="center">
                        <Button type="primary">添加</Button>
                    </Row>
                </Card>
            </transition>
        </Modal>
        <Row type="flex" justify="space-between">
            <Col span="20">
                <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                               @on-change="onTableColumnChange">
                    <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </Col>
            <Col>
                <Button icon="md-add" type="primary" @click="showAddDevice=true; addDeviceStep=1">添加装置</Button>
            </Col>
        </Row>

        <Table border :columns="tableDeviceColumn" :data="devices" @on-row-click="onDeviceRowClick"></Table>
    </div>
</template>

<script>
    import CompDeviceDetail from "./CompDeviceDetail";

    export default {
        name: "CompDeviceManagement",
        components: {CompDeviceDetail},
        data() {
            return {
                deviceColumn: {
                    "device_label":
                        {
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
                        sortable: true
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
                        sortable: true
                    },
                    "power": {
                        title: "电量",
                        key: "power",
                        sortable: true
                    },
                    "power_port": {
                        title: "充电口",
                        key: "power_port",
                        sortable: true
                    },
                    "temp_port": {
                        title: "温感片",
                        key: "temp_port",
                        sortable: true
                    },
                    "monitor_port": {
                        title: "相机",
                        key: "monitor_port",
                        sortable: true
                    }
                },
                deviceColumnChecked: [],
                tableDeviceColumn: [],
                devices: [
                    {
                        device_label: "device_label",
                        device_name: "device_name",
                        phone_model: "phone_model"
                    },
                    {
                        device_label: "device_label2",
                        device_name: "device_name",
                        phone_model: "phone_model"
                    }
                ],
                showDeviceDetail: false,
                // Add device
                showAddDevice: false,
                addDeviceStep: 1,
                addedDeviceName: "",
            }
        },
        methods: {
            getDeviceColumn() {
                let data = []
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
            onDeviceRowClick(data, index) {
                this.deviceDetailTitle = data.device_name
                this.showDeviceDetail = true
            },
            // Add device
            addDeviceError(title, desc){
                this.$Notice.error({
                    title: title,
                    desc: desc,
                    duration: 0
                });
            }
        },
        mounted() {
            this.deviceColumnChecked = localStorage.getItem("device-management:DEFAULT_DEVICE_COLUMN").split(",")
            this.onTableColumnChange()
        }
    }
</script>

<style scoped>

</style>