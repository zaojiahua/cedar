<template>
    <Card :shadow="true" :bordered="true">
        <Tabs value="deviceList" style="background: #fff;">
            <TabPane label="测试设备列表" name="deviceList" :strip="true">
                <comp-device-list></comp-device-list>
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
    import CompTempPortList from "../components/CompTempPortList";
    import CompPowerPortList from "../components/CompPowerPortList";

    export default {
        components: {
            CompDeviceList,
            CompTempPortList,
            CompPowerPortList
        },
        data(){
            return {

            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>