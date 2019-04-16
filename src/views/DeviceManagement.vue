<template>
    <Card :shadow="true" :bordered="true">
        <Tabs value="deviceList" style="background: #fff;">
            <TabPane label="测试设备列表" name="deviceList" :strip="true">
                <comp-device-list ref="deviceList" @on-row-click="onDeviceRowClick">
                    <Drawer slot="detail" v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
                        <comp-device-detail ref="deviceDetail" :editable="true" @after-device-delete="afterDeviceDelete"
                                            @after-device-update="afterDeviceUpdate"></comp-device-detail>
                    </Drawer>
                </comp-device-list>
            </TabPane>
            <TabPane label="温度感应片列表" name="tempPortList">
                <comp-temp-port-list></comp-temp-port-list>
            </TabPane>
            <TabPane label="智能充电口列表" name="powerPortList">
                <comp-power-port-list></comp-power-port-list>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"
    import CompTempPortList from "../components/CompTempPortList";
    import CompPowerPortList from "../components/CompPowerPortList";

    export default {
        components: {
            CompDeviceList,
            CompDeviceDetail,
            CompTempPortList,
            CompPowerPortList
        },
        data() {
            return {
                // Device
                showDeviceDetail: false,
                deviceDetailId: null
            }
        },
        methods: {
            // Device
            onDeviceRowClick(row, index) {
                this.showDeviceDetail = true
                this.$refs.deviceDetail.refresh(row.id)
            },
            afterDeviceUpdate(){
                this.showDeviceDetail = false
                this.$refs.deviceList.refresh()
            },
            afterDeviceDelete(){
                this.showDeviceDetail = false
                this.$refs.deviceList.refresh()
            }
        }
    }
</script>

<style scoped>

</style>