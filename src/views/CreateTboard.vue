<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <transition>
            <div v-if="current===0">
                <Modal v-model="showSelectDeviceModal" :closable="false" :fullscreen="true" @on-ok="getDeviceSelection">
                    <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                                      @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
                </Modal>
                <comp-device-list ref="deviceList" :prop-add-mode="false" :prop-auto-load="false"></comp-device-list>
                <Row type="flex" justify="center" style="margin-top: 16px;">
                    <Col>
                        <Button style="margin-right: 32px; width: 80px;" @click="showSelectDeviceModal=true">选择设备
                        </Button>
                        <Button type="primary" style="width: 80px;" @click="current=1">下一步</Button>
                    </Col>
                </Row>
            </div>
            <div v-if="current===1">
                <comp-filter></comp-filter>
            </div>
            <div v-if="current===2">

            </div>
        </transition>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";


    export default {
        components: {CompDeviceList, CompFilter},
        data() {
            return {
                current: 1,
                // Page "Choose device"
                showSelectDeviceModal: false,
                selectedDevice:[]
            }
        },
        methods: {
            // Page "Choose device"
            getDeviceSelection(){
                this.selectedDevice = this.$refs.selectDevice.getSelection()
                this.$refs.deviceList.refresh(this.selectedDevice)
            },
            onSelectDeviceModalRowClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            }
        }
    }
</script>

<style scoped>

</style>