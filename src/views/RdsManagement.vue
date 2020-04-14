<template>
    <!--<Tabs value="rdsGroupByDevice">-->
        <!--<TabPane label="测试数据视图" name="rdsGroupByDevice">-->
            <!--<comp-rds-list></comp-rds-list>-->
        <!--</TabPane>-->
        <!--<TabPane label="日志文件搜索" name="logSearch">-->
            <!--<comp-rds-log-search></comp-rds-log-search>-->
        <!--</TabPane>-->
    <!--</Tabs>-->

    <Tabs value="rdsGroupByDevice" name="outer">
        <TabPane label="设备数据视图" name="rdsGroupByDevice" tab="outer">
            <comp-rds-device-view></comp-rds-device-view>
        </TabPane>
        <!--<TabPane label="用例数据视图" name="rdsGroupByJob" tab="outer">-->
            <!--&lt;!&ndash;<comp-rds-device-view></comp-rds-device-view>&ndash;&gt;-->
        <!--</TabPane>-->
        <!--<TabPane label="任务数据视图" name="rdsGroupByTboard" tab="outer">-->
            <!--&lt;!&ndash;<comp-rds-device-view></comp-rds-device-view>&ndash;&gt;-->
        <!--</TabPane>-->
        <TabPane label="日志文件搜索" name="logSearch">
            <comp-rds-log-search></comp-rds-log-search>
        </TabPane>
    </Tabs>




</template>

<script>
    import CompRdsLogSearch from "../components/CompRdsLogSearch";
    import CompRdsList from "../components/CompRdsList";
    import CompRdsDeviceView from "../components/CompRdsDeviceView";
    import CompDynamicLoadingChart from "../components/CompDynamicLoadingChart";


    export default {
        components: {CompRdsLogSearch, CompRdsList , CompRdsDeviceView, CompDynamicLoadingChart},
    }

</script>
