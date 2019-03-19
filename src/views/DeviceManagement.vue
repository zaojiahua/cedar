<template>
    <Card :shadow="true" :bordered="true">
        <Tabs value="deviceList" style="background: #fff;">
            <TabPane label="测试设备列表" name="deviceList" :strip="true">
                <CheckboxGroup v-model="deviceColumnChecked" style="padding-bottom: 16px;"
                               @on-change="changeTableDeviceColumn">
                    <Checkbox v-for="item in deviceColumn" :label="item.key" :key="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
                <!--<Select v-model="model10" multiple :transfer="true"-->
                        <!--placeholder="请选择显示的栏位" style="width:500px; padding-bottom:16px;">-->
                    <!--<Option v-for="item in defaultDeviceListColumn" :value="item.key" :key="item.key">{{ item.title }}</Option>-->
                <!--</Select>-->
                <Table stripe border :columns="tableDeviceColumn" :data="devices"></Table>
            </TabPane>
            <TabPane label="温度感应片列表" name="tempPortList"></TabPane>
            <TabPane label="智能充电口列表" name="powerPortList"></TabPane>
        </Tabs>
    </Card>
</template>

<script>
    export default {
        data(){
            window.test = this
            return {
                deviceColumn: {
                    "device_label":
                    {
                        title: "设备编号",
                        key: "device_label",
                        sortable: true
                    },
                    "device_name":{
                        title: "自定义名称",
                        key: "device_name",
                        sortable: true
                    },
                    "phone_model":{
                        title: "设备型号",
                        key: "phone_model",
                        sortable: true
                    },
                    "rom_version":{
                        title: "ROM版本",
                        key: "rom_version",
                        sortable: true
                    },
                    "android_version":{
                        title: "安卓版本",
                        key: "android_version",
                        sortable: true
                    },
                    "cpu_name":{
                        title: "CPU型号",
                        key: "cpu_name",
                        sortable: true
                    },
                    "ip_address":{
                        title: "IP",
                        key: "ip_address",
                        sortable: true
                    },
                    "status":{
                        title: "使用状态",
                        key: "status",
                        sortable: true
                    },
                    "power":{
                        title: "电量",
                        key: "power",
                        sortable: true
                    },
                    "power_port":{
                        title: "充电口",
                        key: "power_port",
                        sortable: true
                    },
                    "temp_port":{
                        title: "温感片",
                        key: "temp_port",
                        sortable: true
                    },
                    "monitor_port":{
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
                ]
            }
        },
        methods:{
            getDeviceColumn(){
                let data = []
                this.deviceColumnChecked.forEach(
                    col=>data.push(this.deviceColumn[col])
                )
                return data
            },
            changeTableDeviceColumn(){
                this.tableDeviceColumn = this.getDeviceColumn()
            }
        },
        mounted() {
            this.deviceColumnChecked = [
                "device_label", "device_name", "phone_model", "status"
            ]
            this.changeTableDeviceColumn()
        }
    }
</script>

<style scoped>

</style>