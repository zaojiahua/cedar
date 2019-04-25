<template>
    <Card dis-hover>
        <Drawer v-model="showTboardDetail" width="60" :closable="false" transfer :mask="!tboardDetailQuickView">
            <Button icon="md-arrow-dropright" size="small" @click="showTboardDetail = false"
                    style="position: fixed; top:45%; width:32px; height:64px;"></Button>
            <comp-tboard-detail style="margin-left: 48px;" @on-cell-click="onTboardDetailCellClick"
                                ref="tboardDetail"></comp-tboard-detail>
        </Drawer>

        <comp-tboard-list style="margin-top: 16px;" @on-row-click="onTboardRowClick" :propShowActionColumn="true">
            <div slot="header-bottom"  style="margin-top: 16px;">
                <Tooltip content="开启后, 将关闭任务详情页面的遮罩，可以在多个任务之间快速切换浏览" max-width="100">
                    <span style="font-size: 12px; margin-right: 4px;">快速阅览</span>
                </Tooltip>
                <i-switch v-model="tboardDetailQuickView" size="small"></i-switch>
            </div>

        </comp-tboard-list>

        <Drawer v-model="showTboardMoreDetail" width="50" :closable="false" transfer>
            <comp-tboard-device-detail ref="tboardDeviceDetail"></comp-tboard-device-detail>
        </Drawer>
    </Card>
</template>

<script>
    import CompTboardList from "../components/CompTboardList";
    import CompTboardDetail from "../components/CompTboardDetail";
    import CompTboardDeviceDetail from "../components/CompTboardDeviceDetail";
    import CompDeviceDetail from "../components/CompDeviceDetail";

    export default {
        name: "TboardManagement",
        components: {CompDeviceDetail, CompTboardDeviceDetail, CompTboardDetail, CompTboardList},
        data() {
            return {
                showTboardDetail: false,
                showTboardMoreDetail: false,
                tboardDetailQuickView: false
            }
        },
        methods: {
            onTboardRowClick(row, index) {
                this.showTboardDetail = true
                this.$refs.tboardDetail.refresh(row.id)
            },
            onTboardDetailCellClick(tboardId, statistic){
                this.showTboardMoreDetail = true
                this.$refs.tboardDeviceDetail.refresh(tboardId, statistic)
            }
        }
    }
</script>

<style scoped>

</style>