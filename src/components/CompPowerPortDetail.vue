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
                <Input :value="powerPort.device_display_name"
                       :disabled="true" class="disabled-input"></Input>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getPowerPortSerializer = {
        id: "number",
        port: "string",
        device: {
            id: "number",
            device_name: "string",
            device_label: "string"
        }
    }
    export default {
        name: "CompPowerDetail",
        data(){
            return {
                powerPort: {
                    id: 1,
                    port: "PA-01",
                    device_display_name: "",
                    device: {
                        device_name: "DeviceName1",
                        device_label: "DeviceLabel1"
                    }
                }
            }
        },
        methods:{
            refresh(powerPortId){
                this.$ajax.get(
                    "api/v1/cedar/power_port/"+powerPortId+"/?fields=" +
                    "id," +
                    "port," +
                    "device," +
                    "device.device_name," +
                    "device.device_label"
                ).then(response=>{
                    this.powerPort = utils.validate(getPowerPortSerializer, response.data)
                    if(this.powerPort.device.id !== null)
                        this.powerPort.device_display_name = this.powerPort.device.device_name + "(" + this.powerPort.device.device_label + ")"
                }).catch(reason=>{
                    if(config.DEBUG) console.log(reason)
                    this.$Message.error("载入失败")
                })
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