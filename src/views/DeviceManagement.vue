<template>
    <Card :shadow="true" :bordered="true">
        <Tabs value="deviceList" style="background: #fff;">
            <TabPane label="测试设备列表" name="deviceList" :strip="true">
                <comp-device-management></comp-device-management>
            </TabPane>
            <TabPane label="温度感应片列表" name="tempPortList">
                <comp-temp-port-management></comp-temp-port-management>
            </TabPane>
            <TabPane label="智能充电口列表" name="powerPortList">
                <comp-power-port-list></comp-power-port-list>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
    import CompDeviceManagement from "../components/CompDeviceList";
    import CompTempPortManagement from "../components/CompTempPortList";
    import CompPowerPortList from "../components/CompPowerPortList";

    export default {
        components: {
            CompDeviceManagement,
            CompTempPortManagement,
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