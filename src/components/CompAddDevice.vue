<template>
    <transition>
        <Card dis-hover title="第一步: 请对待添加设备执行" v-if="addDeviceStep === 1">
            <Steps direction="vertical" :current="-1">
                <Step title="将设备添加到专用USB接口"></Step>
                <Step title="将添加设备连接到TMach系统WLAN"></Step>
                <Step title='开启"USB调试功能"与"通过USB安装APP"'></Step>
                <Step title='关闭"自动亮度调节"，并调整到适当亮度，同时设置屏幕为常亮'></Step>
                <Step title='请在待添加设备弹出窗口中勾选 始终允许这台计算机进行调试 如果已设置，可直接点击"下一步'></Step>
            </Steps>
            <Row type="flex" justify="center" style="margin-top: 16px">
                <Button type="primary" @click="getCabinetInfo ">下一步</Button>
            </Row>
        </Card>
        <Card dis-hover title="第二步: 选择机柜" v-if="addDeviceStep === 2" style="text-align:left;">
            <br>
            <b>机柜列表：</b>
            <i-select v-model="CabinetSelected" style="width:150px">
                <i-option v-for="item in cabinetList" :value="item.id">{{ item.cabinet_name }}</i-option>
            </i-select>
            <br>
            <br>
            <b >机柜内已有设备数量： </b>
            <span style="color: #999999">  {{deviceNum}} 台 </span>
            <p style="color: #999999;margin: 20px 0 40px 0">注：每个机柜建议注册不超过50台设备</p>
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
        data() {
            return {
                addDeviceStep: 1,
                addedDeviceName: "",
                deviceInfo: utils.validate(addDeviceSerializer, {}),
                addBtn: true,
                spinShow: false,
                rescan: false,
                backStepOne: false,
                cabinetList: [],
                CabinetSelected: '',
                deviceNum: 0,
                CabinetIpSelected: ''
            }
        },
        methods: {
            reset() {
                this.addDeviceStep = 1
            },
            addDeviceError(title, desc) {
                this.$Notice.error({
                    title: title,
                    desc: desc,
                    duration: 0
                });
            },
            addDevice() {
                this.$Loading.start()
                this.spinShow = true;
                this.$ajax.post("http://" + this.CabinetIpSelected + ":5000" + "/door/set_device_in_door/",
                    {
                        deviceID: this.deviceInfo.deviceID,
                        deviceName: this.addedDeviceName
                    }
                ).then(response => {
                    if (response.data.state === "DONE") {
                        this.$Message.success("添加成功")
                        this.$Notice.success({
                            title: '设备即将重启,请稍侯...'
                        });
                        this.$emit('afterDeviceAddSuccess', response.data)
                    } else {
                        this.$Message.error("添加失败" + response.data.description)
                    }
                    this.spinShow = false;
                    this.$Loading.finish()

                }).catch(reason => {
                    this.spinShow = false;
                    this.$Message.error("添加失败")
                    this.$Loading.error()
                    this.$emit('afterDeviceAddFailed', reason)
                })
            },
            getDeviceInDoor() {
                if (this.CabinetIpSelected === "" ){
                    this.$Message.error("请先选择机柜信息")
                }
                else{
                    this.addDeviceStep = 3;
                    this.addBtn = true;
                    this.rescan = false;
                    this.backStepOne = false;
                    this.spinShow = true;
                    this.$Loading.start();
                    this.addedDeviceName = "";
                    console.log(this.CabinetIpSelected);
                    this.$ajax
                        .get("http://" + this.CabinetIpSelected + ":5000" + "/door/get_device_in_door/")
                        .then(response => {
                            if (utils.validate(addDeviceSerializer, response.data).ipAddress === null) {
                                this.addDeviceError('添加设备失败', response.data.description);
                                this.addBtn = false;
                                this.backStepOne = true;
                                this.deviceInfo = utils.validate(addDeviceSerializer, response.data);
                            } else if (utils.validate(addDeviceSerializer, response.data).ipAddress === "") {
                                this.addBtn = false;
                                this.rescan = true;
                                this.deviceInfo = utils.validate(addDeviceSerializer, response.data);
                                this.addDeviceError('ip侦测失败', '侦测不到该设备的IP地址，请确认待添加设备已连接到TMach系统WLAN！')
                            } else {
                                this.deviceInfo = utils.validate(addDeviceSerializer, response.data);
                            }
                            this.$Loading.finish();
                            this.spinShow = false;
                        })
                        .catch(error => {
                            this.addBtn = false;
                            this.rescan = true;
                            if (config.DEBUG) console.log(error)
                            this.spinShow = false;
                            this.$Loading.error();
                            this.$Message.error("获取设备信息失败！"+error.response.data.description)
                        })}
            },
            getCabinetInfo() {
                this.addDeviceStep = 2;
                this.$ajax.get("api/v1/cedar/cabinet/?fields=ip_address,cabinet_name,id")
                    .then(response => {
                        this.cabinetList = response.data.cabinets
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("取得机柜信息出错")
                    })
            }
        },
        watch: {
            CabinetSelected: function (newId, oldId) {
                this.$ajax.get("api/v1/cedar/device/?fields=id&cabinet=" + this.CabinetSelected)
                    .then(response => {
                        this.deviceNum = response.data.devices.length
                    })
                    .catch(error => {
                        if (config.DEBUG) console.log(error);
                        this.$Message.error("获取设备数量出错")
                    });
                for (var cabinet of this.cabinetList) {
                    if (cabinet.id === newId) {
                        this.CabinetIpSelected = cabinet.ip_address
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>
