<template>
    <Card :shadow="true" :bordered="true">
        <Tabs value="deviceList" style="background: #fff;"  @on-click="onTabClick">
            <TabPane label="测试设备列表" name="deviceList" :strip="true">
                <comp-device-list ref="deviceList" @on-row-click="onDeviceRowClick">
                    <Drawer slot="detail" v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
                        <comp-device-detail ref="deviceDetail" :editable="true" @after-device-delete="afterDeviceDelete" :prop-subsidiary-device="true"
                                            @after-device-update="afterDeviceUpdate" @afterDeviceCancel="afterDeviceCancel"></comp-device-detail>
                    </Drawer>
                </comp-device-list>
            </TabPane>
            <TabPane label="硬件设备列表" name="hardWare">
                <Comp-hard-ware-list ref="hardWareList"></Comp-hard-ware-list>
            </TabPane>
            <TabPane label="设备地图" name="paneList">
                <comp-pane-list ref="paneViewList"></comp-pane-list>
            </TabPane>

        </Tabs>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"
    import CompPaneList from "../components/CompPaneList";
    import CompHardWareList from "../components/CompHardWareList";

    export default {
        components: {
            CompDeviceList,
            CompDeviceDetail,
            CompPaneList,
            CompHardWareList,
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
            },
            afterDeviceCancel(){
                this.showDeviceDetail = false
            },
            onTabClick(name){
                if(name==="hardWare"){
                    this.$refs.hardWareList.tableList = 1
                    this.$nextTick(function(){
                        this.$refs.hardWareList.$refs.hardWareTable.getHardWareData()
                    })
                }else if(name==="paneList"){
                    this.$refs.paneViewList.refresh()
                }
            }
        }
    }
</script>

<style scoped>

</style>