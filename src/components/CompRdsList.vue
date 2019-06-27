<template>
    <div class="content">
        <Modal v-model="showSelectDeviceModal" :fullscreen="true" :closable="false"
               @on-ok="getDeviceSelection">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>
        <Row type="flex" style="margin-bottom: 16px;" align="bottom">
            <Button type="primary" style="margin-right: 16px;" @click="showSelectDeviceModal=true">选取设备</Button>
            <Tag closable type="border" v-for="(device, index) in devices" :key="device.id" :name="index"
                 @on-close="devices.splice(index, 1)">{{device.device_name}} ({{device.device_label}})
            </Tag>
        </Row>
        <Row style="margin-bottom: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true"></DatePicker>
        </Row>
        <Row type="flex">
            <Col span="24">
                <comp-rds-card ref="rdsCard" v-for="item in devices" :key="item.id"
                               :prop-device-id="item.id"
                               :prop-device-label="item.device_label"
                               :prop-default-tboards="defaultTboards"
                               :prop-default-jobs="defaultJobs"
                               :prop-filter-date-range="filterDateRange"
                               @rds-mouse-enter="onRdsMouseEnter"
                               @rds-mouse-leave="onRdsMouseLeave"></comp-rds-card>
            </Col>
        </Row>
        <Row v-show="devices.length === 0" type="flex" justify="center" style="margin-top: 16px;">
            <p style="color: rgb(194, 194, 194); font-size: larger; font-weight: bold;">您还没有选择任何设备!</p>
        </Row>
        <div v-show="tipData.id" style="position: fixed; bottom: 2px; right: 2px; background-color: #434343; border-radius: 5px;
                    opacity: 0.9; color: #ebf7ff; padding: 8px;">
            <span>ID：</span>
            <span>{{tipData.id}}</span>
            <br>
            <span>设备名称：</span>
            <span>{{tipData.device.device_name}}</span>
            <br>
            <span>用例名称：</span>
            <span>{{tipData.job.job_name}}</span>
            <br>
            <span>结果：</span>
            <span>{{tipData.job_assessment_value}}</span>
        </div>
    </div>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompRdsCard from "../components/CompRdsCard";
    import utils from "../lib/utils";

    const tipDataSerializer = {
        id: "number",
        device: {
            device_name: "string"
        },
        job: {
            job_name: "string"
        },
        job_assessment_value: "string"
    }
    const getDataSerializer = {
        tboards: [
            {
                id: "number",
                board_name: "string",
                device: [
                    {
                        id: "number",
                        device_label: "string",
                        device_name: "string"
                    }
                ],
                job: [
                    {
                        id: "number",
                        job_label: "string",
                        job_name: "string"
                    }
                ]
            }
        ]
    }

    export default {
        components: {CompDeviceList, CompRdsCard},
        data() {
            return {
                showSelectDeviceModal: false,
                devices: [],
                tipData: utils.validate(tipDataSerializer, null),
                defaultTboards: [],
                defaultJobs: [],
                filterDateRange:null,
            }
        },
        methods: {
            getDeviceSelection() {
                this.devices = this.$refs.selectDevice.getSelection()
            },
            onSelectDeviceModalRowClick(data, index) {
                this.$refs.selectDevice.toggleSelect(index)
            },
            onRdsMouseEnter(rds) {
                this.tipData = utils.validate(tipDataSerializer, rds)
            },
            onRdsMouseLeave() {
                this.tipData = utils.validate(tipDataSerializer, null)
            }
        },
        mounted(){
            let tboardId = NaN
            if(this.$route.query.hasOwnProperty("tboard")) {
                tboardId = _.parseInt(this.$route.query.tboard)
            }
            if(isNaN(tboardId)) return
            this.$ajax.get("api/v1/cedar/tboard/?" +
                "fields=" +
                "id," +
                "board_name," +
                "device," +
                "device.id," +
                "device.device_label," +
                "device.device_name," +
                "job," +
                "job.id," +
                "job.job_label," +
                "job.job_name" +
                "&id=" + tboardId)
                .then(response=>{
                    let data = utils.validate(getDataSerializer, response.data)
                    if(data.tboards.length > 0){
                        this.devices = data.tboards[0].device
                        this.defaultTboards.push({
                            id: data.tboards[0].id,
                            board_name: data.tboards[0].board_name
                        })
                        this.defaultJobs = data.tboards[0].job
                    }
                })
        }
    }
</script>

<style scoped>
    .rds-info b, .rds-info p {
        color: #f2f2f2;
    }
    .content{
        height: calc(100vh - 150px);
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>