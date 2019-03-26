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
                    <Button type="primary" @click="updateTempPort">保存</Button>
                    <Button style="margin-left: 8px" @click="showTempPortDetail = false">取消</Button>
                </Row>
            </FormItem>
        </Card>
    </Form>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getTempPortSerializer = {
        id: "number",
        port: "string",
        description: "string",
        device: {
            id: "number",
            device_name: "string",
            device_label: "string"
        }
    }


    export default {
        name: "CompTempPortDetail",
        data() {
            return {
                tempPort: utils.validate(getTempPortSerializer, {})
            }
        },
        methods: {
            // Data
            refresh(tempPortId){
                this.$ajax.get(
                    "api/v1/cedar/temp_port/"+tempPortId+"/?fields=" +
                    "id," +
                    "port," +
                    "description," +
                    "device," +
                    "device.id," +
                    "device.device_name," +
                    "device.device_label"
                ).then(response=>{
                    this.tempPort = utils.validate(getTempPortSerializer, response.data)
                }).catch(reason => {
                    this.$Message.error("载入失败")
                })
            },
            // Update
            updateTempPort(){
                this.$Loading.start()
                this.$ajax.patch(
                    "api/v1/cedar/temp_port/"+this.tempPort.id+"/",
                    {
                        description: this.tempPort.description
                    }
                ).then(response=>{
                    this.$emit("afterUpdateTempPortSuccess")
                    this.$Message.success("更新成功")
                    this.$Loading.finish()
                }).catch(reason => {
                    if(config.DEBUG) console.log(reason)
                    this.$Loading.error()
                    this.$Message.error("更新失败")
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