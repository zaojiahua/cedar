<template>
    <Card title="详细讯息">
        <Form :model="tempPort" :label-width="80">
            <FormItem >
                <b slot="label">ID</b>
                <Input v-model="tempPort.id" :readonly="true"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">编号</b>
                <Input v-model="tempPort.port"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">备注</b>
                <Input v-model="tempPort.description"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">关联设备</b>
                <Select v-model="tempPort.device.id">
                    <Option value="1">DeviceName1 (DeviceLabel1)</Option>
                    <Option value="2">DeviceName2 (DeviceLabel2)</Option>
                    <Option value="3">DeviceName3 (DeviceLabel3)</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Row type="flex" justify="end">
                    <Button type="primary">保存</Button>
                    <Button style="margin-left: 8px" @click="showTempPortDetail = false">取消</Button>
                </Row>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    export default {
        name: "CompTempPortDetail",
        data(){
            return {
                tempPort: {
                    id: 1,
                    port: "TP-01",
                    description: "blabla",
                    device: {
                        id: 1,
                        device_name: "Device_name1"
                    }
                }
            }
        }
    }
</script>

<style scoped>
    p{
        margin-bottom: 16px;
    }
</style>