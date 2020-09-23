<template>
    <transition>
        <Card dis-hover title="第一步: 点击绿色添加按钮，开始添加僚机" v-if="addDeviceStep === 1">
            <Steps direction="vertical" :current="-1">
                <Step title="将设备添加到专用USB接口"></Step>
                <Step title="将设备连接到TMach系统WLAN"></Step>
                <Step title='开启"USB调试功能"与"通过USB安装APP"'></Step>
                <Step title='关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮'></Step>
                <Step title='请在待添加设备弹出窗口中勾选 始终允许这台计算机进行调试 如果已设置，可直接点击"下一步'></Step>
            </Steps>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="nextStep2">下一步</Button>
            </Row>
        </Card>
        <Card dis-hover v-if="addDeviceStep === 2" style="text-align:left;padding: 80px 0">
            <Spin fix v-if="spinShow">
                <Icon type="ios-loading" size=30 class="demo-spin-icon-load"></Icon>
                <div style="margin-top: 16px">正在获取僚机信息，请稍后...</div>
            </Spin>
        </Card>
        <Card dis-hover title="第二步: 确认僚机设备信息" v-if="addDeviceStep === 3">
            <Form :label-width="80">
                <FormItem>
                    <b slot="label">串号</b>
                    <Input v-model="addDeviceInfo.serial_number"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">IP</b>
                    <Input v-model="addDeviceInfo.ip_address" class="disabled-input" :disabled="true"></Input>
                </FormItem>
            </Form>
            <Row type="flex" justify="center">
                <Button style="margin-right: 40px;" @click="onCancelClick"> 取 消 </Button>
                <Button type="primary" @click="addDevice()">下一步</Button>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
        <Card dis-hover title="僚机设备信息获取失败" v-if="addDeviceStep === 4">
            <div style="text-align: center;margin: 50px">
                <Icon type="ios-close-circle-outline" size="40" color="red" />
                <p style="margin: 10px;">{{ errorMessage }}</p>
            </div>
            <Row type="flex" justify="center">
                <Button style="margin-right: 40px;" @click="onCancelClick"> 取 消 </Button>
                <Button type="primary" @click="getDeviceInDoor">重 试</Button>
            </Row>
        </Card>
        <Card dis-hover title="僚机设备添加失败" v-if="addDeviceStep === 5">
            <div style="text-align: center;margin: 50px">
                <Icon type="ios-close-circle-outline" size="40" color="red" />
                <p style="margin: 10px;">添加失败</p>
            </div>
            <Row type="flex" justify="center">
                <Button style="margin-right: 40px;" @click="onCancelClick"> 取 消 </Button>
                <Button type="primary" @click="getDeviceInDoor">重 试</Button>
            </Row>
        </Card>
    </transition>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const addDeviceSerializer = {
        ip_address: "string",
        serial_number: "string"
    }

    export default {
        props:{
            propIndex:{
                type: Number
            },
            propIp:{
                type: String
            },
            propDeviceId:{
                type: Number
            }
        },
        data() {
            return {
                addDeviceStep: 1,
                addDeviceInfo: utils.validate(addDeviceSerializer, {}),
                errorMessage:"",
                spinShow:false,
            }
        },
        methods: {
            reset() {
                this.addDeviceStep = 1
            },
            nextStep2(){
                this.addDeviceStep = 2
                this.getDeviceInDoor()
            },
            getDeviceInDoor(){
                this.addDeviceStep = 2
                this.spinShow = true
                this.$ajax.get("http://" + this.propIp + ":5000" + "/door/get_assistance_device_in_door/")
                    .then(response => {
                        this.addDeviceInfo = response.data
                        this.addDeviceStep = 3
                        this.spinShow = false;
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.spinShow = false;
                        if(error.response.data.error_code===1001){
                            this.errorMessage = "请确认当前设备是否连接到TMach系统中"
                        }else if(error.response.data.error_code===1000){
                             this.errorMessage = "请确认当前系统中是否连接了多个僚机设备"
                        }else if(error.response.data.error_code===1007){
                             this.errorMessage = "该设备已被注册，请先将其移除，在进行操作"
                        }else
                            this.errorMessage = "获取僚机信息失败！"+error.response.data.description
                        this.addDeviceStep = 4
                    })
            },
            addDevice(){
                let id = []
                id.push(this.propDeviceId)

                if(this.addDeviceInfo.ip_address===""){
                    this.$Message.warning("IP信息不能为空，请确认设备是否连接到TMach系统WLAN")
                    return
                }
                this.spinShow = true;
                this.$ajax.post("http://" + this.propIp + ":5000" + "/door/set_assistance_device_in_door/",
                    {
                        serial_number: this.addDeviceInfo.serial_number,
                        ip_address: this.addDeviceInfo.ip_address,
                        order: this.propIndex,
                        devices: id
                    }
                ).then(response => {
                    if (response.data.state === "DONE") {
                        this.$Message.success("添加成功")
                        this.$emit('afterDeviceAddSuccess', response.data)
                    } else {
                        this.addDeviceStep = 5
                    }
                    this.spinShow = false;
                }).catch(reason => {
                    this.spinShow = false;
                    this.addDeviceStep = 5
                })
            },
            onCancelClick(){
                this.$emit("onClose",false)
            }
        },
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
</style>
