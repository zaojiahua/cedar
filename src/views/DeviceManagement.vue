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
            <TabPane label="僚机列表" name="subsidiary">
                <comp-subsidiary-device-list ref="subsidiaryDeviceList" @on-row-click="onSubsidiaryDeviceRowClick">
                    <Drawer slot="detail" v-model="showSubsidiaryDeviceDetail" :draggable="true" :closable="false" width="50">
                        <comp-subsidiary-device-detail ref="subsidiaryDeviceDetail" :prop-subsidiary-device="true"
                                                       @after-device-action="afterSubsidiaryDeviceAction"
                                                       @afterDeviceCancel="afterSubsidiaryDeviceCancel">
                        </comp-subsidiary-device-detail>
                    </Drawer>
                </comp-subsidiary-device-list>
            </TabPane>
            <TabPane label="附加资源列表" name="resources">
                <comp-additional-resources-list ref="resourcesList"></comp-additional-resources-list>
            </TabPane>
            <TabPane label="设备地图" name="paneList">
                <comp-pane-list ref="paneViewList"></comp-pane-list>
            </TabPane>
            <TabPane label="硬件设备列表" name="hardWare">
                <Comp-hard-ware-list ref="hardWareList"></Comp-hard-ware-list>
            </TabPane>

        </Tabs>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"
    import CompPaneList from "../components/CompPaneList";
    import CompHardWareList from "../components/CompHardWareList";
    import CompAdditionalResourcesList from "../components/CompAdditionalResourcesList";
    import CompSubsidiaryDeviceList from "../components/CompSubsidiaryDeviceList";
    import CompSubsidiaryDeviceDetail from "../components/CompSubsidiaryDeviceDetail";

    export default {
        components: {
            CompDeviceList,
            CompDeviceDetail,
            CompPaneList,
            CompHardWareList,
            CompAdditionalResourcesList,
            CompSubsidiaryDeviceList,
            CompSubsidiaryDeviceDetail,
        },
        data() {
            return {
                // Device
                showDeviceDetail: false,
                showSubsidiaryDeviceDetail:false,
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
                }else if(name==="subsidiary"){
                    this.$refs.subsidiaryDeviceList.refresh()
                }else if(name==="resources"){
                    this.$refs.resourcesList.tableList = 1
                    this.$nextTick(function(){
                        this.$refs.resourcesList.$refs.simTable.getData()
                    })
                }
            },
            //subsidiaryDevice
            onSubsidiaryDeviceRowClick(row,){
                this.showSubsidiaryDeviceDetail = true
                this.$refs.subsidiaryDeviceDetail.refresh(row.id)
            },
            afterSubsidiaryDeviceAction(){
                this.showSubsidiaryDeviceDetail = false
                this.$refs.subsidiaryDeviceList.refresh()
            },
            afterSubsidiaryDeviceCancel(){
                this.showSubsidiaryDeviceDetail = false
            },

        }
    }
</script>

<style scoped>

</style>