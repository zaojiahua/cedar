<template>
    <Tabs v-model="tabName" name="outer" style="overflow: visible">
        <TabPane label="启动时间数据" name="startTime" tab="outer">
            <comp-perf-data-view></comp-perf-data-view>
        </TabPane>

        <TabPane label="其他性能数据" name="otherPerfData" tab="outer">

        </TabPane>
    </Tabs>
</template>

<script>
    import CompPerfDataView from "../components/CompPerfDataView"

    export default {
        components: { CompPerfDataView, },
        data() {
            return {
                tabName:"startTime",

            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>