<template>
    <Card dis-hover>
        <Steps :current="current" style="margin-bottom: 16px;">
            <Step title="选择设备"></Step>
            <Step title="选择用例"></Step>
            <Step title="填写信息"></Step>
        </Steps>
        <div v-if="current===0">
            <Modal v-model="showSelectDeviceModal" :fullscreen="true" :transfer="false" :closable="false" @on-ok="getDeviceSelection">
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
            <Row>
                <comp-filter @on-change="onJobFilterChange"></comp-filter>
            </Row>
            <Row type="flex" style="margin-top: 16px;">
                <Col span="11">
                    <comp-job-list ref="jobList" :prop-multi-select="true"></comp-job-list>
                </Col>
                <Col span="2">
                    <Row type="flex" justify="center"style="margin: auto;">
                        <Button @click="selectJob">
                            添加
                            <Icon type="ios-arrow-forward" />
                        </Button>
                    </Row>
                </Col>
                <Col span="11">
                    <comp-job-list ref="jobSelectedList" :prop-auto-load="false"
                                   :prop-show-counter="true" :prop-deletable="true"></comp-job-list>
                </Col>
            </Row>
            <Row type="flex" justify="center" style="margin-top: 32px;">
                <Button type="primary" style="width: 80px;" @click="current=0;">上一步</Button>
                <Button type="primary" style="width: 80px; margin-left:32px;" @click="current=2;">下一步</Button>
            </Row>
        </div>


        <div v-if="current===2">

        </div>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";


    export default {
        components: {CompJobList, CompDeviceList, CompFilter},
        data() {
            return {
                current: 0,
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
            },
            // Page "Choose job"
            onJobFilterChange(selected){

            },
            selectJob(){
                this.$refs.jobSelectedList.refresh(this.$refs.jobSelectedList.getData().concat(this.$refs.jobList.getSelectedData()))
            }
        }
    }
</script>

<style scoped>

</style>