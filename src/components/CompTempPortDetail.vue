<template>
    <Form :model="tempPort" :label-width="80">
        <Card :title="tempPort.port">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="tempPort.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">编号</b>
                <Input v-model="tempPort.port" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">关联设备</b>
                <Input :value="tempPort.device.device_name + ' (' + tempPort.device.device_label + ')'"
                       :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <Divider></Divider>
            <FormItem>
                <b slot="label">备注</b>
                <Input v-model="tempPort.description"></Input>
            </FormItem>
            <FormItem>
                <Row type="flex" justify="end">
                    <Button type="primary">保存</Button>
                    <Button style="margin-left: 8px" @click="showTempPortDetail = false">取消</Button>
                </Row>
            </FormItem>
        </Card>
    </Form>
</template>

<script>
    export default {
        name: "CompTempPortDetail",
        data() {
            return {
                tempPort: {
                    id: 1,
                    port: "TP-01",
                    description: "blabla",
                    device: {
                        id: 1,
                        device_name: "DeviceName1",
                        device_label: "DeviceLabel1"
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>