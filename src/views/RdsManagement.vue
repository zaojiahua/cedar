<template>
    <div>
        <Modal v-model="showSelectDeviceModal" :fullscreen="true" :transfer="false" :closable="false" @on-ok="getDeviceSelection">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>
        <Tabs style="margin-right: 192px;">
            <TabPane label="设备测试数据">
                <Row type="flex" style="margin-bottom: 16px;" align="bottom">
                    <Button type="primary" style="margin-right: 16px;" @click="showSelectDeviceModal=true">选取设备</Button>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                    <Tag closable type="border">Device1</Tag>
                </Row>
                <Row style="margin-bottom: 16px;">
                    <DatePicker placeholder="测试开始时间"></DatePicker>
                </Row>
                <Row type="flex">
                    <Col span="24">
                        <comp-rds-list ref="rdsList" v-for="item in deviceLabelList" :key="item.id" :prop-device-label="item.device_label" :prop-device-id="item.id"></comp-rds-list>
                    </Col>
                </Row>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </TabPane>
            <TabPane label="型号测试数据">123</TabPane>
            <TabPane label="搜索">123</TabPane>
        </Tabs>
        <div style="position: fixed; bottom: 2px; right: 2px; background-color: #434343;border-radius: 5px;opacity: 0.9">
            <Form :label-width="100" class="rds-info">
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">测试结果ID：</b>
                    <p>1</p>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">设备名称：</b>
                    <p>1</p>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">用例名称：</b>
                    <p>JobName</p>
                </FormItem>
                <FormItem style="margin-bottom: 0px;">
                    <b slot="label">任务名称：</b>
                    <p></p>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import CompTooltip from "../components/CompTooltip";
    import CompDeviceList from "../components/CompDeviceList";
    import CompRdsList from "../components/CompRdsList";
    import config from "../lib/config";

    export default {
        components: {CompTooltip,CompDeviceList,CompRdsList},
        data() {
            return {
                collapse: [1],
                showSelectDeviceModal:false,
                deviceLabelList:[],
                spinShow:false,
            }
        },
        methods:{
            getDeviceSelection(){
                this.deviceLabelList = this.$refs.selectDevice.getSelection()
            },
            onSelectDeviceModalRowClick(data, index){
                this.$refs.selectDevice.toggleSelect(index)
            },
        }
    }

</script>

<style scoped>
    .rds-info b,.rds-info p{
        color: #f2f2f2;
    }
</style>