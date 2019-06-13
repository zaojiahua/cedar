<template>
    <Tabs value="rdsGroupByDevice">
        <TabPane label="测试数据视图" name="rdsGroupByDevice">
            <comp-rds-list></comp-rds-list>
        </TabPane>
        <TabPane label="日志文件搜索" name="logSearch">
            <comp-rds-log-search></comp-rds-log-search>
        </TabPane>
    </Tabs>
</template>

<script>
    import CompRdsLogSearch from "../components/CompRdsLogSearch";
    import CompRdsList from "../components/CompRdsList";

    export default {
        components: {CompRdsLogSearch, CompRdsList},
    }

</script>
