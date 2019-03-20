<template>
    <Card :title="powerPort.port">
        <Form :label-width="80">
            <FormItem>
                <b slot="label">ID</b>
                <Input v-model="powerPort.id" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">编号</b>
                <Input v-model="powerPort.port" :disabled="true" class="disabled-input"></Input>
            </FormItem>
            <FormItem>
                <b slot="label">关联设备</b>
                <Input :value="powerPort.device.device_name+' ('+powerPort.device.device_label+')'"
                       :disabled="true" class="disabled-input"></Input>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    export default {
        name: "CompPowerDetail",
        data(){
            return {
                powerPort: {
                    id: 1,
                    port: "PA-01",
                    device: {
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