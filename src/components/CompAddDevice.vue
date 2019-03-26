<template>
    <transition>
        <Card dis-hover title="第一步: 请对待添加设备执行" v-if="addDeviceStep === 1">
            <Steps direction="vertical" :current="-1">
                <Step title="将设备添加到专用USB接口"></Step>
                <Step title="将添加设备连接到TMach系统WLAN"></Step>
                <Step title='开启"USB调试功能"与"通过USB安装APP"'></Step>
                <Step title='关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮'></Step>
            </Steps>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="addDeviceStep=2 ">下一步</Button>
            </Row>
        </Card>
        <Card dis-hover title="第二步: 设置权限" v-if="addDeviceStep === 2" style="text-align:center;">
            <p>请在待添加设备弹出窗口中勾选</p>
            <p><b>始终允许这台计算机进行调试</b></p>
            <p>并点击确定</p>
            <br><br><br><br><br><br>
            <small>(如果已设置，可直接点击"下一步")</small>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="addDeviceStep=3 ">下一步</Button>
                <Button type="error" @click="addDeviceError('ip侦测失败', '侦测不到xxx装置的IP位置')">错误DEMO</Button>
            </Row>
        </Card>
        <Card dis-hover title="第三步: 添加设备" v-if="addDeviceStep === 3">
            <Form :label-width="80">
                <FormItem>
                    <b slot="label">设备编号</b>
                    <p>Device</p>
                </FormItem>
                <FormItem>
                    <b slot="label">ROM版本</b>
                    <p>6.3.24</p>
                </FormItem>
                <FormItem>
                    <b slot="label">安卓版本</b>
                    <p>5.0.2</p>
                </FormItem>
                <FormItem>
                    <b slot="label">IP位置</b>
                    <p>10.80.3.101</p>
                </FormItem>
                <FormItem>
                    <b slot="label">自定义名称</b>
                    <Input v-model="addedDeviceName"></Input>
                </FormItem>
            </Form>
            <Row type="flex" justify="center">
                <Button type="primary" @click="addDevice()">添加</Button>
            </Row>
        </Card>
    </transition>
</template>

<script>
    export default {
        name: "CompAddDevice",
        data(){
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
            }
        },
        methods:{
            reset(){
                this.addDeviceStep = 1
            },
            addDeviceError(title, desc) {
                this.$Notice.error({
                    title: title,
                    desc: desc,
                    duration: 0
                });
            },
            addDevice(){
                this.$Loading.start()
                this.$ajax.post(
                    "api/v1/cedar/device/",
                    {
                        device_label: "Device"+ (new Date()).toJSON(),
                        device_name: this.addedDeviceName,
                        cpu_id: "CPU_ID",
                        rom_version: 1,
                        monitor_index: [1]
                    }
                ).then(response=>{
                    this.$Message.success("添加成功")
                    this.$Loading.finish()
                    this.$emit('afterDeviceAddSuccess', response.data)
                }).catch(reason=>{
                    this.$Message.error("添加失败")
                    this.$Loading.error()
                    this.$emit('afterDeviceAddFailed', reason)
                })
            },
        }
    }
</script>

<style scoped>

</style>