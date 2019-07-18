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
                <Button type="primary" @click="getDeviceInDoor">下一步</Button>
                <!--<Button type="error" @click="addDeviceError('ip侦测失败', '侦测不到该装置的IP位置，请确认待添加设备已连接到系统TMach系统WLAN！')">错误DEMO</Button>-->
            </Row>
        </Card>
        <Card dis-hover title="第三步: 添加设备" v-if="addDeviceStep === 3">
            <Form :label-width="80">
                <FormItem>
                    <b slot="label">设备编号</b>
                    <p>{{ deviceInfo.deviceID }}</p>
                </FormItem>
                <FormItem>
                    <b slot="label">ROM版本</b>
                    <p>{{ deviceInfo.buildInc }}</p>
                </FormItem>
                <FormItem>
                    <b slot="label">安卓版本</b>
                    <p>{{ deviceInfo.buildVer }}</p>
                </FormItem>
                <FormItem>
                    <b slot="label">IP地址</b>
                    <p>{{ deviceInfo.ipAddress }}</p>
                </FormItem>
                <FormItem>
                    <b slot="label">自定义名称</b>
                    <Input v-model="addedDeviceName"></Input>
                </FormItem>
            </Form>
            <Row type="flex" justify="center">
                <Button type="primary" v-if="addBtn" @click="addDevice()">添加</Button>
                <Button type="primary" v-if="rescan" @click="getDeviceInDoor()">重新扫描</Button>
                <Button type="primary" v-if="backStepOne" @click="addDeviceStep=1 ">返回第一步</Button>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
    </transition>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"
    const addDeviceSerializer = {
        buildInc: "string",
        buildVer: "string",
        deviceID: "string",
        ipAddress: "string"
    }

    export default {
        name: "CompAddDevice",
        data(){
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
                deviceInfo:utils.validate(addDeviceSerializer,{}),
                addBtn:true,
                spinShow:false,
                rescan:false,
                backStepOne:false,
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
                this.spinShow = true;
                this.$ajax.post("api/v1/cedar/set_device_in_door/",
                    {
                        deviceID: this.deviceInfo.deviceID,
                        deviceName: this.addedDeviceName
                    }
                ).then(response=>{
                    if(response.data.state==="DONE"){
                        this.$Message.success("添加成功")
                        this.$emit('afterDeviceAddSuccess', response.data)
                    }else{
                        this.$Message.error("添加失败！")
                    }
                    this.spinShow = false;
                    this.$Loading.finish()

                }).catch(reason=>{
                    this.spinShow = false;
                    this.$Message.error("添加失败")
                    this.$Loading.error()
                    this.$emit('afterDeviceAddFailed', reason)
                })
            },
            getDeviceInDoor(){
                this.addDeviceStep=3;
                this.addBtn = true;
                this.rescan = false;
                this.backStepOne = false;
                this.spinShow = true;
                this.$Loading.start();
                this.addedDeviceName="";
                this.$ajax
                    .post("api/v1/cedar/get_device_in_door/", {})
                    .then(response=>{
                        if(utils.validate(addDeviceSerializer,response.data).ipAddress===null){
                            this.addDeviceError('未找到可添加设备', '请将设备从USB上拔除,并返回第一步确认操作无遗漏')
                            this.addBtn = false;
                            this.backStepOne = true;
                            this.deviceInfo = utils.validate(addDeviceSerializer,response.data);
                        }else if(utils.validate(addDeviceSerializer,response.data).ipAddress===""){
                            this.addBtn = false;
                            this.rescan = true;
                            this.deviceInfo = utils.validate(addDeviceSerializer,response.data);
                            this.addDeviceError('ip侦测失败', '侦测不到该设备的IP地址，请确认待添加设备已连接到TMach系统WLAN！')
                        }else{
                            this.deviceInfo = utils.validate(addDeviceSerializer,response.data);
                        }
                        this.$Loading.finish();
                        this.spinShow=false;
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.spinShow=false;
                        this.$Loading.error();
                        this.$Message.error("获取设备信息失败！")
                    })
            },
        }
    }
</script>

<style scoped>

</style>