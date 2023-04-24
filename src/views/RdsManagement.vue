<template>
    <!--<Tabs value="rdsGroupByDevice">-->
        <!--<TabPane label="测试数据视图" name="rdsGroupByDevice">-->
            <!--<comp-rds-list></comp-rds-list>-->
        <!--</TabPane>-->
        <!--<TabPane label="日志文件搜索" name="logSearch">-->
            <!--<comp-rds-log-search></comp-rds-log-search>-->
        <!--</TabPane>-->
    <!--</Tabs>-->

    <Tabs v-model="tabName" name="outer">
        <TabPane :label="$t('rdsManagement.view_1')" name="rdsGroupByDevice" tab="outer">
            <comp-rds-device-view></comp-rds-device-view>
        </TabPane>
        <!--<TabPane label="用例数据视图" name="rdsGroupByJob" tab="outer">-->
            <!--&lt;!&ndash;<comp-rds-device-view></comp-rds-device-view>&ndash;&gt;-->
        <!--</TabPane>-->
        <TabPane :label=tabLabel name="rdsGroupByTboard" tab="outer" icon="ios-arrow-down" context-menu>
            <comp-rds-tboard-view :prop-tab-name="tabLabel"></comp-rds-tboard-view>
        </TabPane>
        <TabPane :label="$t('rdsManagement.view_2')" name="logSearch">
            <comp-rds-log-search></comp-rds-log-search>
        </TabPane>
        <template slot="contextMenu">
            <DropdownItem @click.native="tabLabel=$t('rdsManagement.view_3')">{{$t('rdsManagement.view_3')}}</DropdownItem>
            <DropdownItem @click.native="tabLabel=$t('rdsManagement.view_4')">{{$t('rdsManagement.view_4')}}</DropdownItem>
        </template>
    </Tabs>




</template>

<script>
    import CompRdsLogSearch from "../components/CompRdsLogSearch";
    import CompRdsList from "../components/CompRdsList";
    import CompRdsDeviceView from "../components/CompRdsDeviceView";
    import CompRdsTboardView from "../components/CompRdsTboardView";
    import CompDynamicLoadingChart from "../components/CompDynamicLoadingChart";


    export default {
        components: {CompRdsLogSearch, CompRdsList , CompRdsDeviceView, CompDynamicLoadingChart, CompRdsTboardView},
        data(){
            return{
                tabName:"rdsGroupByDevice",
                tabLabel:this.$t('rdsManagement.view_3'),
            }
        },
        methods:{
        },
        mounted(){
            let tboardId = NaN
            if(this.$route.query.hasOwnProperty("tboard")) {
                tboardId = _.parseInt(this.$route.query.tboard)
            }
            if(isNaN(tboardId)) return
            this.tabName = "rdsGroupByTboard"

        }
    }

</script>

<style scoped>
    /deep/.ivu-tabs-nav .ivu-tabs-tab .ivu-icon{
        margin-right: 0!important;
    }
</style>
