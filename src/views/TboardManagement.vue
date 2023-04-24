<template>
    <Card dis-hover>
        <Drawer v-model="showTboardDetail" width="60" :closable="false" transfer :mask="!tboardDetailQuickView">
            <Button icon="md-arrow-dropright" size="small" @click="showTboardDetail = false"
                    style="position: fixed; top:45%; width:32px; height:64px;"></Button>
            <comp-tboard-detail style="margin-left: 48px;"
                                @on-cell-click="onTboardDetailCellClick"
                                @on-total-result-click="onTboardDetailTotalResultClick"
                                @on-job-cell-click="onTboardDetailJobCellClick"
                                ref="tboardDetail"></comp-tboard-detail>
        </Drawer>

        <comp-tboard-list style="margin-top: 16px;" @on-row-click="onTboardRowClick" :propShowActionColumn="true" :prop-poll="true" :propDeleteMore="true">
            <div slot="header-bottom"  style="margin-top: 16px;">
                <Tooltip :content="$t('myTask.toolTip')" max-width="100">
                    <span style="font-size: 12px;">{{$t('myTask.view')}}</span><Icon type="ios-help-circle-outline" style=" margin-right: 4px;" />
                </Tooltip>
                <i-switch v-model="tboardDetailQuickView" size="small"></i-switch>
            </div>

        </comp-tboard-list>

        <Drawer v-model="showTboardMoreDetail" width="50" :closable="false" transfer>
            <comp-tboard-device-detail ref="tboardDeviceDetail"></comp-tboard-device-detail>
        </Drawer>
        <Drawer v-model="showTboardJobDetail" width="50" :closable="false" transfer>
            <comp-tboard-job-detail ref="tboardJobDetail"></comp-tboard-job-detail>
        </Drawer>
    </Card>
</template>

<script>
    import CompTboardList from "../components/CompTboardList";
    import CompTboardDetail from "../components/CompTboardDetail";
    import CompTboardDeviceDetail from "../components/CompTboardDeviceDetail";
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompTboardJobDetail from "../components/CompTboardJobDetail";

    export default {
        name: "TboardManagement",
        components: {CompDeviceDetail, CompTboardDeviceDetail, CompTboardDetail, CompTboardList, CompTboardJobDetail},
        data() {
            return {
                showTboardDetail: false,
                showTboardMoreDetail: false,
                tboardDetailQuickView: false,
                showTboardJobDetail:false,
            }
        },
        methods: {
            onTboardRowClick(row, index) {
                this.showTboardDetail = true
                this.$refs.tboardDetail.refresh(row.id)
            },
            onTboardDetailTotalResultClick(){
                let tboard = this.$refs.tboardDetail.getData()
                let route = this.$router.resolve({
                    name: "rds-management",
                    query: {
                        tboard: tboard.id
                    }
                })
                window.open(route.href, "_blank")
            },
            onTboardDetailCellClick(tboardId, statistic){
                this.showTboardMoreDetail = true
                this.$refs.tboardDeviceDetail.refresh(tboardId, statistic)
            },
            onTboardDetailJobCellClick(tboardId,statistic){
                this.showTboardJobDetail = true
                this.$refs.tboardJobDetail.refresh(tboardId, statistic)
            }
        }
    }
</script>

<style scoped>

</style>
